from sqlalchemy.orm import Session

from app.exceptions import ConflictError, NotFoundError
from app.models.room import Room, RoomMembership
from app.models.user import User
from app.schemas.room import RoomOut


def list_rooms(db: Session, user: User) -> list[RoomOut]:
    rooms = db.query(Room).order_by(Room.id.asc()).all()
    joined_ids = {
        m.room_id
        for m in db.query(RoomMembership).filter(RoomMembership.user_id == user.id).all()
    }

    result = []
    for room in rooms:
        joined = room.id in joined_ids
        result.append(
            RoomOut(
                id=room.id,
                name=room.name,
                slug=room.slug,
                initials=room.initials,
                color=room.color,
                description=room.description,
                tags=[t for t in room.tags.split(",") if t],
                members=room.base_member_count + (1 if joined else 0),
                joined=joined,
            )
        )
    return result


def join_room(db: Session, user: User, room_id: int) -> RoomOut:
    room = db.get(Room, room_id)
    if not room:
        raise NotFoundError("Room not found")

    existing = (
        db.query(RoomMembership)
        .filter(RoomMembership.room_id == room_id, RoomMembership.user_id == user.id)
        .first()
    )
    if existing:
        raise ConflictError("You already joined this room")

    db.add(RoomMembership(room_id=room_id, user_id=user.id))
    db.commit()

    return RoomOut(
        id=room.id,
        name=room.name,
        slug=room.slug,
        initials=room.initials,
        color=room.color,
        description=room.description,
        tags=[t for t in room.tags.split(",") if t],
        members=room.base_member_count + 1,
        joined=True,
    )
