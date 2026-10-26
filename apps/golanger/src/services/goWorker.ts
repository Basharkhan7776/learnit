/// <reference lib="webworker" />

let wasmLoaded = false;
let initPromise: Promise<void> | null = null;

async function initWasm(): Promise<void> {
  if (wasmLoaded && typeof (globalThis as any).__runGoWasm === 'function') {
    return;
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    // Load Go's WebAssembly support glue
    if (typeof (globalThis as any).Go === 'undefined') {
      importScripts('/wasm/wasm_exec.js');
    }

    const go = new (globalThis as any).Go();
    const wasmResp = await fetch('/wasm/yaegi.wasm');
    if (!wasmResp.ok) {
      throw new Error(`Failed to load /wasm/yaegi.wasm (${wasmResp.status} ${wasmResp.statusText})`);
    }

    let result: WebAssembly.WebAssemblyInstantiatedSource;
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        result = await WebAssembly.instantiateStreaming(wasmResp, go.importObject);
      } catch {
        const fallbackResp = await fetch('/wasm/yaegi.wasm');
        const buffer = await fallbackResp.arrayBuffer();
        result = await WebAssembly.instantiate(buffer, go.importObject);
      }
    } else {
      const buffer = await wasmResp.arrayBuffer();
      result = await WebAssembly.instantiate(buffer, go.importObject);
    }

    // Start Go wasm execution in background
    go.run(result.instance);
    wasmLoaded = true;
  })();

  return initPromise;
}

self.onmessage = async (e: MessageEvent) => {
  const { id, type, code, isTest } = e.data || {};

  if (type === 'INIT') {
    try {
      await initWasm();
      self.postMessage({ id, type: 'INIT_DONE', success: true });
    } catch (err: any) {
      self.postMessage({ id, type: 'INIT_DONE', success: false, error: err?.message || String(err) });
    }
    return;
  }

  if (type === 'RUN') {
    try {
      await initWasm();
      const runner = (globalThis as any).__runGoWasm;
      if (typeof runner !== 'function') {
        throw new Error('Go WebAssembly engine not initialized.');
      }

      const res = runner(code, Boolean(isTest));
      self.postMessage({
        id,
        type: 'RUN_DONE',
        success: Boolean(res?.success),
        stdout: res?.stdout || '',
        stderr: res?.stderr || '',
      });
    } catch (err: any) {
      self.postMessage({
        id,
        type: 'RUN_DONE',
        success: false,
        stdout: '',
        stderr: `Execution error: ${err?.message || String(err)}`,
      });
    }
  }
};
