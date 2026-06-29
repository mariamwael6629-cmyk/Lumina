from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.user import User


def list_notifications(db: Session, user: User) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def mark_all_read(db: Session, user: User) -> None:
    db.query(Notification).filter(
        Notification.user_id == user.id, Notification.is_read.is_(False)
    ).update({"is_read": True})
    db.commit()


def mark_one_read(db: Session, user: User, notification_id: int) -> None:
    db.query(Notification).filter(
        Notification.id == notification_id, Notification.user_id == user.id
    ).update({"is_read": True})
    db.commit()
