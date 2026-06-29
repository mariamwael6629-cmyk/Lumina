from datetime import datetime

from pydantic import BaseModel


class MessageCreate(BaseModel):
    text: str | None = None

    class Config:
        str_strip_whitespace = True


class ReactionOut(BaseModel):
    e: str
    n: int


class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    sender_name: str
    sender_initials: str
    sender_color: str
    is_mine: bool
    text: str | None = None
    image_emoji: str | None = None
    image_bg: str | None = None
    reactions: list[ReactionOut] | None = None
    is_seen: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ReactionRequest(BaseModel):
    emoji: str
