from pydantic import BaseModel, Field


class BoardBase(BaseModel):
    name: str = Field(examples=["Board Name"], min_length=3, max_length=24)
    slug: str = ""
    section_details: list = Field(
        examples=[["Section 1", "Section 2"]], min_length=1, max_length=6
    )


class Board(BoardBase):
    id: str
    notes: list


class NoteBase(BaseModel):
    section_number: int = Field(examples=[1, 2])
    text: str = Field(examples=["Note text\n\nMore text\n\nEven more text"])
    votes: int = Field(examples=[0, 1, 10], ge=0, default=0)


class NoteIDAndVoteResponse(BaseModel):
    id: str
    votes: int


class Note(NoteBase):
    id: str
    created_at: str
    updated_at: str


class MessageResponse(BaseModel):
    message: str


class EmailSummaryRequest(BaseModel):
    board_id: str = Field(default=None, examples=["prRasdf12-"])
    email_address: str = Field(default=None, examples=["user@example.com"])


class EmailSQSMessage(BaseModel):
    to: str
    board_slug: str
    total_notes: int
    total_votes: int
    notes_text: str
