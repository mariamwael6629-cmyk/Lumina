from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.exceptions import AppError
from app.models.user import User
from app.schemas.conversation import ConversationOut
from app.schemas.message import MessageCreate, MessageOut, ReactionRequest
from app.services import conversation_service

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


@router.get("", response_model=list[ConversationOut])
def list_conversations(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return conversation_service.list_conversations(db, current_user)


@router.get("/{conversation_id}/messages", response_model=list[MessageOut])
def get_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return conversation_service.get_conversation_messages(db, current_user, conversation_id)


@router.post("/{conversation_id}/messages", response_model=MessageOut, status_code=201)
def post_message(
    conversation_id: int,
    payload: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    text = (payload.text or "").strip()
    if not text:
        raise AppError(422, "Message text cannot be empty")
    return conversation_service.send_message(db, current_user, conversation_id, text)


@router.post("/{conversation_id}/messages/{message_id}/react", response_model=MessageOut)
def react_to_message(
    conversation_id: int,
    message_id: int,
    payload: ReactionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return conversation_service.react_to_message(
        db, current_user, conversation_id, message_id, payload.emoji
    )
