from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.exceptions import ConflictError, UnauthorizedError
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.seed_service import seed_demo_data_for_user

AVATAR_COLORS = [
    "linear-gradient(135deg,#7c3aed,#06b6d4)",
    "linear-gradient(135deg,#f472b6,#7c3aed)",
    "linear-gradient(135deg,#10b981,#06b6d4)",
    "linear-gradient(135deg,#f59e0b,#ec4899)",
    "linear-gradient(135deg,#6366f1,#f472b6)",
]


def register_user(db: Session, payload: RegisterRequest) -> User:
    if db.query(User).filter(User.email == payload.email).first():
        raise ConflictError("An account with this email already exists")
    if db.query(User).filter(User.username == payload.username).first():
        raise ConflictError("This username is already taken")

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=hash_password(payload.password),
        display_name=payload.display_name or payload.username,
        avatar_color=payload.avatar_color or AVATAR_COLORS[0],
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    seed_demo_data_for_user(db, user)
    return user


def authenticate_user(db: Session, payload: LoginRequest) -> User:
    user = db.query(User).filter(User.email == payload.email, User.is_bot.is_(False)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise UnauthorizedError("Incorrect email or password")
    return user


def issue_token(user: User) -> str:
    return create_access_token(subject=str(user.id))


DEMO_EMAIL = "demo@lumina.app"
DEMO_PASSWORD = "demo12345"


def get_or_create_demo_user(db: Session) -> User:
    user = db.query(User).filter(User.email == DEMO_EMAIL).first()
    if user:
        return user

    user = User(
        email=DEMO_EMAIL,
        username="demo_user",
        hashed_password=hash_password(DEMO_PASSWORD),
        display_name="Demo User",
        avatar_color=AVATAR_COLORS[0],
        bio="Just exploring the Lumina demo ✨",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    seed_demo_data_for_user(db, user)
    return user
