import type { CompileResult } from '../types/exercise';

interface PendingRequest {
  resolve: (res: CompileResult) => void;
  reject: (err: any) => void;
  timer: any;
  startTime: number;
}

class GoWasmRunner {
  private worker: Worker | null = null;
  private pending = new Map<string, PendingRequest>();
  private reqCounter = 0;
  private isReady = false;

  constructor() {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      this.initWorker();
      // Preload the WASM runtime in background
      this.preload();
    }
  }

  private initWorker() {
    try {
      this.worker = new Worker(new URL('./goWorker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = this.handleMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
    } catch (err) {
      console.warn('Failed to initialize Go WASM Web Worker:', err);
      this.worker = null;
    }
  }

  private preload() {
    if (!this.worker) return;
    this.worker.postMessage({ id: 'preload', type: 'INIT' });
  }

  private handleMessage(e: MessageEvent) {
    const { id, type, success, stdout, stderr, error } = e.data || {};

    if (type === 'INIT_DONE') {
      if (success) {
        this.isReady = true;
      }
      return;
    }

    if (type === 'RUN_DONE' && id) {
      const req = this.pending.get(id);
      if (req) {
        clearTimeout(req.timer);
        this.pending.delete(id);
        const duration = Math.round(performance.now() - req.startTime);

        req.resolve({
          success: Boolean(success),
          stdout: stdout || '',
          stderr: stderr || '',
          exitDetail: success ? 'Exited with status 0 (WASM)' : 'Execution failed (WASM)',
          executionTimeMs: duration,
        });
      }
    }
  }

  private handleWorkerError(e: ErrorEvent) {
    console.error('Go WASM worker error:', e);
    // Reject all pending requests
    for (const [id, req] of this.pending.entries()) {
      clearTimeout(req.timer);
      req.resolve({
        success: false,
        stdout: '',
        stderr: `Web Worker Error: ${e.message || 'Worker encountered an unexpected error.'}`,
        exitDetail: 'Worker Error',
        executionTimeMs: Math.round(performance.now() - req.startTime),
      });
    }
    this.pending.clear();
    this.restartWorker();
  }

  private restartWorker() {
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch {}
      this.worker = null;
    }
    this.initWorker();
  }

  public async run(code: string, isTest: boolean, timeoutMs = 8000): Promise<CompileResult> {
    if (!this.worker) {
      this.initWorker();
      if (!this.worker) {
        return {
          success: false,
          stdout: '',
          stderr: 'WebAssembly execution is not supported in this browser environment.',
          exitDetail: 'WASM Unsupported',
          executionTimeMs: 0,
        };
      }
    }

    const id = `req_${++this.reqCounter}_${Date.now()}`;
    const startTime = performance.now();

    return new Promise<CompileResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        // Terminate hanging worker (e.g. from infinite loop `for {}`)
        this.restartWorker();
        resolve({
          success: false,
          stdout: '',
          stderr: `Execution timed out (exceeded ${Math.round(timeoutMs / 1000)}s).\nYour code may contain an infinite loop (e.g., \`for {}\`) or an unbuffered channel deadlock.`,
          exitDetail: 'Timed Out',
          executionTimeMs: Math.round(performance.now() - startTime),
        });
      }, timeoutMs);

      this.pending.set(id, { resolve, reject, timer, startTime });
      this.worker!.postMessage({ id, type: 'RUN', code, isTest });
    });
  }

  public get ready(): boolean {
    return this.isReady;
  }
}

export const goWasmRunner = new GoWasmRunner();
