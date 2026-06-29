from pydantic import BaseModel


class RoomOut(BaseModel):
    id: int
    name: str
    slug: str
    initials: str
    color: str
    description: str
    tags: list[str]
    members: int
    joined: bool

    class Config:
        from_attributes = True
