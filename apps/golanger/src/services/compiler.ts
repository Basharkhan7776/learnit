import type { CompileResult, ExerciseMode } from '../types/exercise';
import { goWasmRunner } from './goWasmRunner';

const PLAYGROUND_URL = 'https://go.dev/_/compile';

export async function executeGoCode(code: string, mode: ExerciseMode): Promise<CompileResult> {
  const startTime = performance.now();
  const isTestMode = mode === 'test' || code.includes('func Test') || code.includes('*testing.T');

  // Tier 1: In-Browser WebAssembly Go Execution Engine (Yaegi WASM inside Web Worker)
  try {
    const wasmResult = await goWasmRunner.run(code, isTestMode, 8000);
    return {
      ...wasmResult,
      engine: 'wasm',
    };
  } catch (wasmErr: any) {
    console.warn('WASM execution error, attempting remote playground fallback:', wasmErr);
  }

  // Tier 2: Fallback to official Go Playground API
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
        stdout = data.Events.map((e: any) => e.Message).join('');
      }

      const stderr = data.Errors || '';
      const success = !stderr && (data.Status === 0 || !data.Status);

      return {
        success,
        stdout,
        stderr,
        exitDetail: success ? 'Exited with status 0' : 'Execution failed',
        executionTimeMs: duration,
        engine: 'playground',
      };
    }
  } catch (err: any) {
    const duration = Math.round(performance.now() - startTime);
    return {
      success: false,
      stdout: '',
      stderr: `Network/Execution error: ${err.message || 'Failed to execute Go code'}`,
      exitDetail: 'Network request failed',
      executionTimeMs: duration,
      engine: 'playground',
    };
  }

  const duration = Math.round(performance.now() - startTime);
  return {
    success: false,
    stdout: '',
    stderr: 'Failed to execute Go code via WASM or Playground fallback.',
    exitDetail: 'Execution engine unavailable',
    executionTimeMs: duration,
  };
}
