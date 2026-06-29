import secrets

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.conversation import Conversation, ConversationParticipant
from app.models.message import Message
from app.models.notification import Notification
from app.models.room import Room
from app.models.user import User
from app.seed_data import DEMO_CONVERSATIONS, DEMO_NOTIFICATIONS, DISCOVER_ROOMS, SYSTEM_USERS


def ensure_system_users(db: Session) -> None:
    """Idempotently create the bot/system accounts used to populate demo data."""
    for spec in SYSTEM_USERS:
        existing = db.query(User).filter(User.username == spec["username"]).first()
        if existing:
            continue
        user = User(
            email=f"{spec['username']}@system.lumina.app",
            username=spec["username"],
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            display_name=spec["display_name"],
            avatar_color=spec["color"],
            is_bot=True,
        )
        db.add(user)
    db.commit()


def ensure_rooms(db: Session) -> None:
    """Idempotently create the discover/community rooms."""
    for spec in DISCOVER_ROOMS:
        existing = db.query(Room).filter(Room.slug == spec["slug"]).first()
        if existing:
            continue
        db.add(
            Room(
                name=spec["name"],
                slug=spec["slug"],
                initials=spec["initials"],
                color=spec["color"],
                description=spec["description"],
                tags=spec["tags"],
                base_member_count=spec["members"],
            )
        )
    db.commit()


def seed_demo_data_for_user(db: Session, user: User) -> None:
    """Populate starter conversations + notifications for a freshly registered user."""
    bots_by_username = {u.username: u for u in db.query(User).filter(User.is_bot.is_(True)).all()}
    system_specs_by_username = {s["username"]: s for s in SYSTEM_USERS}

    for spec in DEMO_CONVERSATIONS:
        conversation = Conversation(
            is_group=spec["is_group"],
            name=spec["name"] if spec["is_group"] else None,
            initials=spec["initials"],
            color=spec["color"],
        )
        db.add(conversation)
        db.flush()

        db.add(ConversationParticipant(conversation_id=conversation.id, user_id=user.id))
        for member_username in spec["members"]:
            bot = bots_by_username.get(member_username)
            if bot:
                db.add(ConversationParticipant(conversation_id=conversation.id, user_id=bot.id))

        for sender_username, text in spec["messages"]:
            sender = bots_by_username.get(sender_username) if sender_username else user
            db.add(
                Message(
                    conversation_id=conversation.id,
                    sender_id=sender.id,
                    text=text,
                    is_seen=True,
                )
            )

    for actor_username, text in DEMO_NOTIFICATIONS:
        actor = bots_by_username.get(actor_username)
        spec = system_specs_by_username.get(actor_username)
        if not actor or not spec:
            continue
        db.add(
            Notification(
                user_id=user.id,
                actor_name=actor.display_name,
                actor_initials=spec["initials"],
                actor_color=actor.avatar_color,
                text=text,
            )
        )

    db.commit()
