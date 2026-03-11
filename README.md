# Gamratic — Rate. Review. Discover.

A dark, cinematic game review platform built with React, Express, and Prisma.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + React Router v6
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite via Prisma ORM
- **Auth**: JWT (httpOnly cookies)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Install server dependencies
cd server
npm install

# 2. Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# 3. Start the server
npm run dev

# 4. In a new terminal — install client dependencies
cd client
npm install

# 5. Start the client
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` in the `server/` directory:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3001
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
