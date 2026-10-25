# Design — Lumina

**World: daylight.** Lumina means light, so the app looks like a bright room on a good afternoon: a cool, airy ground, sunlit-yellow messages you sent, and a deep "shade" blue for anything you can press. The neon-on-black "cyber" look is gone. On the landing page, soft window light falls across the hero, and its angle follows the visitor's local time.

## Tokens (`frontend/css/style.css` `:root`)

| Token | Value | Role |
|---|---|---|
| `--day` | `#F3F5F7` | ground, chat background |
| `--day-2` | `#E8ECF0` | hover wells, inactive fills |
| `--card` | `#FFFFFF` | panels, received bubbles |
| `--line` | `#DDE3E9` | quiet panel edges (app chrome only) |
| `--ink` / `--ink-2` / `--ink-3` | `#14202B` / `#465665` / `#5F6E7B` | text levels (all ≥4.5:1 on their surfaces) |
| `--shade` / `--shade-2` | `#14506B` / `#0E3D52` | primary actions, sidebar, active state |
| `--shade-tint` | `#DCEAF0` | selected row |
| `--sun` / `--sun-2` / `--sun-ink` | `#FFC94D` / `#FFDA7F` / `#2A1F00` | sent bubbles, demo button, highlights |
| `--online` / `--away` / `--danger` | `#1F8A5B` / `#C98500` / `#B8322A` | status and errors |

Legacy variable names (`--p`, `--t2`, `--gb`, …) map onto these, so older inline styles still resolve.

Avatar palette (flat): `#14506B #E8618C #1F8A5B #D9822B #3A6EA5`. Older gradient values stored in the database go through `flat()` in `app.js`, which maps them to the matching flat colour.

### Type
- Display: **Bricolage Grotesque** 700/800. Landing headlines, page titles, panel titles. Tracking −0.03em, leading 1.
- UI: **Figtree** 400–700. Everything else. Messages are set at 15px/1.5, lists at 14px, meta at 12px with tabular figures.

### Shape and space
- Radii: 8 / 12 / 20px. Buttons and the composer are full pills; bubbles are 18px with a 6px tail corner.
- Panels: contacts 300px, right panel 272px, sidebar 72px (60px on phones).
- `--lift` shadow only on things that float above the page (preview card, auth card, toast, call card).

## Components
- **Bubbles:** received are white on the day ground; sent are sun yellow with dark ink. There's no gradient or glow.
- **Sidebar:** a solid shade-blue rail with white icons. The active item gets a sun-yellow tab on its edge.
- **Buttons:** primary is a shade pill; secondary is white with an inset line. The demo account button is sun yellow, because that's the fastest way in.
- **Inputs:** day-filled with no border at rest; focus draws a 1.5px shade border and turns the fill white.
- **Icons:** the Tabler webfont throughout. No emoji in the UI chrome (emoji stay in message content and reactions).

## Motion
- Landing: the headline group rises in a 60ms stagger, the preview card settles into its 1.2° tilt, and the window light eases to its time-of-day angle.
- App: new messages rise 8px. Buttons press to 0.95–0.98. Toasts slide up.
- `prefers-reduced-motion` turns all of it off.
