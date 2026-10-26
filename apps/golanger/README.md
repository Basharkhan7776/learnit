# 🐹 Golanger — Web-Based Interactive Go Learning Client

> Master the Go programming language directly in your browser. Complete hands-on Go curriculum with **coss.com / shadcn** dark aesthetics, Monaco code editor, dual real-time compilation engines, and 100% offline local progress persistence.

---

## ✨ Features

- **86 Exercises across 19 Modules**:
  - **Go Fundamentals**: Intro (`00_intro`), Variables (`01_variables`), Types (`02_types`), Functions & Closures (`03_functions`), Control Flow (`04_control_flow`), Strings (`05_strings`), Arrays & Slices (`06_arrays_slices`), Maps (`07_maps`), Structs (`08_structs`), Interfaces (`09_interfaces`), Errors (`10_errors`), Pointers (`11_pointers`).
  - **Concurrency Core**: Goroutines (`12_goroutines`), Channels (`13_channels`), Select (`14_select`), Sync & Mutex (`15_sync` — `Mutex`, `RWMutex`, `Once`, `sync.Map`, Worker Pools, Fan-out/Fan-in, Context cancellation, Rate Limiting, Atomic operations).
  - **Gin Web APIs**: Gin Basics (`16_gin_basics` — GET/POST, JSON binding, route groups, path/query parameters), Middlewares (`17_gin_middleware` — custom Request-ID, Panic Recovery, Bearer token auth, CORS, timing latency), Advanced Web (`18_gin_advanced` — struct validator tags, centralized error handlers, concurrent handlers, WebSockets with gorilla/websocket, in-memory CRUD, graceful shutdown).
- **Dual Execution Engines**:
  - **Local Native Go Runner**: Blazing fast instant compilation via local `go run` / `go test` right inside the Vite dev server (`bun run dev`). Includes Gin and Gorilla WebSocket support via in-memory `httptest`.
  - **Go Playground API**: Zero-install web execution fallback via `https://go.dev/_/compile` for static deployments.
- **coss.com / shadcn Dark Aesthetic**: Minimalist dark UI with crisp 1px borders, subtle cyan accents, smooth transitions, and high-contrast typography.
- **Monaco Code Editor for Go**: Full VS Code editor engine with Go syntax highlighting, autocompletion, bracket matching, font size adjustment, and auto-save.
- **Vim Mode & Navigation**: Built-in toggle for Vim modal editing plus virtual cursor controls for mobile devices.
- **Interactive ANSI Terminal**: Real-time compiler diagnostics, colorized compiler errors, and test pass/fail output.
- **Learning Activity Heatmap**: GitHub-style 365-day practice heatmap tracking daily exercises and streaks.
- **Progressive Hints & Solutions**: Expandable hints for each exercise, plus official reference solutions with confirmation guards and an "Apply to Editor" feature.
- **100% Local Persistence**:
  - Automatically saves code edits per exercise in browser `localStorage`.
  - Solved status, bookmarks, and notes.
  - Export & Import progress as JSON snapshots for backups or sharing across devices.
  - Reset single exercise or reset all progress.
- **Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy search across all 86 exercises.
- **Keyboard Shortcuts**:
  - `⌘ + Enter` / `Ctrl + Enter`: Run & Test current exercise
  - `⌘ + K` / `Ctrl + K`: Jump to exercise
  - `⌘ + B` / `Ctrl + B`: Toggle Sidebar
  - `⌘ + J` / `Ctrl + J`: Toggle Terminal
  - `Alt + →`: Next exercise
  - `Alt + ←`: Previous exercise

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.2+) or Node.js (v18+)
- [Go](https://go.dev/dl/) (v1.22+)

### Installation & Run

```bash
# Enter directory
cd golanger

# Install dependencies
bun install

# Start development server
bun run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
bun run build
bun run preview
```

---

## 📁 Project Structure

```
golanger/
├── src/
│   ├── components/
│   │   ├── ui/               # coss.com base components (Button, Badge, Modal, ResizeHandle, Tooltip, DropdownMenu)
│   │   ├── Header.tsx        # Breadcrumb, progress bar, navigation, run trigger
│   │   ├── Sidebar.tsx       # 19 module accordions, search, filters
│   │   ├── CodeEditor.tsx    # Monaco editor with Go syntax & auto-save
│   │   ├── InstructionsPane.tsx # Markdown theory, hints, and reference solutions
│   │   ├── TerminalOutput.tsx# ANSI-rendered terminal console
│   │   ├── ActivityHeatmap.tsx # 365-day contribution calendar & streak tracker
│   │   ├── CommandPalette.tsx# Quick switcher (⌘K)
│   │   └── Modals/           # Solution & Settings modals
│   ├── context/
│   │   └── GolangContext.tsx # Central application state & keyboard shortcuts
│   ├── data/
│   │   └── exercises.json    # 86 pre-compiled exercises, hints, readmes, and solutions
│   ├── lib/
│   │   ├── ansi.ts           # ANSI escape code parser for compiler output
│   │   ├── storage.ts        # LocalStorage persistence & backup engine
│   │   └── utils.ts          # Tailwind cn utility and helpers
│   ├── services/
│   │   └── compiler.ts       # Execution router (Local endpoint + Go Playground API)
│   ├── types/
│   │   └── exercise.ts       # TypeScript interfaces
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── runner/                   # Isolated Go runtime environment for dev server
│   ├── go.mod                # Cached Gin, Gorilla WebSocket, etc.
│   └── deps/                 # Cached dependencies
├── exercises/                # Individual Go exercise files on disk
├── solutions/                # Reference solutions on disk
├── scripts/
│   └── generate-exercises.ts # Exercise curriculum generator & synchronizer
├── vite.config.ts            # Vite config with local Go runner plugin
└── package.json
```

---

## 📄 License

MIT
