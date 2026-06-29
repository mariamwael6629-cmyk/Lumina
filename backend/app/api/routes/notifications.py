from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.notification import NotificationOut
from app.services import notification_service

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationOut])
def list_notifications(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return notification_service.list_notifications(db, current_user)


@router.post("/read-all", status_code=204)
def read_all(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notification_service.mark_all_read(db, current_user)


@router.post("/{notification_id}/read", status_code=204)
def read_one(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notification_service.mark_one_read(db, current_user, notification_id)
