import { transform } from 'sucrase';
import { z } from 'zod';
import type { CompileResult, ExerciseLanguage, ExerciseMode } from '../types/exercise';

// ============================================================================
// ANSI Color Escape Helpers
// ============================================================================
const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bgGreen: '\x1b[42m\x1b[30m',
  bgRed: '\x1b[41m\x1b[37m',
};

// ============================================================================
// Deep Equality Helper for Expectations
// ============================================================================
function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null || typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

function formatValue(v: any): string {
  if (typeof v === 'string') return `"${v}"`;
  if (typeof v === 'undefined') return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return `[Function: ${v.name || 'anonymous'}]`;
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

// ============================================================================
// In-Memory Test Runner & Assertion Matchers
// ============================================================================
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

class TestSuite {
  tests: { name: string; fn: () => any | Promise<any> }[] = [];
  results: TestResult[] = [];
  currentSuiteName: string = '';

  addTest(name: string, fn: () => any | Promise<any>) {
    const fullName = this.currentSuiteName ? `${this.currentSuiteName} > ${name}` : name;
    this.tests.push({ name: fullName, fn });
  }

  setSuite(name: string) {
    this.currentSuiteName = name;
  }

  clearSuite() {
    this.currentSuiteName = '';
  }

  async run(): Promise<{ passed: boolean; results: TestResult[] }> {
    let allPassed = true;
    for (const test of this.tests) {
      const start = performance.now();
      try {
        await test.fn();
        const durationMs = Math.round(performance.now() - start);
        this.results.push({ name: test.name, passed: true, durationMs });
      } catch (err: any) {
        allPassed = false;
        const durationMs = Math.round(performance.now() - start);
        this.results.push({
          name: test.name,
          passed: false,
          error: err?.message || String(err),
          durationMs,
        });
      }
    }
    return { passed: allPassed, results: this.results };
  }
}

function createExpect(_suite: TestSuite) {
  return function expect(actual: any) {
    const matchers = (isNot = false) => ({
      toBe(expected: any) {
        const matches = Object.is(actual, expected);
        if (isNot ? matches : !matches) {
          throw new Error(
            `Expected ${formatValue(actual)} ${isNot ? 'NOT to be' : 'to be'} ${formatValue(expected)}`
          );
        }
      },
      toEqual(expected: any) {
        const matches = deepEqual(actual, expected);
        if (isNot ? matches : !matches) {
          throw new Error(
            `Expected ${formatValue(actual)} ${isNot ? 'NOT to equal' : 'to deeply equal'} ${formatValue(expected)}`
          );
        }
      },
      toBeTruthy() {
        const matches = Boolean(actual);
        if (isNot ? matches : !matches) {
          throw new Error(`Expected ${formatValue(actual)} ${isNot ? 'NOT to be truthy' : 'to be truthy'}`);
        }
      },
      toBeFalsy() {
        const matches = !actual;
        if (isNot ? matches : !matches) {
          throw new Error(`Expected ${formatValue(actual)} ${isNot ? 'NOT to be falsy' : 'to be falsy'}`);
        }
      },
      toBeNull() {
        const matches = actual === null;
        if (isNot ? matches : !matches) {
          throw new Error(`Expected ${formatValue(actual)} ${isNot ? 'NOT to be null' : 'to be null'}`);
        }
      },
      toBeUndefined() {
        const matches = actual === undefined;
        if (isNot ? matches : !matches) {
          throw new Error(`Expected ${formatValue(actual)} ${isNot ? 'NOT to be undefined' : 'to be undefined'}`);
        }
      },
      toBeDefined() {
        const matches = actual !== undefined;
        if (isNot ? matches : !matches) {
          throw new Error(`Expected value ${isNot ? 'NOT to be defined' : 'to be defined'}`);
        }
      },
      toContain(item: any) {
        let matches = false;
        if (typeof actual === 'string' || Array.isArray(actual)) {
          matches = actual.includes(item);
        } else if (actual instanceof Set || actual instanceof Map) {
          matches = actual.has(item);
        }
        if (isNot ? matches : !matches) {
          throw new Error(`Expected ${formatValue(actual)} ${isNot ? 'NOT to contain' : 'to contain'} ${formatValue(item)}`);
        }
      },
      toHaveLength(length: number) {
        const actualLength = actual?.length ?? actual?.size;
        const matches = actualLength === length;
        if (isNot ? matches : !matches) {
          throw new Error(`Expected length to be ${length}, but got ${actualLength}`);
        }
      },
      toBeGreaterThan(expected: number) {
        const matches = actual > expected;
        if (isNot ? matches : !matches) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toBeGreaterThanOrEqual(expected: number) {
        const matches = actual >= expected;
        if (isNot ? matches : !matches) {
          throw new Error(`Expected ${actual} to be >= ${expected}`);
        }
      },
      toBeLessThan(expected: number) {
        const matches = actual < expected;
        if (isNot ? matches : !matches) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      },
      toBeLessThanOrEqual(expected: number) {
        const matches = actual <= expected;
        if (isNot ? matches : !matches) {
          throw new Error(`Expected ${actual} to be <= ${expected}`);
        }
      },
      toThrow(expectedError?: string | RegExp) {
        if (typeof actual !== 'function') {
          throw new Error('toThrow requires a function');
        }
        let threw = false;
        let thrownError: any = null;
        try {
          actual();
        } catch (e: any) {
          threw = true;
          thrownError = e;
        }
        if (!threw && !isNot) {
          throw new Error('Expected function to throw, but it did not');
        }
        if (threw && isNot) {
          throw new Error(`Expected function NOT to throw, but it threw: ${thrownError?.message || thrownError}`);
        }
        if (threw && expectedError) {
          const msg = thrownError?.message || String(thrownError);
          const matches = expectedError instanceof RegExp ? expectedError.test(msg) : msg.includes(expectedError);
          if (!matches) {
            throw new Error(`Expected thrown error to match ${expectedError}, but got "${msg}"`);
          }
        }
      },
    });

    return {
      ...matchers(false),
      not: matchers(true),
      resolves: {
        async toBe(expected: any) {
          const res = await actual;
          if (!Object.is(res, expected)) {
            throw new Error(`Expected promise to resolve to ${formatValue(expected)} but got ${formatValue(res)}`);
          }
        },
        async toEqual(expected: any) {
          const res = await actual;
          if (!deepEqual(res, expected)) {
            throw new Error(`Expected promise to resolve to deep equal ${formatValue(expected)} but got ${formatValue(res)}`);
          }
        },
      },
      rejects: {
        async toThrow(expectedError?: string) {
          let threw = false;
          let thrownError: any = null;
          try {
            await actual;
          } catch (e) {
            threw = true;
            thrownError = e;
          }
          if (!threw) {
            throw new Error('Expected promise to reject, but it resolved');
          }
          if (expectedError) {
            const msg = thrownError?.message || String(thrownError);
            if (!msg.includes(expectedError)) {
              throw new Error(`Expected rejection to include "${expectedError}", but got "${msg}"`);
            }
          }
        },
      },
    };
  };
}

// ============================================================================
// In-Memory Express Simulator
// ============================================================================
interface SimRequest {
  method: string;
  url: string;
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  headers: Record<string, string>;
}

interface SimResponse {
  statusCode: number;
  body: any;
  headers: Record<string, string>;
  status(code: number): SimResponse;
  json(data: any): SimResponse;
  send(data: any): SimResponse;
  set(key: string, val: string): SimResponse;
  setHeader(key: string, val: string): SimResponse;
  getHeader(key: string): string | undefined;
}

type MiddlewareFn = (req: SimRequest, res: SimResponse, next: (err?: any) => void) => any;
type ErrorMiddlewareFn = (err: any, req: SimRequest, res: SimResponse, next: (err?: any) => void) => any;

class SimRouter {
  routes: {
    method: string | 'USE';
    path: string;
    handler: MiddlewareFn | ErrorMiddlewareFn | SimRouter;
  }[] = [];

  use(pathOrHandler: string | MiddlewareFn | SimRouter, ...handlers: MiddlewareFn[]) {
    if (typeof pathOrHandler === 'string') {
      for (const h of handlers) {
        this.routes.push({ method: 'USE', path: pathOrHandler, handler: h });
      }
    } else {
      this.routes.push({ method: 'USE', path: '/', handler: pathOrHandler });
      for (const h of handlers) {
        this.routes.push({ method: 'USE', path: '/', handler: h });
      }
    }
    return this;
  }

  get(path: string, ...handlers: MiddlewareFn[]) {
    handlers.forEach(h => this.routes.push({ method: 'GET', path, handler: h }));
    return this;
  }

  post(path: string, ...handlers: MiddlewareFn[]) {
    handlers.forEach(h => this.routes.push({ method: 'POST', path, handler: h }));
    return this;
  }

  put(path: string, ...handlers: MiddlewareFn[]) {
    handlers.forEach(h => this.routes.push({ method: 'PUT', path, handler: h }));
    return this;
  }

  delete(path: string, ...handlers: MiddlewareFn[]) {
    handlers.forEach(h => this.routes.push({ method: 'DELETE', path, handler: h }));
    return this;
  }
}

class SimExpressApp extends SimRouter {
  listen(_port?: number, cb?: () => void) {
    if (cb) cb();
    return this;
  }

  async handle(req: SimRequest, res: SimResponse): Promise<void> {
    const parseUrl = new URL(req.url, 'http://localhost');
    const pathname = parseUrl.pathname;
    const query: Record<string, string> = {};
    parseUrl.searchParams.forEach((v, k) => {
      query[k] = v;
    });
    req.query = query;

    let index = 0;
    let currentError: any = null;

    const next = async (err?: any) => {
      if (err) currentError = err;
      if (index >= this.routes.length) {
        if (currentError && res.statusCode === 200) {
          res.status(500).json({ error: currentError?.message || 'Internal Server Error' });
        }
        return;
      }

      const route = this.routes[index++];
      const match = matchRoute(route.path, pathname);

      if (!match) {
        return next();
      }

      req.params = { ...req.params, ...match.params };

      if (currentError) {
        // Error middleware has 4 arguments: (err, req, res, next)
        if (typeof route.handler === 'function' && route.handler.length === 4) {
          try {
            await (route.handler as ErrorMiddlewareFn)(currentError, req, res, next);
          } catch (e) {
            next(e);
          }
        } else {
          return next();
        }
      } else {
        if (route.method === 'USE' || route.method === req.method.toUpperCase()) {
          if (route.handler instanceof SimRouter) {
            // sub-router mounting
            await route.handler.routes.reduce(async (acc, _subRoute) => {
              await acc;
            }, Promise.resolve());
            return next();
          } else if (typeof route.handler === 'function' && route.handler.length < 4) {
            try {
              await (route.handler as MiddlewareFn)(req, res, next);
            } catch (e) {
              next(e);
            }
          } else {
            return next();
          }
        } else {
          return next();
        }
      }
    };

    await next();
  }
}

function matchRoute(routePattern: string, actualPath: string): { params: Record<string, string> } | null {
  if (routePattern === actualPath) return { params: {} };
  const routeParts = routePattern.split('/').filter(Boolean);
  const actualParts = actualPath.split('/').filter(Boolean);

  if (routePattern === '/' && actualPath !== '/') return null;
  if (routeParts.length !== actualParts.length && !routePattern.endsWith('*')) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < routeParts.length; i++) {
    const rp = routeParts[i];
    const ap = actualParts[i];
    if (rp.startsWith(':')) {
      params[rp.slice(1)] = decodeURIComponent(ap || '');
    } else if (rp === '*') {
      return { params };
    } else if (rp !== ap) {
      return null;
    }
  }
  return { params };
}

function createExpress() {
  const expressFn = () => new SimExpressApp();
  expressFn.Router = () => new SimRouter();
  expressFn.json = () => (req: SimRequest, _res: SimResponse, next: () => void) => {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch {}
    }
    next();
  };
  return expressFn;
}

