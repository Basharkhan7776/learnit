import type { CompileResult, ExerciseMode } from '../types/exercise';
import { goWasmRunner } from './goWasmRunner';

const PLAYGROUND_URL = 'https://go.dev/_/compile';

export async function executeGoCode(code: string, mode: ExerciseMode): Promise<CompileResult> {
  const startTime = performance.now();
  const isTestMode = mode === 'test' || code.includes('func Test') || code.includes('*testing.T');

  // Tier 1: Attempt local/serverless compiler endpoint first (provided by Vite dev server or Vercel serverless function)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const localResp = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, isTest: isTestMode }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (localResp.ok) {
      const data = await localResp.json();
      const duration = Math.round(performance.now() - startTime);

      return {
        success: Boolean(data.success),
        stdout: data.stdout || '',
        stderr: data.stderr || '',
        exitDetail: data.exitDetail || (data.success ? 'Exited with status 0' : 'Execution failed'),
        executionTimeMs: duration,
        engine: 'local',
      };
    }
  } catch {
    // If /api/compile is unreachable (e.g. static preview, GitHub Pages, Netlify static, offline), proceed to WASM
  }

  // Tier 2: In-Browser WebAssembly Go Execution Engine (Yaegi WASM inside Web Worker)
  try {
    const wasmResult = await goWasmRunner.run(code, isTestMode, 8000);
    return {
      ...wasmResult,
      engine: 'wasm',
    };
  } catch (wasmErr: any) {
    console.warn('WASM execution error, attempting remote fallback:', wasmErr);
  }

  // Tier 3: Fallback to official Go Playground API (for standard environments where remote requests are permitted)
  try {
    const params = new URLSearchParams();
    params.append('version', '2');
    params.append('body', code);

    const response = await fetch(PLAYGROUND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (response.ok) {
      const data = await response.json();
      const duration = Math.round(performance.now() - startTime);

      let stdout = '';
      if (Array.isArray(data.Events)) {
        stdout = data.Events.map((e: any) => e.Message || '').join('');
      }

      const stderr = data.Errors || data.VetErrors || '';
      let passed = !stderr;

      if (isTestMode) {
        const combined = `${stdout} ${stderr}`;
        const hasFail = combined.includes('--- FAIL:') || combined.includes('FAIL\t') || combined.includes('\nFAIL');
        const hasPass = combined.includes('PASS\n') || combined.includes('--- PASS:');
        passed = !stderr && !hasFail && hasPass;
      }

      return {
        success: passed,
        stdout: stdout,
        stderr: stderr,
        exitDetail: data.Errors ? 'Compilation failed' : (passed ? 'Exited with status 0' : 'Test failed'),
        executionTimeMs: duration,
        engine: 'serverless',
      };
    }
  } catch {
    // Both endpoints failed
  }

  const duration = Math.round(performance.now() - startTime);
  return {
    success: false,
    stdout: '',
    stderr: 'Failed to execute code: Local backend is unavailable and in-browser WebAssembly could not complete.\nEnsure WebAssembly is enabled in your browser or dev server is active.',
    exitDetail: 'Execution Failed',
    executionTimeMs: duration,
  };
}
