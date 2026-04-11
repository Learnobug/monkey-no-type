# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run development server (Next.js on port 3000)
npm run dev

# Run the Socket.IO server (port 3001) - must run alongside Next.js
node server/index.js

# Build for production
npm run build

# Lint
npm run lint

# Prisma - generate client after schema changes
npx prisma generate

# Prisma - run migrations
npx prisma migrate dev --name <migration-name>

# Prisma - open DB browser
npx prisma studio
```

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

## Architecture

This is a **Next.js 14 App Router** multiplayer typing game. Two servers run concurrently:

1. **Next.js** (`npm run dev`, port 3000) — handles the UI, API routes, and auth.
2. **Socket.IO server** (`node server/index.js`, port 3001) — handles real-time room and game events. Deployed separately on Render; the client connects to `https://monkey-no-type-1.onrender.com` via `socket.js`.

### Key Data Flow

- **Authentication**: NextAuth with a custom `CredentialsProvider` (`app/api/auth/[...nextauth]/route.ts`). On first login the user is auto-created in Postgres. The user `id` is stored in the JWT and session, and also persisted to `localStorage` as `"userId"` on the client.
- **Solo game** (`app/page.tsx`): Fetches a random sentence from `/api/word`, starts a countdown timer via `react-timer-hook`, scores the result on expiry, then POSTs to `/api/user/[userId]/scores`.
- **Multiplayer lobby** (`app/room/[roomId]/page.tsx`): Joins a Socket.IO room. The first user to join becomes the owner. The owner's "Start Game" button emits `startGame` with a fetched sentence; all clients in the room receive the `sentence` event, store it in `localStorage`, and navigate to the game route.
- **Multiplayer game** (`app/room/[roomId]/game/page.tsx`): Reads the sentence from `localStorage`, runs a fixed 15-second timer, then POSTs results to `/api/user/[userId]/[roomId]`.
- **Results**: `/result` shows the last solo score; `/result/room` shows all scores for the last room game; `/result/history` shows the full score history.

### Database (Prisma + PostgreSQL)

Three models: `User` → `Score` (one-to-many) and `Multiplayer` (many-to-many with `User`, linked to `Score` via `playerScores`). API routes extract `userId` from the URL by splitting on `/` (e.g. `req.url.split('/')[5]`).

### Directory Structure

```
app/
  page.tsx              # Solo typing game
  layout.tsx / providers.tsx  # Root layout + SessionProvider wrapper
  api/
    auth/[...nextauth]/ # NextAuth handler (login + auto-register)
    word/               # GET random paragraph
    user/[userId]/
      scores/           # GET/PUT solo scores
      [roomId]/         # GET/POST multiplayer game scores
  room/[roomId]/
    page.tsx            # Multiplayer lobby
    game/page.tsx       # Multiplayer typing game
  result/
    page.tsx            # Solo result
    history/page.tsx    # Solo score history
    room/page.tsx       # Multiplayer result
components/
  Chat.tsx              # Socket.IO chat sidebar (used in room lobby)
  ResultComponent.tsx   # Inline result display after solo game
server/
  index.js              # Standalone Socket.IO server
socket.js               # Singleton socket client (connects to Render URL)
prisma/
  schema.prisma
```