function supertest(app: SimExpressApp) {
  const makeRequest = (method: string, url: string) => {
    let bodyData: any = undefined;
    const reqHeaders: Record<string, string> = {};

    const reqObj = {
      send(data: any) {
        bodyData = data;
        return reqObj;
      },
      set(key: string, val: string) {
        reqHeaders[key.toLowerCase()] = val;
        return reqObj;
      },
      async expect(expectedStatus: number | ((res: any) => void)) {
        const simReq: SimRequest = {
          method: method.toUpperCase(),
          url,
          params: {},
          query: {},
          body: bodyData,
          headers: reqHeaders,
        };

        let responseBody: any = '';
        let statusCode = 200;
        const resHeaders: Record<string, string> = {};

        const simRes: SimResponse = {
          statusCode: 200,
          body: '',
          headers: resHeaders,
          status(code: number) {
            statusCode = code;
            this.statusCode = code;
            return this;
          },
          json(data: any) {
            responseBody = data;
            this.body = data;
            resHeaders['content-type'] = 'application/json';
            return this;
          },
          send(data: any) {
            responseBody = data;
            this.body = data;
            return this;
          },
          set(k: string, v: string) {
            resHeaders[k.toLowerCase()] = v;
            return this;
          },
          setHeader(k: string, v: string) {
            return this.set(k, v);
          },
          getHeader(k: string) {
            return resHeaders[k.toLowerCase()];
          },
        };

        await app.handle(simReq, simRes);

        const resultRes = {
          status: statusCode,
          statusCode,
          body: responseBody,
          text: typeof responseBody === 'object' ? JSON.stringify(responseBody) : String(responseBody),
          headers: resHeaders,
        };

        if (typeof expectedStatus === 'number') {
          if (statusCode !== expectedStatus) {
            throw new Error(
              `Expected HTTP ${expectedStatus} but received ${statusCode}. Body: ${resultRes.text}`
            );
          }
        } else if (typeof expectedStatus === 'function') {
          expectedStatus(resultRes);
        }

        return resultRes;
      },
    };

    return reqObj;
  };

  return {
    get: (url: string) => makeRequest('GET', url),
    post: (url: string) => makeRequest('POST', url),
    put: (url: string) => makeRequest('PUT', url),
    delete: (url: string) => makeRequest('DELETE', url),
  };
}

