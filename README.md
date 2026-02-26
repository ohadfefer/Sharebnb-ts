# Sharebnb

A full-featured Airbnb clone with property listings, bookings, reviews, real-time chat, and a host dashboard.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Redux, Material-UI, Framer Motion, Recharts, Socket.io Client |
| **Backend** | Node.js, Express, MongoDB (native driver), Socket.io, JWT, Nodemailer |
| **Infra** | Upstash Workflows (background jobs), PWA with service worker |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd Sharebnb-ts

# Install both packages
cd back-sharebnb && npm install
cd ../front-sharebnb && npm install
```

### Environment Variables

**Backend** (`back-sharebnb/.env`):
```
SERVER_URL=http://localhost:3030
MONGO_URL=<your-mongodb-uri>
DB_NAME=sharebnb_db
QSTASH_URL=http://127.0.0.1:8080
QSTASH_TOKEN=<your-token>
EMAIL_PASSWORD=<gmail-app-password>
ACCOUNT_EMAIL=<your-email>
```

**Frontend** (`front-sharebnb/.env`):
```
VITE_GOOGLE_MAPS_API_KEY=<your-key>
VITE_GOOGLE_MAPS_API_KEY_DETAILS=<your-key>
```

### Running in Development

```bash
# Terminal 1 - Backend (port 3030)
cd back-sharebnb
npm run dev

# Terminal 2 - Frontend (port 5173)
cd front-sharebnb
npm run dev
```

The frontend proxies API calls to `localhost:3030` in development.

### Building for Production

```bash
cd front-sharebnb
npm run build
```

This compiles the frontend and copies the output to `back-sharebnb/public/`. The Express server serves these files in production with a catch-all fallback to `index.html` for SPA routing.

## Project Structure

```
Sharebnb-ts/
├── back-sharebnb/          # Express API server
│   ├── api/                # Route → Controller → Service per domain
│   │   ├── auth/           # Signup, login, logout (JWT in HTTP-only cookies)
│   │   ├── user/           # User profiles and management
│   │   ├── stay/           # Property listings, wishlist, messages
│   │   ├── order/          # Bookings and reservations
│   │   ├── review/         # Ratings and reviews
│   │   └── workflow/       # Upstash background job endpoints
│   ├── config/             # Environment-based config (dev/prod)
│   ├── middlewares/        # Auth, async local storage, logging
│   ├── services/           # DB connection, socket.io, logger, utilities
│   ├── workflows/          # Background job definitions
│   ├── types/              # TypeScript type definitions
│   └── server.js           # Entry point
│
└── front-sharebnb/         # React SPA
    └── src/
        ├── pages/          # Route-level components (StayIndex, StayDetails, TripIndex, etc.)
        ├── cmps/           # Reusable components (StayList, StayFilter, ReviewList, etc.)
        ├── store/          # Redux store, actions, and reducers
        ├── services/       # HTTP client, socket.io, domain services (stay, user, order, review)
        ├── customHooks/    # Custom React hooks
        ├── types/          # TypeScript type definitions
        └── assets/         # Images, SCSS styles, videos
```

## Features

- **Property Listings** — Browse, search, and filter stays by location, dates, guests, price, and amenities
- **Booking System** — Date selection, guest management, pricing calculator, and order confirmation with email
- **Review System** — Rate and review stays with aggregated ratings
- **Real-time Chat** — WebSocket messaging between guests and hosts
- **Wishlist** — Save and manage favorite properties
- **Host Dashboard** — Create/edit listings, manage reservations, view analytics
- **Map Exploration** — Google Maps integration for location-based browsing
- **Mobile-First** — Responsive design with bottom tab bar and PWA support
- **Admin Panel** — Platform management tools

## Key Routes

| Path | Page |
|------|------|
| `/stay` | Property listings with search and filters |
| `/explore` | Map-based property exploration |
| `/stay/:id` | Property details |
| `/stay/:id/order` | Booking flow |
| `/trips` | User's trip history |
| `/wishlists` | Saved properties |
| `/hosting/listings` | Create a new listing |
| `/dashboard/reservations` | Host reservation management |
| `/dashboard/listings` | Host listing management |
| `/admin` | Admin dashboard |

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/signup` | Register |
| `POST /api/auth/login` | Login (sets JWT cookie) |
| `GET /api/stay` | List stays with filters |
| `POST /api/stay` | Create stay (auth required) |
| `GET /api/order` | List orders |
| `POST /api/order` | Create booking |
| `GET /api/review` | List reviews |
| `POST /api/review` | Create review |

Full endpoint details in [`back-sharebnb/README.md`](back-sharebnb/README.md).

## Additional Scripts

| Command | Directory | Description |
|---------|-----------|-------------|
| `npm run typecheck` | Both | TypeScript type checking |
| `npm run lint` | Frontend | ESLint |
| `npm run build:ts` | Backend | Compile TypeScript |
| `npm run dev:local` | Frontend | Use local mock data |
| `npm run dev:remote` | Frontend | Use remote backend |
