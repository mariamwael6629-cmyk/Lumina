from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserOut
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


class AuthResponse(TokenResponse):
    user: UserOut


@router.post("/register", response_model=AuthResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = auth_service.register_user(db, payload)
    token = auth_service.issue_token(user)
    return AuthResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, payload)
    token = auth_service.issue_token(user)
    return AuthResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/demo", response_model=AuthResponse)
def demo_login(db: Session = Depends(get_db)):
    user = auth_service.get_or_create_demo_user(db)
    token = auth_service.issue_token(user)
    return AuthResponse(access_token=token, user=UserOut.model_validate(user))