// ============================================================================
// In-Memory PostgreSQL Simulator
// ============================================================================
class SimPgClient {
  tables: Record<string, any[]> = {};
  inTransaction: boolean = false;
  snapshot: Record<string, any[]> | null = null;

  async connect() {
    return this;
  }

  async release() {}

  async query(sqlText: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
    const trimmed = sqlText.trim();
    const upper = trimmed.toUpperCase();

    // Transactions
    if (upper === 'BEGIN') {
      this.inTransaction = true;
      this.snapshot = JSON.parse(JSON.stringify(this.tables));
      return { rows: [], rowCount: 0 };
    }
    if (upper === 'COMMIT') {
      this.inTransaction = false;
      this.snapshot = null;
      return { rows: [], rowCount: 0 };
    }
    if (upper === 'ROLLBACK') {
      if (this.snapshot) {
        this.tables = this.snapshot;
      }
      this.inTransaction = false;
      this.snapshot = null;
      return { rows: [], rowCount: 0 };
    }

    // CREATE TABLE
    const createMatch = trimmed.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\(([\s\S]+)\)/i);
    if (createMatch) {
      const tableName = createMatch[1].toLowerCase();
      if (!this.tables[tableName]) {
        this.tables[tableName] = [];
      }
      return { rows: [], rowCount: 0 };
    }

