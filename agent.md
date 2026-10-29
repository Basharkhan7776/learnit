# Learnit Agent Guide & System Reference

This document serves as the single source of truth for agents and developers working on the **Learnit** monorepo.

---

## 1. System Overview

Learnit is an interactive programming curriculum monorepo managed with **Turborepo** and **Bun**. It delivers unified hands-on learning across Rust, Go, and TypeScript/JavaScript with centralized authentication and bi-directional cloud synchronization.

### Repository Layout
```
learnit/
├── apps/
│   ├── api/            # ElysiaJS backend on Port 4000 (Better Auth + Sync + Prisma)
│   ├── web/            # React + Vite + shadcn/ui portal on Port 3000 (Auth & Overview)
│   ├── rustal/         # Rustlings curriculum on Port 5173
│   ├── golanger/       # Go curriculum on Port 5174 (100% WebAssembly via Yaegi, zero Go install required)
│   └── scripter/       # JS, TS & ElysiaJS curriculum on Port 5175
├── packages/
│   ├── ui/             # Shared @learnit/ui components with per-app color palettes
│   └── sync/           # Shared @learnit/sync auth client, merge logic & cloud hook
├── docker-compose.yml  # Local PostgreSQL 16 database container
└── agent.md            # System specification & instructions (this file)
```

---

## 2. Ports and Origins Map

| Service | Port | Base URL | Role |
|---|---|---|---|
| **PostgreSQL** | `5433` | `localhost:5433` | Docker container (`learnit-postgres`, mapped from 5432) |
| **API Backend** | `4000` | `http://localhost:4000` | ElysiaJS backend, Better Auth, Prisma ORM, Sync endpoints |
| **Web Portal** | `3000` | `http://localhost:3000` | Central dashboard, User Registration & Login |
| **Rustal** | `5173` | `http://localhost:5173` | Interactive Rust curriculum |
| **Golanger** | `5174` | `http://localhost:5174` | Interactive Go curriculum |
| **Scripter** | `5175` | `http://localhost:5175` | Interactive JS/TS curriculum |

---

## 3. Database Architecture (PostgreSQL & Prisma 6.18.0)

### Engine & Configuration
- **Prisma Version**: `6.18.0`
- **Config file**: `apps/api/prisma.config.ts`
- **Schema folder**: `apps/api/prisma/schema/`
  - `base.prisma`: Datasource (`DATABASE_URL`, `DIRECT_URL`) and Client generator with `prismaSchemaFolder`.
  - `auth.prisma`: Better Auth models (`User`, `Session`, `Account`, `Verification`).
  - `sync.prisma`: Curriculum data model (`UserProgress`).

### Docker PostgreSQL
- Defined in `docker-compose.yml`.
- Database name: `learnit`, User: `postgres`, Password: `postgrespassword`, Port: `5433` (mapped from container `5432`).
- Start with: `docker compose up -d`
- Stop with: `docker compose down`

### Connection Strings
In `apps/api/.env`:
```bash
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5433/learnit?schema=public"
DIRECT_URL="postgresql://postgres:postgrespassword@localhost:5433/learnit?schema=public"
```
*(When deployed to Neon in production, `DATABASE_URL` connects to the pooler and `DIRECT_URL` connects directly for migrations).*

### Sync Schema Specification (`UserProgress`)
```prisma
model UserProgress {
  id                String   @id @default(cuid())
  userId            String
  app               String   // "rustal" | "golanger" | "scripter"
  completedIds      String[] // Exercise IDs finished
  userCode          Json     // Record<exerciseId, string>
  bookmarks         String[] // Exercise IDs bookmarked
  notes             Json     // Record<exerciseId, string>
  settings          Json     // AppSettings (vimMode, fontSize, theme, keymapPlatform)
  activityHistory   Json?    // Record<dateKey, count>
  currentExerciseId String?
  version           Int      @default(1)
  updatedAt         DateTime @updatedAt
  createdAt         DateTime @default(now())
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, app])
  @@index([userId])
  @@map("user_progress")
}
```

---

## 4. Authentication Architecture (Better Auth)

### Credentials Authentication (Username & Password)
- Better Auth is mounted at `/api/auth/*` on `apps/api`.
- Configured with `emailAndPassword: { enabled: true }` and `username: { enabled: true }`.
- Session token is stored in a secure `HttpOnly` cookie with `SameSite: "lax"` and `credentials: "include"`.
- Trusted origins configured:
  - `http://localhost:3000`
  - `http://localhost:4000`
  - `http://localhost:5173`
  - `http://localhost:5174`
  - `http://localhost:5175`

### Single Sign-On / Cross-Port Detection Flow
1. User logs in or registers on `apps/web` (`http://localhost:3000`).
2. The browser receives the `better-auth.session_token` cookie from `http://localhost:4000`.
3. In any client app (`rustal`, `golanger`, `scripter`), the `@learnit/sync` hook listens for:
   - Initial component mount
   - Window `focus` events
   - Document `visibilitychange` events
4. When triggered, the client queries `GET http://localhost:4000/api/auth/get-session` with `{ credentials: "include" }`.
5. Upon session detection:
   - Header badge updates to show the authenticated user (e.g. `☁️ Synced as [User]`).
   - Client pulls remote progress (`GET /api/sync/:app`).
   - Local progress is non-destructively merged with cloud progress.

---

## 5. Cloud Synchronization (`@learnit/sync`)

### Local Storage Snapshot Structure
Every curriculum app produces a snapshot of type:
```typescript
interface LocalStorageSnapshot {
  version: 1;
  exportedAt: string;
  completedIds: string[];
  userCode: Record<string, string>;
  bookmarks: string[];
  notes: Record<string, string>;
  settings: AppSettings;
  activityHistory?: Record<string, number>;
  currentExerciseId?: string;
}
```

### Deterministic Merger Rules (`mergeSnapshots`)
- `completedIds`: Mathematical union of `local` and `cloud` arrays (never drops completed exercises).
- `bookmarks`: Mathematical union of `local` and `cloud` arrays.
- `userCode`: Merged key-value map. If both have code for an exercise, local takes precedence if newer.
- `notes`: Merged key-value map.
- `settings`: Preserved from the active user's preference.
- `activityHistory`: Daily activity counts merged by taking `Math.max(local, cloud)` for each date key.

### Debounced Auto-Sync
- Whenever an exercise is completed or user code is modified in a curriculum app, a 1.5-second debounced push sends `POST /api/sync/:app` with the updated snapshot.
- The UI displays sync state indicators: `synced` (green), `syncing` (pulsing), `error` (warning), or `unauthenticated` (gray).

---

## 6. Development & Operational Commands

### Start PostgreSQL
```bash
docker compose up -d
```

### Generate Prisma Client & Push Schema
```bash
cd apps/api
bunx prisma generate
bunx prisma db push
```

### Run Entire Monorepo (Turbo)
```bash
bun dev
```

### Type Checking & Linting
```bash
bun check-types
bun lint
```
