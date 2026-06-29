import random

from sqlalchemy.orm import Session

from app.exceptions import ForbiddenError, NotFoundError
from app.models.conversation import Conversation, ConversationParticipant
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageOut, ReactionOut
from app.seed_data import BOT_REPLIES
from app.services.time_utils import humanize_time


def _assert_participant(db: Session, conversation_id: int, user_id: int) -> Conversation:
    conversation = db.get(Conversation, conversation_id)
    if not conversation:
        raise NotFoundError("Conversation not found")

    is_participant = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user_id,
        )
        .first()
    )
    if not is_participant:
        raise ForbiddenError("You are not part of this conversation")
    return conversation


def _other_participant(db: Session, conversation: Conversation, user_id: int) -> User | None:
    if conversation.is_group:
        return None
    other = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation.id,
            ConversationParticipant.user_id != user_id,
        )
        .first()
    )
    if not other:
        return None
    return db.get(User, other.user_id)


def list_conversations(db: Session, user: User) -> list[dict]:
    rows = (
        db.query(Conversation)
        .join(ConversationParticipant, ConversationParticipant.conversation_id == Conversation.id)
        .filter(ConversationParticipant.user_id == user.id)
        .all()
    )

    result = []
    for conversation in rows:
        last_message = (
            db.query(Message)
            .filter(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.desc())
            .first()
        )
        unread = (
            db.query(Message)
            .filter(
                Message.conversation_id == conversation.id,
                Message.sender_id != user.id,
                Message.is_seen.is_(False),
            )
            .count()
        )

        other = _other_participant(db, conversation, user.id)
        status = "online" if (other and not conversation.is_group) else "offline"
        if other:
            status = "online" if other.id % 3 != 0 else "away"

        preview = "No messages yet"
        time_label = ""
        if last_message:
            preview = last_message.text or "\U0001f4f7 Photo"
            if last_message.sender_id == user.id:
                preview = f"You: {preview}"
            time_label = humanize_time(last_message.created_at)

        result.append(
            {
                "id": conversation.id,
                "name": conversation.name or (other.display_name if other else "Unknown"),
                "initials": conversation.initials,
                "color": conversation.color,
                "is_group": conversation.is_group,
                "status": status,
                "preview": preview,
                "time": time_label,
                "unread": unread,
            }
        )

    result.sort(key=lambda c: c["id"])
    return result


def _serialize_message(db: Session, message: Message, current_user_id: int) -> MessageOut:
    sender = db.get(User, message.sender_id)
    reactions = None
    if message.reactions:
        reactions = [ReactionOut(**r) for r in message.reactions]
    return MessageOut(
        id=message.id,
        conversation_id=message.conversation_id,
        sender_id=message.sender_id,
        sender_name=sender.display_name if sender else "Unknown",
        sender_initials=(sender.display_name[:2].upper() if sender else "??"),
        sender_color=sender.avatar_color if sender else "linear-gradient(135deg,#475569,#1e293b)",
        is_mine=message.sender_id == current_user_id,
        text=message.text,
        image_emoji=message.image_emoji,
        image_bg=message.image_bg,
        reactions=reactions,
        is_seen=message.is_seen,
        created_at=message.created_at,
    )


def get_conversation_messages(db: Session, user: User, conversation_id: int) -> list[MessageOut]:
    _assert_participant(db, conversation_id, user.id)

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    unseen_others = [m for m in messages if m.sender_id != user.id and not m.is_seen]
    for m in unseen_others:
        m.is_seen = True
    if unseen_others:
        db.commit()

    return [_serialize_message(db, m, user.id) for m in messages]


def send_message(db: Session, user: User, conversation_id: int, text: str) -> MessageOut:
    conversation = _assert_participant(db, conversation_id, user.id)

    message = Message(conversation_id=conversation_id, sender_id=user.id, text=text, is_seen=False)
    db.add(message)
    db.commit()
    db.refresh(message)

    other = _other_participant(db, conversation, user.id)
    if other and other.is_bot:
        reply_text = random.choice(BOT_REPLIES)
        reply = Message(
            conversation_id=conversation_id,
            sender_id=other.id,
            text=reply_text,
            is_seen=False,
        )
        db.add(reply)
        db.commit()

    return _serialize_message(db, message, user.id)


def react_to_message(db: Session, user: User, conversation_id: int, message_id: int, emoji: str) -> MessageOut:
    _assert_participant(db, conversation_id, user.id)

    message = db.get(Message, message_id)
    if not message or message.conversation_id != conversation_id:
        raise NotFoundError("Message not found")

    reactions = list(message.reactions or [])
    for r in reactions:
        if r["e"] == emoji:
            r["n"] += 1
            break
    else:
        reactions.append({"e": emoji, "n": 1})

    message.reactions = reactions
    db.commit()
    db.refresh(message)
    return _serialize_message(db, message, user.id)
