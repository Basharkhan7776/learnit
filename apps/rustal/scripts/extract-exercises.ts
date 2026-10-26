import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import type { Exercise, ExerciseMode } from '../src/types/exercise.ts';

const RUSTLINGS_DIR = '/home/bashar-khan/rust/rustlings';
const CARGO_TOML = path.join(RUSTLINGS_DIR, 'Cargo.toml');
const EXERCISES_DIR = path.join(RUSTLINGS_DIR, 'exercises');
const SOLUTIONS_DIR = '/tmp/rustlings-6.5.0/solutions';
const OUTPUT_JSON = path.join(process.cwd(), 'src/data/exercises.json');

const CUSTOM_EXERCISES_DIR = path.join(process.cwd(), 'exercises');
const CUSTOM_SOLUTIONS_DIR = path.join(process.cwd(), 'solutions');

const CUSTOM_CATEGORIES: Record<string, { title: string; order: number }> = {
  '24_mutex': { title: 'Concurrency & Mutex', order: 25 },
  '25_axum_basics': { title: 'Axum Core & Routing', order: 26 },
  '26_axum_middlewares': { title: 'Axum Middlewares & HTTPS', order: 27 },
  '27_axum_advanced': { title: 'WebSockets & Database Tasks', order: 28 },
};

const CUSTOM_HINTS: Record<string, string> = {
  mutex1: 'Wrap `counter` in `Arc::new(Mutex::new(0))`. Inside each thread, call `let mut num = counter_clone.lock().unwrap(); *num += 1;` to mutate safely.',
  mutex2: 'To prevent circular deadlocks, always acquire locks in a globally deterministic order. Compare `from.id < to.id` and acquire the lower ID account balance lock first.',
  mutex3: 'Import `RwLock` from `std::sync`. In `get()`, acquire `.read().unwrap()`. In `insert()`, acquire `.write().unwrap()`.',
  mutex4: 'In `push_work`, notify waiting threads with `self.condvar.notify_one()`. In `pop_work`, wait inside a loop with `while q.is_empty() { q = self.condvar.wait(q).unwrap(); }`.',
  axum1: 'Handlers in Axum are async functions. Build the router with `Router::new().route("/", get(root)).route("/health", get(health_check))`.',
  axum2: 'Use `Path(id): Path<u64>` to extract single parameters, and `Path((team, member)): Path<(String, u64)>` for multiple parameters.',
  axum3: 'Add `#[derive(Deserialize)]` to `CreateItemPayload`, and `#[derive(Serialize, Deserialize, PartialEq, Eq)]` to `ItemResponse`. In `create_item`, check if `payload.name.is_empty() || payload.price == 0` and return `StatusCode::BAD_REQUEST`.',
  axum4: 'Wrap your shared state in `AppState` and register it with `app.with_state(state)`. In handlers, extract it using `State(state): State<AppState>`.',
  middleware1: 'In `trace_header_middleware`, call `let mut response = next.run(req).await;` then insert the header into `response.headers_mut()`.',
  middleware2: 'Read the `authorization` header from `req.headers()`. If missing or not equal to `Bearer secret-token-123`, return `StatusCode::UNAUTHORIZED.into_response()`.',
  middleware3: 'Use `ServiceBuilder::new().layer(SetResponseHeaderLayer::overriding(...)).layer(...)` to compose multiple Tower layers into a unified stack.',
  https1: 'Check if `x-forwarded-proto == "http"`. If so, redirect with `(StatusCode::MOVED_PERMANENTLY, [("location", target)])`. Otherwise, attach the HSTS, X-Content-Type-Options, and X-Frame-Options headers.',
  ws1: 'Implement `ws_handler(ws: WebSocketUpgrade) -> Response` by returning `ws.on_upgrade(handle_socket)`.',
  ws2: 'Match on `Message::Text(text)`. Format the message as `format!("{}: {}", username, text)` and broadcast via `tx.send(formatted)`.',
  postgres1: 'Always use parameterized SQL queries (`$1`). Call `pool.query_user(SQL, id)?` and return `Ok(Json(user))` or return `StatusCode::NOT_FOUND` if absent.',
  postgres2: 'In `execute_transfer_transaction`, check if `from_balance < amount`. If so, return `Err(StatusCode::UNPROCESSABLE_ENTITY)` without updating balances. Otherwise deduct from sender and credit recipient.',
};

function formatTitle(name: string): string {
  const m = name.match(/^([a-zA-Z_]+?)(\d+)$/);
  if (m) {
    const [, word, num] = m;
    const words = word.replace(/_/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase());
    return `${words} ${num}`;
  }
  return name.replace(/_/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase());
}

function formatCategoryTitle(cat: string): string {
  const name = cat.replace(/^\d+_/, '');
  return name.replace(/_/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase());
}

function parseInstructions(code: string): string {
  const instructionsLines: string[] = [];
  for (const line of code.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) {
      instructionsLines.push(trimmed.replace(/^\/\/\s*/, ''));
    } else if (trimmed === '') {
      continue;
    } else {
      break;
    }
  }
  return instructionsLines.join('\n');
}

