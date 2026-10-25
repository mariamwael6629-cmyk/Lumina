# Product

<!-- impeccable:product-schema 1 -->

> Inferred from the README, `frontend/` and `backend/` code. The owner asked the redesign to proceed on inferred context; treat each line as an assumption until confirmed.

## Platform

web

## Users
People who chat in small groups and community rooms on a laptop or phone: friends, project groups, hobby communities. They sign up, pick an avatar colour and handle, then live in the message list.

## Product Purpose
Lumina is a web messaging app: direct and group conversations with history, seen-state and emoji reactions, community rooms to discover and join, a notifications feed, and profile settings (display name, handle, bio, avatar colour, theme). A landing page sells it; login, register (two steps) and a demo account get people in.

## Positioning
A friendly, good-looking chat app that runs in the browser with real accounts and rooms. The name means light.

## Capabilities and Constraints
- Static SPA (vanilla HTML/CSS/JS, Tabler icon webfont) against a FastAPI backend; no build step.
- Pages are toggled with `showPage()`; overlays for Discover, Profile, Notifications; a call modal.
- Avatar colours are stored per user as CSS background strings (legacy values are gradients).
- The backend has no WebSocket, video calling, AI replies or end-to-end encryption; the landing copy claims all four (see Evidence).

## Brand Commitments
- Name "Lumina" and the "L" mark.

## Evidence on Hand
- Seeded demo users, conversations and rooms in `backend/app/seed_data.py`.
- No real user numbers. The "10,000+ users", "sub-50ms", "500 members", "military-grade encryption" and HD video claims are unverified marketing copy and must not be expanded.

## Product Principles
1. The conversation is the product; chrome stays out of its way.
2. Fast to start: demo login is one click.
3. Friendly, never cold or "cyber".
