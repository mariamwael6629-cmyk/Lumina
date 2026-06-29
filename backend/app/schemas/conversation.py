from datetime import datetime

from pydantic import BaseModel

from app.schemas.message import MessageOut


class ConversationOut(BaseModel):
    id: int
    name: str
    initials: str
    color: str
    is_group: bool
    status: str
    preview: str
    time: str
    unread: int

    class Config:
        from_attributes = True


class ConversationDetailOut(BaseModel):
    id: int
    name: str
    initials: str
    color: str
    is_group: bool
    status: str
    messages: list[MessageOut]