async function main() {
  const exercises: Exercise[] = [];

  // 1. Extract official exercises if rustlings repo is present, else load from existing exercises.json
  if (fs.existsSync(CARGO_TOML) && fs.existsSync(EXERCISES_DIR)) {
    console.log('Reading official Rustlings Cargo.toml...');
    const cargoContent = fs.readFileSync(CARGO_TOML, 'utf-8');

    const matches: Array<{ name: string; relPath: string }> = [];
    const regex = /name\s*=\s*"([^"]+)",\s*path\s*=\s*"exercises\/([^"]+)"/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(cargoContent)) !== null) {
      matches.push({ name: match[1], relPath: match[2] });
    }

    const categories = fs
      .readdirSync(EXERCISES_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    const categoryOrderMap = new Map<string, number>();
    categories.forEach((cat, idx) => categoryOrderMap.set(cat, idx + 1));

    const categoryReadmes = new Map<string, string>();
    for (const cat of categories) {
      const readmePath = path.join(EXERCISES_DIR, cat, 'README.md');
      if (fs.existsSync(readmePath)) {
        categoryReadmes.set(cat, fs.readFileSync(readmePath, 'utf-8').trim());
      } else {
        categoryReadmes.set(cat, '');
      }
    }

    for (let idx = 0; idx < matches.length; idx++) {
      const { name, relPath } = matches[idx];
      const exerciseFile = path.join(EXERCISES_DIR, relPath);
      const cat = relPath.split('/')[0];

      const starterCode = fs.readFileSync(exerciseFile, 'utf-8');

      let hint = '';
      try {
        const res = spawnSync('rustlings', ['hint', name], {
          cwd: RUSTLINGS_DIR,
          encoding: 'utf-8',
          timeout: 5000,
        });
        let rawHint = (res.stdout || '').trim();
        if (rawHint.includes('Press ENTER to continue')) {
          rawHint = rawHint.split('Press ENTER to continue').pop()?.trim() || '';
        }
        hint = rawHint;
      } catch (e) {
        console.warn(`Warning: failed to get hint for ${name}:`, e);
      }

      let solutionCode = '';
      const solFile = path.join(SOLUTIONS_DIR, relPath);
      if (fs.existsSync(solFile)) {
        solutionCode = fs.readFileSync(solFile, 'utf-8');
      }

      const mode: ExerciseMode = starterCode.includes('#[test]') ? 'test' : 'run';
      const instructions = parseInstructions(starterCode);

      exercises.push({
        id: name,
        title: formatTitle(name),
        order: idx + 1,
        category: cat,
        categoryTitle: formatCategoryTitle(cat),
        categoryOrder: categoryOrderMap.get(cat) ?? 99,
        categoryReadme: categoryReadmes.get(cat) ?? '',
        path: `exercises/${relPath}`,
        filename: path.basename(relPath),
        mode,
        instructions,
        hint,
        starterCode,
        solutionCode: solutionCode || starterCode,
      });
    }
  } else if (fs.existsSync(OUTPUT_JSON)) {
    console.log('Preserving base exercises from exercises.json...');
    const existing = JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf-8')) as Exercise[];
    for (const ex of existing) {
      if (!Object.keys(CUSTOM_CATEGORIES).includes(ex.category)) {
        exercises.push(ex);
      }
    }
  }

  // 2. Extract Custom Modules (24_mutex, 25_axum_basics, 26_axum_middlewares, 27_axum_advanced)
  console.log('Extracting custom modules and exercises...');
  let currentOrder = exercises.length;

  for (const [cat, info] of Object.entries(CUSTOM_CATEGORIES)) {
    const catDir = path.join(CUSTOM_EXERCISES_DIR, cat);
    if (!fs.existsSync(catDir)) continue;

    const readmePath = path.join(catDir, 'README.md');
    const categoryReadme = fs.existsSync(readmePath)
      ? fs.readFileSync(readmePath, 'utf-8').trim()
      : '';

    const files = fs
      .readdirSync(catDir)
      .filter(f => f.endsWith('.rs'))
      .sort();

    for (const file of files) {
      currentOrder += 1;
      const id = path.basename(file, '.rs');
      const starterCode = fs.readFileSync(path.join(catDir, file), 'utf-8');

      let solutionCode = starterCode;
      const solPath = path.join(CUSTOM_SOLUTIONS_DIR, cat, file);
      if (fs.existsSync(solPath)) {
        solutionCode = fs.readFileSync(solPath, 'utf-8');
      }

      const mode: ExerciseMode = starterCode.includes('#[test]') ? 'test' : 'run';
      const instructions = parseInstructions(starterCode);
      const hint = CUSTOM_HINTS[id] || 'Follow the instructions and compiler hints.';

      exercises.push({
        id,
        title: formatTitle(id),
        order: currentOrder,
        category: cat,
        categoryTitle: info.title,
        categoryOrder: info.order,
        categoryReadme,
        path: `exercises/${cat}/${file}`,
        filename: file,
        mode,
        instructions,
        hint,
        starterCode,
        solutionCode,
      });
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(exercises, null, 2), 'utf-8');

  console.log(`Successfully generated ${OUTPUT_JSON} with ${exercises.length} exercises across 29 modules!`);
}

main().catch(console.error);
