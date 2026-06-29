from datetime import datetime

from pydantic import BaseModel


class UserOut(BaseModel):
    id: int
    email: str
    username: str
    display_name: str
    avatar_color: str
    bio: str | None = None
    theme: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    display_name: str | None = None
    username: str | None = None
    email: str | None = None
    bio: str | None = None
    avatar_color: str | None = None
    theme: str | None = None
