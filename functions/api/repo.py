from datetime import datetime
import os
import boto3.dynamodb
from boto3.resources.base import ServiceResource
import boto3
from nanoid import generate as nanoid

from errors import NotFoundException, ServerErrorException
from models import (
    Board,
    BoardBase,
    Note,
    NoteBase,
    NoteIDAndVoteResponse,
)
from env import DYNAMODB_TABLE_NAME

DEFAULT_ID_LENGTH = 10


def initialize_db() -> ServiceResource:
    ddb = boto3.resource("dynamodb")
    return ddb


class BoardRepo:
    def __init__(self, db: ServiceResource):
        self.db = db

    def createNewBoard(self, board: BoardBase):
        table = self.db.Table(DYNAMODB_TABLE_NAME)
        board_id = nanoid(size=DEFAULT_ID_LENGTH)
        response = table.put_item(
            Item={
                "board_id": board_id,
                "sk": "details",
                "id": board_id,
                "name": board.name,
                "slug": board.slug,
                "section_details": board.section_details,
            }
        )

        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return Board(
                id=board_id,
                name=board.name,
                slug=board.slug,
                section_details=board.section_details,
                notes=[],
            )
        else:
            return None

    def addNoteToBoard(self, board_id: str, note: NoteBase):
        table = self.db.Table(DYNAMODB_TABLE_NAME)
        note_id = nanoid(size=DEFAULT_ID_LENGTH)
        now = datetime.now().isoformat()
        response = table.put_item(
            Item={
                "board_id": board_id,
                "sk": f"note#{note_id}",
                "id": note_id,
                "section_number": note.section_number,
                "note_text": note.text,
                "votes": note.votes,
                "created_at": now,
                "updated_at": now,
            }
        )
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return Note(
                id=note_id,
                section_number=note.section_number,
                text=note.text,
                votes=note.votes,
                created_at=now,
                updated_at=now,
            )
        else:
            return None

    def getBoard(self, id: str):
        table = self.db.Table(DYNAMODB_TABLE_NAME)
        response = table.query(
            KeyConditionExpression="board_id = :board_id",
            ExpressionAttributeValues={":board_id": id},
        )
        if (
            response["ResponseMetadata"]["HTTPStatusCode"] != 200
            or len(response["Items"]) == 0
        ):
            return None

        notes = []
        for item in response["Items"]:
            if item["sk"] == "details":
                board_name = item["name"]
                board_slug = item["slug"]
                board_section_details = item["section_details"]
            if item["sk"].startswith("note#"):
                notes.append(
                    Note(
                        id=item["id"],
                        section_number=item["section_number"],
                        text=item["note_text"],
                        votes=item["votes"],
                        created_at=item["created_at"],
                        updated_at=item["updated_at"],
                    )
                )
        return Board(
            id=id,
            name=board_name,
            slug=board_slug,
            section_details=board_section_details,
            notes=notes,
        )

    def getNotes(self, board_id: str, section_number: int):
        table = self.db.Table(DYNAMODB_TABLE_NAME)

        if section_number is not None:
            response = table.query(
                KeyConditionExpression="board_id = :board_id and begins_with(sk, :sk)",
                ExpressionAttributeValues={
                    ":board_id": board_id,
                    ":sk": "note#",
                    ":section_number": section_number,
                },
                FilterExpression="section_number = :section_number",
            )
        else:
            response = table.query(
                KeyConditionExpression="board_id = :board_id and begins_with(sk, :sk)",
                ExpressionAttributeValues={":board_id": board_id, ":sk": "note#"},
            )
        if response["ResponseMetadata"]["HTTPStatusCode"] != 200:
            return None

        notes = []
        for item in response["Items"]:
            notes.append(
                Note(
                    id=item["id"],
                    section_number=item["section_number"],
                    text=item["note_text"],
                    votes=item["votes"],
                    created_at=item["created_at"],
                    updated_at=item["updated_at"],
                )
            )
        return notes

    def deleteNoteFromBoard(self, board_id: str, note_id: str):
        table = self.db.Table(DYNAMODB_TABLE_NAME)
        response = table.delete_item(
            Key={
                "board_id": board_id,
                "sk": f"note#{note_id}",
            }
        )
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return {"message": "Note deleted successfully"}
        else:
            return None

    def updateNote(self, board_id: str, note_id: str, note: NoteBase):
        table = self.db.Table(DYNAMODB_TABLE_NAME)
        now = datetime.now().isoformat()
        try:
            response = table.update_item(
                Key={
                    "board_id": board_id,
                    "sk": f"note#{note_id}",
                },
                UpdateExpression="set section_number = :section_number, note_text = :note_text, updated_at = :updated_at",
                ConditionExpression="attribute_exists(board_id)",
                ExpressionAttributeValues={
                    ":section_number": note.section_number,
                    ":note_text": note.text,
                    ":updated_at": now,
                },
                ReturnValues="ALL_NEW",
            )
        except Exception as e:
            print(e)
            raise NotFoundException("Note not found")
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return Note(
                id=note_id,
                section_number=note.section_number,
                text=note.text,
                votes=response["Attributes"]["votes"],
                created_at=response["Attributes"]["created_at"],
                updated_at=response["Attributes"]["updated_at"],
            )
        else:
            print(response)
            raise ServerErrorException("Note could not be updated")

    def voteOnNote(self, board_id: str, note_id: str):
        table = self.db.Table(DYNAMODB_TABLE_NAME)
        response = table.update_item(
            Key={
                "board_id": board_id,
                "sk": f"note#{note_id}",
            },
            UpdateExpression="set votes = votes + :val",
            ExpressionAttributeValues={":val": 1},
            ReturnValues="UPDATED_NEW",
        )
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return NoteIDAndVoteResponse(
                id=note_id, votes=response["Attributes"]["votes"]
            )
        else:
            return None
