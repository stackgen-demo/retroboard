import os
import re
from typing import List
import boto3
from fastapi import FastAPI, Response, status
from mangum import Mangum
from errors import NotFoundException, ServerErrorException
import logging
from models import *
from repo import BoardRepo, initialize_db

from fastapi.middleware.cors import CORSMiddleware
from env import S3_APP_URL, SNS_TOPIC_SLACK_ALERTS_ARN, SQS_SEND_EMAIL_QUEUE_URL

origins = [
    S3_APP_URL,
    "http://localhost:3000",
]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.description = "api to create a board with notes"

db = initialize_db()
sqs_client = boto3.client("sqs")
sns_client = boto3.client("sns")
repo = BoardRepo(db)


@app.post("/boards", status_code=status.HTTP_201_CREATED, response_model=Board)
def create_board(board: BoardBase):
    # generate url friendly slug from name
    slug = re.sub(r"\W+", "-", board.name.lower())
    board = repo.createNewBoard(
        BoardBase(name=board.name, slug=slug, section_details=board.section_details)
    )
    sns_client.publish(
        TopicArn=SNS_TOPIC_SLACK_ALERTS_ARN,
        Message=f"New board created: {board.name} with slug: {board.slug} and id {board.id}",
    )
    return board


@app.post(
    "/boards/{board_id}/notes", status_code=status.HTTP_201_CREATED, response_model=Note
)
def create_note(board_id: str, note: NoteBase):
    return repo.addNoteToBoard(board_id, note)


@app.get("/boards/{board_id}", response_model=Board)
def get_board(board_id: str):
    return repo.getBoard(board_id)


@app.get("/boards/{board_id}/notes", response_model=List[Note])
def get_notes(board_id: str, section_number: int = None):
    return repo.getNotes(board_id, section_number)


@app.delete("/boards/{board_id}/notes/{note_id}", response_model=MessageResponse)
def delete_note(board_id: str, note_id: str):
    return repo.deleteNoteFromBoard(board_id, note_id)


@app.put(
    "/boards/{board_id}/notes/{note_id}",
    responses={200: {"model": Note}, 404: {"model": MessageResponse}, 500: {"model": MessageResponse}},
)
def update_note(board_id: str, note_id: str, note: NoteBase, response: Response):
    try:
        response = repo.updateNote(board_id, note_id, note)
        return response
    except Exception as e:
        if isinstance(e, NotFoundException):
            response.status_code = status.HTTP_404_NOT_FOUND
        elif isinstance(e, ServerErrorException):
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return MessageResponse(message=str(e))


@app.put(
    "/boards/{board_id}/notes/{note_id}/vote", response_model=NoteIDAndVoteResponse
)
def vote_on_note(board_id: str, note_id: str):
    return repo.voteOnNote(board_id, note_id)


@app.post("/email-summary")
def email_summary(body: EmailSummaryRequest, response: Response):
    board = repo.getBoard(body.board_id)
    if board is None:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "Board not found "}
    total_notes = 0
    total_votes = 0
    notes = {}
    sections = {}
    for index, section_number in enumerate(board.section_details):
        sections[index + 1] = section_number
        notes[index + 1] = []

    for section_notes in board.notes:
        total_notes += 1
        total_votes += section_notes.votes
        notes[section_notes.section_number].append(
            {"note_text": section_notes.text, "votes": section_notes.votes}
        )

    notes_summary = ""

    for section_number in sections:
        notes_summary += f"## {sections[section_number]}\n"
        if len(notes[section_number]) == 0:
            notes_summary += "no notes in this section\n"
            continue
        for section_notes in notes[section_number]:
            notes_summary += (
                f"- {section_notes['votes']} x 👍 | {section_notes['note_text']}\n"
            )
        notes_summary += "\n"

    email_summary = EmailSQSMessage(
        to=body.email_address,
        board_slug=board.slug,
        total_notes=total_notes,
        total_votes=total_votes,
        notes_text=notes_summary,
    )

    sqs_response = sqs_client.send_message(
        QueueUrl=SQS_SEND_EMAIL_QUEUE_URL,
        MessageBody=email_summary.model_dump_json(),
    )
    if sqs_response["ResponseMetadata"]["HTTPStatusCode"] != 200:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        print(sqs_response)
        return {"message": "Failed to send email summary"}

    return {"message": "Email summary will be sent shortly"}


mangum_app = Mangum(app, lifespan="off")