    // INSERT INTO
    const insertMatch = trimmed.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)(?:\s*RETURNING\s+(.+))?/i);
    if (insertMatch) {
      const tableName = insertMatch[1].toLowerCase();
      const cols = insertMatch[2].split(',').map(c => c.trim().toLowerCase());
      const valPlaceholders = insertMatch[3].split(',').map(v => v.trim());
      const returningClause = insertMatch[4]?.trim();

      if (!this.tables[tableName]) {
        this.tables[tableName] = [];
      }

      const row: Record<string, any> = { id: this.tables[tableName].length + 1 };
      cols.forEach((col, idx) => {
        const placeholder = valPlaceholders[idx];
        if (placeholder?.startsWith('$')) {
          const paramIndex = parseInt(placeholder.slice(1), 10) - 1;
          row[col] = params[paramIndex];
        } else {
          row[col] = placeholder?.replace(/^['"]|['"]$/g, '');
        }
      });

      this.tables[tableName].push(row);

      const returnedRows = returningClause ? [row] : [];
      return { rows: returnedRows, rowCount: 1 };
    }

    // SELECT
    const selectMatch = trimmed.match(/SELECT\s+([\s\S]+?)\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+(?:JOIN|INNER\s+JOIN|LEFT\s+JOIN)\s+([a-zA-Z0-9_]+)\s+ON\s+([\s\S]+?))?(?:\s+WHERE\s+([\s\S]+?))?(?:\s+GROUP\s+BY\s+([\s\S]+?))?(?:\s+ORDER\s+BY\s+([\s\S]+?))?(?:\s+LIMIT\s+([0-9]+))?$/i);
    if (selectMatch) {
      const selectCols = selectMatch[1].trim();
      const tableName = selectMatch[2].toLowerCase();
      const whereClause = selectMatch[5]?.trim();
      const limitVal = selectMatch[8] ? parseInt(selectMatch[8], 10) : undefined;

      let tableRows = this.tables[tableName] ? [...this.tables[tableName]] : [];

      // WHERE filter
      if (whereClause) {
        tableRows = tableRows.filter(r => {
          if (whereClause.includes('$1')) {
            const col = whereClause.split('=')[0].trim().toLowerCase();
            return r[col] == params[0];
          }
          if (whereClause.includes('=')) {
            const [c, val] = whereClause.split('=').map(s => s.trim());
            const cleanVal = val.replace(/^['"]|['"]$/g, '');
            return r[c.toLowerCase()] == cleanVal;
          }
          return true;
        });
      }

      // Aggregations e.g. COUNT(*)
      if (selectCols.toUpperCase().includes('COUNT(')) {
        return { rows: [{ count: tableRows.length }], rowCount: 1 };
      }

      if (limitVal !== undefined) {
        tableRows = tableRows.slice(0, limitVal);
      }

      return { rows: tableRows, rowCount: tableRows.length };
    }

    // UPDATE
    const updateMatch = trimmed.match(/UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i);
    if (updateMatch) {
      const tableName = updateMatch[1].toLowerCase();
      const rows = this.tables[tableName] || [];
      rows.forEach(r => {
        r.updated = true;
      });
      return { rows: [], rowCount: rows.length };
    }

    // DELETE
    const deleteMatch = trimmed.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+([\s\S]+))?$/i);
    if (deleteMatch) {
      const tableName = deleteMatch[1].toLowerCase();
      const count = (this.tables[tableName] || []).length;
      this.tables[tableName] = [];
      return { rows: [], rowCount: count };
    }

    return { rows: [], rowCount: 0 };
  }
}

