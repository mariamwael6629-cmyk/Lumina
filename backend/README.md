# Lumina Backend (FastAPI)

REST API powering the Lumina chat frontend: auth, conversations/messages, discover rooms, notifications, and profile management.

## Folder structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app, CORS, startup seeding, router registration
│   ├── core/
│   │   ├── config.py           # Settings loaded from .env
│   │   └── security.py         # Password hashing + JWT helpers
│   ├── db/
│   │   ├── base.py             # SQLAlchemy declarative base
│   │   └── session.py          # Engine/session + get_db dependency
│   ├── models/                 # SQLAlchemy ORM models
│   ├── schemas/                # Pydantic request/response schemas
│   ├── api/
│   │   ├── deps.py             # get_current_user auth dependency
│   │   └── routes/             # API route modules (controllers)
│   ├── services/                # Business logic (auth, conversations, rooms, notifications, seeding)
│   ├── seed_data.py            # Static demo data (bots, rooms, starter conversations)
│   └── exceptions.py           # App-level HTTP exceptions
├── requirements.txt
├── .env.example
└── .gitignore
```

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # edit SECRET_KEY before deploying
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`.

- Swagger UI: `http://127.0.0.1:8000/api/docs`
- ReDoc: `http://127.0.0.1:8000/api/redoc`
- OpenAPI schema: `http://127.0.0.1:8000/api/openapi.json`

By default it uses a local SQLite file (`backend/lumina.db`), created automatically on first run. To use Postgres instead, set `DATABASE_URL` in `.env` (e.g. `postgresql+psycopg2://user:pass@host:5432/lumina`) and `pip install psycopg2-binary`.

## Auth model

- JWT bearer tokens (`Authorization: Bearer <token>`), issued on register/login/demo-login.
- Passwords hashed with bcrypt via passlib.
- Every newly registered (or demo) user is auto-seeded with the same starter conversations, bot contacts, and notifications the original frontend mock used to hardcode — except now it's real, persisted, per-user data.
- "Contacts" like Aria Nova, Zephyr Collective, etc. are real `User` rows flagged `is_bot=True`. They cannot log in (random unusable password) but can be conversation participants and message senders.

## API summary

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account, returns JWT + user |
| POST | `/api/auth/login` | Email/password login, returns JWT + user |
| POST | `/api/auth/demo` | One-click demo account login |
| GET | `/api/users/me` | Current user profile |
| PATCH | `/api/users/me` | Update profile (name, username, email, bio, avatar color, theme) |
| GET | `/api/conversations` | List conversations with preview/unread/status |
| GET | `/api/conversations/{id}/messages` | Full message history (marks incoming as seen) |
| POST | `/api/conversations/{id}/messages` | Send a message (bot contacts auto-reply) |
| POST | `/api/conversations/{id}/messages/{message_id}/react` | Add/increment an emoji reaction |
| GET | `/api/rooms` | List discover/community rooms |
| POST | `/api/rooms/{id}/join` | Join a room |
| GET | `/api/notifications` | List notifications |
| POST | `/api/notifications/read-all` | Mark all as read |
| POST | `/api/notifications/{id}/read` | Mark one as read |
| GET | `/api/health` | Health check |

All routes except `/api/auth/*` and `/api/health` require the `Authorization: Bearer <token>` header.

## Known limitations / not implemented

- No WebSocket/real-time push — the frontend polls `/messages` while a conversation is open. A future iteration could add a WebSocket endpoint for live delivery.
- No file/image upload storage — image messages in the original mock were decorative placeholders and were not carried over as an upload feature.
- No password-reset/email-verification flow.
