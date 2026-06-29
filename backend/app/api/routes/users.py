from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.exceptions import ConflictError
from app.models.user import User
from app.schemas.user import UserOut, UserUpdateRequest

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserOut)
def update_me(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.email and payload.email != current_user.email:
        if db.query(User).filter(User.email == payload.email, User.id != current_user.id).first():
            raise ConflictError("Email already in use")
        current_user.email = payload.email

    if payload.username and payload.username != current_user.username:
        if db.query(User).filter(User.username == payload.username, User.id != current_user.id).first():
            raise ConflictError("Username already taken")
        current_user.username = payload.username

    if payload.display_name is not None:
        current_user.display_name = payload.display_name
    if payload.bio is not None:
        current_user.bio = payload.bio
    if payload.avatar_color is not None:
        current_user.avatar_color = payload.avatar_color
    if payload.theme is not None:
        current_user.theme = payload.theme

    db.commit()
    db.refresh(current_user)
    return current_user
