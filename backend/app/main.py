from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import auth, conversations, notifications, rooms, users
from app.core.config import settings
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.exceptions import AppError
import app.models  # noqa: F401  (registers all models on Base before create_all)
from app.services.seed_service import ensure_rooms, ensure_system_users

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Lumina — the futuristic chat platform.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppError)
def handle_app_error(request: Request, exc: AppError):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        ensure_system_users(db)
        ensure_rooms(db)
    finally:
        db.close()


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(conversations.router)
app.include_router(rooms.router)
app.include_router(notifications.router)
