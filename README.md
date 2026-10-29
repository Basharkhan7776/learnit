# Learnit Monorepo

Turborepo monorepo powered exclusively by **Bun** and **TypeScript**.

## Workspaces Structure

```
learnit/
├── apps/
│   ├── web/          # Main portal & dashboard (React + TS + shadcn/ui) [Port 3000]
│   ├── api/          # ElysiaJS REST API server (Bun + TypeScript) [Port 4000]
│   ├── rustal/       # Interactive Rust learning platform (React + Vite + TS) [Port 5173]
│   ├── golanger/     # Interactive Go learning platform (React + Vite + TS) [Port 5174]
│   └── scripter/     # Interactive JS/TS learning platform (React + Vite + TS) [Port 5175]
├── packages/
│   └── ui/           # Shared, theme-aware UI component library (@learnit/ui)
├── turbo.json        # Turborepo task pipeline configuration
├── package.json      # Root workspaces and scripts
└── bun.lock          # Monorepo lockfile
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.2.0 or higher)

### Installation

```bash
bun install
```

### Development

Run all applications concurrently:

```bash
bun run dev
```

Or run an individual app:

```bash
# Elysia API
bun --filter api dev

# Rustal
bun --filter rustal dev

# Golanger
bun --filter golanger dev

# Scripter
bun --filter scripter dev
```

### Build

Build all workspace apps using Turborepo with caching:

```bash
bun run build
```

### Type Checking & Linting

```bash
# Check types across all packages
bun run check-types

# Lint across all packages
bun run lint
```

## Apps Overview

- **web**: Main portal built with React, TypeScript, and shadcn/ui. Provides unified dashboard, service status, and user login (Port 3000).
- **api**: ElysiaJS high-performance backend API running directly on Bun with native TypeScript support (Port 4000).
- **rustal**: Interactive Rust browser curriculum and sandbox runner (Port 5173).
- **golanger**: Interactive Go browser curriculum and WebAssembly execution environment (Port 5174).
- **scripter**: Interactive JavaScript & TypeScript curriculum with instant browser evaluation (Port 5175).
