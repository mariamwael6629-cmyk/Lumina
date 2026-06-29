from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.room import RoomOut
from app.services import room_service

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


@router.get("", response_model=list[RoomOut])
def list_rooms(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return room_service.list_rooms(db, current_user)


@router.post("/{room_id}/join", response_model=RoomOut)
def join_room(
    room_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return room_service.join_room(db, current_user, room_id)
