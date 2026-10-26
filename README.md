# Learnit Monorepo

Turborepo monorepo powered exclusively by **Bun** and **TypeScript**.

## Workspaces Structure

```
learnit/
├── apps/
│   ├── api/          # ElysiaJS REST API server (Bun + TypeScript)
│   ├── golanger/     # Interactive Go learning platform (React + Vite + TS)
│   ├── rustal/       # Interactive Rust learning platform (React + Vite + TS)
│   └── scripter/     # Interactive JS/TS learning platform (React + Vite + TS)
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

- **api**: ElysiaJS high-performance backend API running directly on Bun with native TypeScript support.
- **rustal**: Interactive Rust browser curriculum and sandbox runner.
- **golanger**: Interactive Go browser curriculum and WebAssembly execution environment.
- **scripter**: Interactive JavaScript & TypeScript curriculum with instant browser evaluation.
