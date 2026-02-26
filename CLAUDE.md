# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sharebnb is an Airbnb clone — a monorepo with a React/Vite frontend (`front-sharebnb/`) and an Express/Node.js backend (`back-sharebnb/`). The frontend build output is automatically copied to `back-sharebnb/public/` for deployment.

## Commands

### Backend (`back-sharebnb/`)
```bash
npm run dev          # Development with hot reload (tsx watch)
npm run build:ts     # Compile TypeScript
npm run typecheck    # Type check without emitting
npm start            # Production
```

### Frontend (`front-sharebnb/`)
```bash
npm run dev          # Vite dev server (uses local backend)
npm run dev:local    # Explicitly use local backend
npm run dev:remote   # Use remote/deployed backend
npm run build        # Build and copy output to ../back-sharebnb/public
npm run lint         # ESLint
npm run typecheck    # Type check
```

No test framework is configured in either package.

## Architecture

### Frontend Data Flow

```
Component → Action Creator (store/actions/) → Service (services/) → Axios HTTP → Backend
                                 ↓
                         Redux Reducer (store/reducers/) → Store → useSelector → Component
```

Redux modules: `stayModule`, `userModule`, `orderModule`, `reviewModule`, `systemModule`, `filterPanelModule`. The store uses the legacy Redux API (`legacy_createStore`).

**Service abstraction:** Each domain has a `services/<domain>/index.ts` that exports either `stay.service.local.js` (mock data) or `stay.service.remote.ts` (real API) based on environment. The HTTP wrapper is `services/http.service.ts` — always use this instead of calling Axios directly, as it handles credentials and 401 redirects.

**Socket.io** is managed via `services/socket.service.ts`; real-time events flow through Redux dispatch via event listeners set up in the app lifecycle.

### Backend MVC Pattern

```
Routes (api/<domain>/<domain>.routes.ts)
  → Controllers (api/<domain>/<domain>.controller.ts)
    → Services (api/<domain>/<domain>.service.ts)
      → MongoDB (services/db.service.js via getCollection())
```

No ORM — uses MongoDB native driver. Request context (logged-in user) is stored in async local storage (`services/als.service.js`) and attached by `middlewares/setupAls.middleware.js` before route handlers run.

### Authentication

- JWT stored in HTTP-only cookies set by the backend
- `middlewares/requireAuth.middleware.js` guards protected routes
- Frontend restores user session on load via `initUser()` action, which reads from `sessionStorage`

### Real-time (Socket.io)

Key events: `set-user-socket` / `unset-user-socket`, `order-updated`, `review-added`, `review-removed`, `chat-set-topic`, `chat-send-msg` / `chat-add-msg`, `user-watch`.

### TypeScript Migration

The codebase is mid-migration from JavaScript to TypeScript. Backend has `allowJs: true` — new files should be `.ts`, existing `.js` files are gradually being converted. Type definitions live in `back-sharebnb/types/` and `front-sharebnb/src/types/`.

## Key Files

| File | Purpose |
|------|---------|
| `back-sharebnb/server.js` | Express entry point, CORS, Socket.io setup, route registration |
| `front-sharebnb/src/RootCmp.tsx` | Root routing component |
| `front-sharebnb/src/services/http.service.ts` | Axios wrapper — base URL, credentials, 401 handling |
| `front-sharebnb/src/store/store.ts` | Redux store configuration |
| `back-sharebnb/services/db.service.js` | MongoDB singleton via `getCollection(collectionName)` |
| `back-sharebnb/api/api.postman.json` | API endpoint reference |

## Environment Variables

**Backend** (`.env`): `SERVER_URL`, `MONGO_URL`, `DB_NAME`, `QSTASH_URL`, `QSTASH_TOKEN`, `EMAIL_PASSWORD`, `ACCOUNT_EMAIL`

**Frontend** (`.env`): `VITE_GOOGLE_MAPS_API_KEY`, `VITE_GOOGLE_MAPS_API_KEY_DETAILS`

In development, Express allows CORS from `localhost:5173–5178`. In production, it serves the SPA from `public/` with a catch-all fallback to `public/index.html`.

## Conventions

- Don't add ";" at the end of new lines in .tsx or .ts unless necessary
- All element styling should be added in src/styles/. if needed, create a new css file and import it in main.css