class SimPgPool {
  client = new SimPgClient();

  async connect() {
    return this.client;
  }

  async query(sql: string, params?: any[]) {
    return this.client.query(sql, params);
  }

  async end() {}
}

const pgMock = {
  Pool: SimPgPool,
  Client: SimPgClient,
};

// ============================================================================
// In-Memory Mongoose Simulator
// ============================================================================
class SimMongooseSchema {
  definition: Record<string, any>;
  options: Record<string, any>;
  preHooks: Record<string, Function[]> = {};
  postHooks: Record<string, Function[]> = {};
  methods: Record<string, Function> = {};
  statics: Record<string, Function> = {};
  virtuals: Record<string, { getter?: Function; setter?: Function }> = {};

  constructor(definition: Record<string, any>, options: Record<string, any> = {}) {
    this.definition = definition;
    this.options = options;
  }

  pre(hook: string, fn: Function) {
    if (!this.preHooks[hook]) this.preHooks[hook] = [];
    this.preHooks[hook].push(fn);
    return this;
  }

  post(hook: string, fn: Function) {
    if (!this.postHooks[hook]) this.postHooks[hook] = [];
    this.postHooks[hook].push(fn);
    return this;
  }

  virtual(name: string) {
    if (!this.virtuals[name]) this.virtuals[name] = {};
    return {
      get: (getter: Function) => {
        this.virtuals[name].getter = getter;
        return this;
      },
      set: (setter: Function) => {
        this.virtuals[name].setter = setter;
        return this;
      },
    };
  }
}

