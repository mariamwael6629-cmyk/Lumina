# Lumina — Futuristic Chat Platform

Lumina is a sleek, next-generation web-based messaging platform featuring a glassmorphism design, cosmic ambient orbs, and dark-mode cyberpunk aesthetics. It now ships as a full frontend + backend application: a static SPA frontend talking to a real FastAPI + SQLAlchemy backend over a REST API.

## ✨ Features

- **Futuristic UI/UX:** Glassmorphism elements, glow animations, neon accents (cyber purple, cyan, pink).
- **Real accounts:** Register/login/demo-login with JWT auth; profile editing with avatar color and theme.
- **Real conversations:** Direct + group chats backed by a database, with message history, seen-state, and emoji reactions.
- **Discover rooms:** Browse and join community rooms.
- **Notifications feed:** Per-user notifications with read/unread state.
- **Responsive layout:** Usable down to mobile viewport widths (sidebar/contacts collapse, mobile back button).

## 📁 Project structure

```
Lumina/
├── frontend/          # Static SPA (HTML/CSS/vanilla JS) — see frontend below
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── api.js     # Backend API client
│       └── app.js     # UI logic / state
├── backend/           # FastAPI REST API — see backend/README.md
└── Images/            # Reference screenshots
```

## 🚀 Getting started

1. **Start the backend** (see `backend/README.md` for full details):
   ```bash
   cd backend
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   uvicorn app.main:app --reload --port 8000
   ```
2. **Serve the frontend** (any static file server works; the API base defaults to `http://127.0.0.1:8000`):
   ```bash
   cd frontend
   python3 -m http.server 5500
   ```
   Then open `http://127.0.0.1:5500/index.html`.

   To point the frontend at a different backend URL, set `window.LUMINA_API_BASE` in a `<script>` tag before `js/api.js` loads in `index.html`.

## 🛠️ Built with

- **Frontend:** HTML5, CSS3 (custom properties, glassmorphism, responsive media queries), vanilla JS, Tabler Icons, Google Fonts (Inter).
- **Backend:** FastAPI, SQLAlchemy 2.0, Pydantic v2, JWT auth (python-jose), bcrypt password hashing, SQLite (swappable for Postgres).

## 📝 License

This project is open-source and free to be used for educational purposes and dashboard layout inspiration.
