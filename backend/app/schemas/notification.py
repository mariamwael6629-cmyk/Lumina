from datetime import datetime

from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: int
    actor_name: str
    actor_initials: str
    actor_color: str
    text: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