function createMongoose() {
  const store: Record<string, any[]> = {};

  const modelFn = (modelName: string, schema: SimMongooseSchema) => {
    const collection = (store[modelName] = store[modelName] || []);

    class SimDocument {
      _id: string;
      [key: string]: any;

      constructor(data: Record<string, any> = {}) {
        this._id = Math.random().toString(36).slice(2, 10);
        Object.assign(this, data);

        // Attach schema methods
        for (const [mName, mFn] of Object.entries(schema.methods)) {
          (this as any)[mName] = mFn.bind(this);
        }

        // Attach virtual getters
        for (const [vName, vObj] of Object.entries(schema.virtuals)) {
          if (vObj.getter) {
            Object.defineProperty(this, vName, {
              get: () => vObj.getter!.call(this),
              configurable: true,
            });
          }
        }
      }

      async save() {
        // Run pre-save hooks
        const preSave = schema.preHooks['save'] || [];
        for (const hook of preSave) {
          if (hook.length > 0) {
            await new Promise((res, rej) => hook.call(this, (err?: any) => (err ? rej(err) : res(null))));
          } else {
            await hook.call(this);
          }
        }

        // Validation checks
        for (const [prop, spec] of Object.entries(schema.definition)) {
          if (spec && typeof spec === 'object') {
            if (spec.required && (this[prop] === undefined || this[prop] === null || this[prop] === '')) {
              throw new Error(`Validation Error: ${prop} is required`);
            }
            if (spec.min && this[prop] < spec.min) {
              throw new Error(`Validation Error: ${prop} cannot be less than ${spec.min}`);
            }
          }
        }

        collection.push(this);

        // Post-save hooks
        const postSave = schema.postHooks['save'] || [];
        for (const hook of postSave) {
          await hook.call(this, this);
        }
        return this;
      }
    }

    const ModelClass: any = SimDocument;

    ModelClass.create = async (docData: any) => {
      const doc = new SimDocument(docData);
      return await doc.save();
    };

    ModelClass.find = (query: Record<string, any> = {}) => {
      let filtered = collection.filter(item => {
        for (const [k, v] of Object.entries(query)) {
          if (item[k] !== v) return false;
        }
        return true;
      });
      return Promise.resolve(filtered);
    };

    ModelClass.findOne = (query: Record<string, any> = {}) => {
      const found = collection.find(item => {
        for (const [k, v] of Object.entries(query)) {
          if (item[k] !== v) return false;
        }
        return true;
      });
      return Promise.resolve(found || null);
    };

    ModelClass.findById = (id: string) => {
      const found = collection.find(item => item._id === id);
      return Promise.resolve(found || null);
    };

    ModelClass.findByIdAndUpdate = async (id: string, update: any, _options: any = {}) => {
      const doc = collection.find(item => item._id === id);
      if (!doc) return null;
      Object.assign(doc, update);
      return doc;
    };

    ModelClass.deleteOne = async (query: any) => {
      const idx = collection.findIndex(item => {
        for (const [k, v] of Object.entries(query)) {
          if (item[k] !== v) return false;
        }
        return true;
      });
      if (idx !== -1) collection.splice(idx, 1);
      return { deletedCount: idx !== -1 ? 1 : 0 };
    };

    // Attach static methods
    for (const [sName, sFn] of Object.entries(schema.statics)) {
      ModelClass[sName] = sFn.bind(ModelClass);
    }

    return ModelClass;
  };

  return {
    Schema: SimMongooseSchema,
    model: modelFn,
    Types: {
      ObjectId: () => Math.random().toString(36).slice(2, 10),
    },
  };
}

// ============================================================================
// In-Memory ElysiaJS Simulator
// ============================================================================
class SimElysia {
  routes: { method: string; path: string; handler: Function; schema?: any }[] = [];
  lifecycleHooks: {
    onRequest: Function[];
    onBeforeHandle: Function[];
    onAfterHandle: Function[];
    onError: Function[];
  } = {
    onRequest: [],
    onBeforeHandle: [],
    onAfterHandle: [],
    onError: [],
  };
  globalState: Record<string, any> = {};
  decorators: Record<string, any> = {};

  get(path: string, handler: Function, schema?: any) {
    this.routes.push({ method: 'GET', path, handler, schema });
    return this;
  }

  post(path: string, handler: Function, schema?: any) {
    this.routes.push({ method: 'POST', path, handler, schema });
    return this;
  }

  put(path: string, handler: Function, schema?: any) {
    this.routes.push({ method: 'PUT', path, handler, schema });
    return this;
  }

  delete(path: string, handler: Function, schema?: any) {
    this.routes.push({ method: 'DELETE', path, handler, schema });
    return this;
  }

  use(plugin: any) {
    if (typeof plugin === 'function') {
      plugin(this);
    }
    return this;
  }

  state(key: string, val: any) {
    this.globalState[key] = val;
    return this;
  }

  decorate(key: string, val: any) {
    this.decorators[key] = val;
    return this;
  }

  derive(fn: Function) {
    this.lifecycleHooks.onBeforeHandle.push(async (ctx: any) => {
      const derived = await fn(ctx);
      Object.assign(ctx, derived);
    });
    return this;
  }

  onRequest(fn: Function) {
    this.lifecycleHooks.onRequest.push(fn);
    return this;
  }

  onBeforeHandle(fn: Function) {
    this.lifecycleHooks.onBeforeHandle.push(fn);
    return this;
  }

  onAfterHandle(fn: Function) {
    this.lifecycleHooks.onAfterHandle.push(fn);
    return this;
  }

  onError(fn: Function) {
    this.lifecycleHooks.onError.push(fn);
    return this;
  }

