# 📜 Scripter — In-Browser JavaScript & TypeScript Mastery

> Master JavaScript, TypeScript, Express, Middlewares, PostgreSQL, Mongoose, and ElysiaJS directly in your browser. Complete hands-on curriculum with **coss.com/ui** & **shadcn/ui** design, Monaco editor, 100% in-browser client-side execution engine, and offline local progress persistence.

---

## ✨ Features

- **30 Modules across 8 Comprehensive Tracks**:
  - **JavaScript Basics**: Variables, Scopes, Primitives, Coercion, Control Flow, Functions, Arrays, Objects, Strings, Regex, Sets/Maps, Error Handling.
  - **JavaScript Advanced**: Closures, Prototypes, `this` Binding, Promises, Async/Await, Event Loop, Timers, Generators, Proxies & Metaprogramming.
  - **TypeScript Basics**: Primitives, Tuples, Interfaces, Type Aliases, Unions, Type Narrowing, Guards, Function Overloads, Classes, Parameter Properties.
  - **TypeScript Advanced**: Generics, Generic Constraints, Keyof, Indexed Access, Conditional Types, Mapped Types, `infer`, Recursive Utility Types.
  - **Express & Middleware**: App Routing, Request Parameters, Query Strings, JSON Body Handling, Custom Middleware, Bearer Auth, 4-argument Error Handlers, Sub-routers.
  - **PostgreSQL**: SQL DDL & DML, Constraints, Parameterized Queries (`$1, $2`), Aggregations, Joins, ACID Transactions (`BEGIN`, `COMMIT`, `ROLLBACK`).
  - **Mongoose ODM**: Schemas, Types, Required/Default Validations, Pre/Post Lifecycle Hooks, Instance Methods, Static Methods, Virtual Getters.
  - **ElysiaJS**: Web Standard Request/Response Routing, TypeBox `t` Schema Validation, Hooks Lifecycle, Plugins, and Shared Context State.
- **100% In-Browser Client-Side Engine**:
  - Instant in-browser transpilation via Sucrase and TypeScript.
  - Zero-install, zero-docker requirement: runs anywhere including static deployments.
  - Built-in test runner with `describe`, `test`, `it`, `expect` (matchers, deep equality, error assertion).
- **Monaco Code Editor**: Full VS Code editor engine with dynamic syntax highlighting (`javascript` and `typescript`), auto-save, bracket matching, and font size adjustment.
- **Vim Navigation Mode**: Built-in toggle for Vim modal editing (ideal for Neovim / LazyVim users).
- **Interactive Terminal & ANSI Colors**: Real-time test output with Vitest-style pass/fail indicators, timing, and error pointers.
- **Topic Theory & Guides**: Rich markdown explanations from topic `README.md` files with direct links to MDN, TypeScript Handbook, Express, PostgreSQL, Mongoose, and ElysiaJS documentation.
- **Progressive Hints & Solutions**: Expandable hints to guide you when stuck, plus verified solutions with confirmation guards and an "Apply to Editor" feature.
- **100% Local Persistence**:
  - Automatically saves code edits per exercise in browser `localStorage`.
  - Solved status, bookmarks, and activity history.
  - Export & Import progress as JSON snapshots for backups or sharing across devices.
  - Reset single exercise or reset all progress.
- **Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy search across all exercises.
- **Keyboard Shortcuts**:
  - `⌘ + Enter` / `Ctrl + Enter`: Run & Test current exercise
  - `⌘ + K` / `Ctrl + K`: Jump to exercise
  - `Alt + →`: Next exercise
  - `Alt + ←`: Previous exercise

---

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh) (v1.2+) or Node.js (v18+)

### Installation & Run

```bash
# Enter directory
cd scripter

# Install dependencies with Bun
bun install

# Start development server
bun run dev

# Or build for production
bun run build
bun run preview
```

Open `http://localhost:5173` in your browser.

---

## 📁 Project Structure

```
scripter/
├── exercises/          # 30 categorized modules with individual starter exercises
├── solutions/          # Verified reference solutions for all exercises
├── src/
│   ├── components/     # UI components (Header, Sidebar, CodeEditor, Terminal, etc.)
│   ├── context/        # Scripter state provider & keyboard shortcuts
│   ├── data/
│   │   └── exercises.json # Pre-compiled exercises, hints, readmes, and solutions
│   ├── lib/            # Storage persistence, ANSI parser, utility helpers
│   ├── services/
│   │   └── compiler.ts # 100% in-browser client-side JS/TS runner & mock runtimes
│   ├── types/          # TypeScript interfaces (Exercise, CompileResult, etc.)
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── scripts/
│   ├── build-curriculum.ts    # Re-compiles exercises into exercises.json
│   └── verify-all-exercises.ts# Automated validation test suite
└── package.json
```

---

## 📜 Verification

To verify that all exercises and reference solutions pass:

```bash
bun run verify
```
