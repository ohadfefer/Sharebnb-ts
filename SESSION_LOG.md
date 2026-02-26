# Session Log

## 2/26 - Configured Claude Code & Added Project Documentation

### What was done

1. **Created `CLAUDE.md`** — Guidance file for Claude Code with project architecture, dev commands, data flow patterns, key files, and conventions. This helps future AI-assisted sessions be productive immediately.

2. **Created root `README.md`** — Top-level project README tying together the frontend and backend sub-READMEs. Covers tech stack, getting started, environment setup, project structure, features, routes, and API overview.

3. **Configured Claude Code status line** — Added a status line script showing model name and context usage with a progress bar.

### Files added
- `CLAUDE.md` (project root)
- `README.md` (project root)
- `~/.claude/statusline-command.sh` (user-level config)

### Notes
- No existing code was modified — documentation only.
- The sub-project READMEs (`back-sharebnb/README.md`, `front-sharebnb/README.md`) were reviewed but left unchanged.
- A convention was added to `CLAUDE.md`: no semicolons at the end of lines in `.ts`/`.tsx` files unless necessary.

## 2/26 - Stay Editor Fixes & Socket Service Fix

### Stay Editor / Add Stay (failed attempt)
Attempted to fix the "Add Stay" flow in `StayEditor.tsx`. Ran into two blocking external issues:
- **Google Maps API key** — The `VITE_GOOGLE_MAPS_API_KEY` is outdated/invalid, causing the Places Autocomplete and map components to fail. Address autocomplete couldn't load, breaking the location selection step of the stay editor.
- **Cloudinary upload** — Image uploads to Cloudinary were failing, preventing stays from being saved with photos.

Both issues require updating external credentials (Google Cloud Console and Cloudinary dashboard) before the add-stay flow can work end-to-end. No code fix can resolve these.

### Socket Service Fix (completed)
- **Problem:** App crashed with `TypeError: window.socketService.testConnection is not a function` on `/dashboard/reservations` and `/trips` pages when running in dev mode (dummy socket service active).
- **Root cause:** The dummy socket service in `socket.service.ts` was missing `testConnection()` and `ensureUserLoggedIn()` methods that the real socket service exposes and that `TripIndex.tsx` and `ReservationsTable.tsx` call.
- **Fix:** Added both methods as no-ops to `createDummySocketService()` in `front-sharebnb/src/services/socket.service.ts`.

### Files modified
- `front-sharebnb/src/services/socket.service.ts` (added `testConnection` and `ensureUserLoggedIn` to dummy service)