  async handle(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const route = this.routes.find(r => r.method === request.method && r.path === url.pathname);

      if (!route) {
        return new Response('Not Found', { status: 404 });
      }

      let bodyData: any = undefined;
      if (request.method !== 'GET') {
        try {
          bodyData = await request.json();
        } catch {}
      }

      const queryParams: Record<string, string> = {};
      url.searchParams.forEach((v, k) => {
        queryParams[k] = v;
      });

      const ctx: any = {
        request,
        body: bodyData,
        query: queryParams,
        params: {},
        store: this.globalState,
        set: { status: 200, headers: {} },
        ...this.decorators,
      };

      // TypeBox Schema Validation if present
      if (route.schema?.body && bodyData) {
        const bodySchema = route.schema.body;
        if (bodySchema._validate) {
          const err = bodySchema._validate(bodyData);
          if (err) {
            return new Response(JSON.stringify({ error: err }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
      }

      // Run onRequest & onBeforeHandle hooks
      for (const hook of this.lifecycleHooks.onRequest) {
        await hook(ctx);
      }
      for (const hook of this.lifecycleHooks.onBeforeHandle) {
        await hook(ctx);
      }

      const result = await route.handler(ctx);

      // Run onAfterHandle hooks
      for (const hook of this.lifecycleHooks.onAfterHandle) {
        await hook(ctx);
      }

      if (result instanceof Response) return result;

      const responseString = typeof result === 'object' ? JSON.stringify(result) : String(result);
      return new Response(responseString, {
        status: ctx.set.status || 200,
        headers: {
          'Content-Type': typeof result === 'object' ? 'application/json' : 'text/plain',
          ...ctx.set.headers,
        },
      });
    } catch (err: any) {
      for (const hook of this.lifecycleHooks.onError) {
        const handled = await hook({ error: err });
        if (handled) return handled;
      }
      return new Response(err.message, { status: 500 });
    }
  }
}

// In-Memory TypeBox `t` simulator
const simTypeBox = {
  Object: (props: Record<string, any>) => ({
    type: 'object',
    properties: props,
    _validate: (val: any) => {
      if (typeof val !== 'object' || val === null) return 'Expected object';
      for (const [k, schema] of Object.entries(props)) {
        if (schema.required && val[k] === undefined) return `Field "${k}" is required`;
      }
      return null;
    },
  }),
  String: (opts: any = {}) => ({ type: 'string', required: true, ...opts }),
  Number: (opts: any = {}) => ({ type: 'number', required: true, ...opts }),
  Boolean: (opts: any = {}) => ({ type: 'boolean', required: true, ...opts }),
  Optional: (schema: any) => ({ ...schema, required: false }),
  Array: (schema: any) => ({ type: 'array', items: schema }),
};

// ============================================================================
// Main Execution Function
// ============================================================================
export async function executeCode(
  code: string,
  _mode: ExerciseMode,
  _language: ExerciseLanguage,
  _exerciseId?: string
): Promise<CompileResult> {
  const startTime = performance.now();
  const logs: string[] = [];
  const errors: string[] = [];

  // 1. Transpile Code with Sucrase (Typescript & ESM imports -> CommonJS/ES5)
  let transpiledJs = '';
  try {
    const res = transform(code, {
      transforms: ['typescript', 'imports'],
    });
    transpiledJs = res.code;
  } catch (err: any) {
    const duration = Math.round(performance.now() - startTime);
    return {
      success: false,
      stdout: '',
      stderr: `${ANSI.red}${ANSI.bold}Transpilation Error:${ANSI.reset}\n${err.message}`,
      exitDetail: 'Transpile Failed',
      executionTimeMs: duration,
    };
  }

  // 2. Setup Sandboxed Test Runner & Modules
  const testSuite = new TestSuite();
  const expect = createExpect(testSuite);
  const expressInstance = createExpress();
  const mongooseInstance = createMongoose();

  const customConsole = {
    log: (...args: any[]) => logs.push(args.map(formatValue).join(' ')),
    info: (...args: any[]) => logs.push(`${ANSI.cyan}ℹ${ANSI.reset} ` + args.map(formatValue).join(' ')),
    warn: (...args: any[]) => logs.push(`${ANSI.yellow}⚠${ANSI.reset} ` + args.map(formatValue).join(' ')),
    error: (...args: any[]) => errors.push(`${ANSI.red}✖${ANSI.reset} ` + args.map(formatValue).join(' ')),
  };

  const moduleExports: Record<string, any> = {};
  const simModule = { exports: moduleExports };

  const sandboxContext: Record<string, any> = {
    console: customConsole,
    // Test primitives
    describe: (name: string, fn: () => void) => {
      testSuite.setSuite(name);
      fn();
      testSuite.clearSuite();
    },
    test: (name: string, fn: () => any) => testSuite.addTest(name, fn),
    it: (name: string, fn: () => any) => testSuite.addTest(name, fn),
    expect,
    assert: (cond: boolean, msg?: string) => {
      if (!cond) throw new Error(msg || 'Assertion failed');
    },
    // Express & Supertest
    express: expressInstance,
    request: supertest,
    supertest,
    // PostgreSQL
    pg: pgMock,
    Pool: pgMock.Pool,
    Client: pgMock.Client,
    // Mongoose
    mongoose: mongooseInstance,
    // Elysia
    Elysia: SimElysia,
    t: simTypeBox,
    // Zod schema & type validation
    z,
    zod: { z, default: z, ...z },
    // CommonJS compatibility
    require: (moduleName: string) => {
      switch (moduleName) {
        case 'express':
          return expressInstance;
        case 'supertest':
          return supertest;
        case 'pg':
          return pgMock;
        case 'mongoose':
          return mongooseInstance;
        case 'elysia':
          return { default: SimElysia, Elysia: SimElysia, t: simTypeBox };
        case 'typebox':
        case '@sinclair/typebox':
          return simTypeBox;
        case 'zod':
          return { z, default: z, ...z };
        default:
          return {};
      }
    },
    module: simModule,
    exports: moduleExports,
  };

  // 3. Sandboxed Async Execution with Timeout Watchdog (4000ms)
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const runner = new AsyncFunction(...Object.keys(sandboxContext), transpiledJs);

    await Promise.race([
      runner(...Object.values(sandboxContext)),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Execution timed out (4000ms limit reached)')), 4000)
      ),
    ]);
  } catch (err: any) {
    const duration = Math.round(performance.now() - startTime);
    return {
      success: false,
      stdout: logs.join('\n'),
      stderr: `${ANSI.red}${ANSI.bold}Runtime Error:${ANSI.reset}\n${err?.message || String(err)}`,
      exitDetail: 'Runtime Failed',
      executionTimeMs: duration,
    };
  }

  // 4. Run Tests if in 'test' mode or if tests were registered
  const hasTests = testSuite.tests.length > 0;
  if (hasTests) {
    const { passed, results } = await testSuite.run();
    const duration = Math.round(performance.now() - startTime);

    const reportLines: string[] = [];
    if (passed) {
      reportLines.push(`${ANSI.bgGreen} PASS ${ANSI.reset} ${ANSI.gray}All assertions passed${ANSI.reset}`);
    } else {
      reportLines.push(`${ANSI.bgRed} FAIL ${ANSI.reset} ${ANSI.red}Some tests failed${ANSI.reset}`);
    }

    results.forEach(r => {
      if (r.passed) {
        reportLines.push(`  ${ANSI.green}✓${ANSI.reset} ${r.name} ${ANSI.gray}(${r.durationMs}ms)${ANSI.reset}`);
      } else {
        reportLines.push(`  ${ANSI.red}✕${ANSI.reset} ${r.name} ${ANSI.gray}(${r.durationMs}ms)${ANSI.reset}`);
        if (r.error) {
          reportLines.push(`    ${ANSI.red}${r.error}${ANSI.reset}`);
        }
      }
    });

    const passedCount = results.filter(r => r.passed).length;
    reportLines.push('');
    reportLines.push(
      `Tests: ${passed ? ANSI.green : ANSI.red}${passedCount} passed${ANSI.reset}, ${results.length} total`
    );
    reportLines.push(`Time:  ${duration}ms`);

    return {
      success: passed,
      stdout: logs.length > 0 ? logs.join('\n') + '\n\n' + reportLines.join('\n') : reportLines.join('\n'),
      stderr: errors.join('\n'),
      exitDetail: passed ? 'All tests passed' : 'Test suite failed',
      executionTimeMs: duration,
    };
  }

  // 5. 'run' mode without explicit tests
  const duration = Math.round(performance.now() - startTime);
  const success = errors.length === 0;

  return {
    success,
    stdout: logs.join('\n'),
    stderr: errors.join('\n'),
    exitDetail: success ? 'Executed successfully' : 'Execution had errors',
    executionTimeMs: duration,
  };
}
