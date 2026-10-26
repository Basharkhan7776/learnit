import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

function localGoRunnerPlugin(): Plugin {
  return {
    name: 'local-go-runner',
    configureServer(server) {
      server.middlewares.use('/api/compile', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method Not Allowed');
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const { code, isTest } = JSON.parse(body);
            const runnerDir = path.resolve(process.cwd(), 'runner');
            const uniqueId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            const isTestMode = Boolean(isTest || code.includes('func Test') || code.includes('*testing.T'));

            const fileName = isTestMode ? `${uniqueId}_test.go` : `${uniqueId}.go`;
            const filePath = path.join(runnerDir, fileName);

            fs.writeFileSync(filePath, code, 'utf-8');

            const goArgs = isTestMode
              ? ['test', '-v', '-count=1', fileName]
              : ['run', fileName];

            const goProc = spawn('go', goArgs, { cwd: runnerDir, detached: true });
            let goStdout = '';
            let goStderr = '';

            const TIMEOUT_MS = 6000;
            let killedDueToTimeout = false;

            const killProcessTree = () => {
              try {
                if (goProc.pid) {
                  process.kill(-goProc.pid, 'SIGKILL');
                }
              } catch {
                try {
                  goProc.kill('SIGKILL');
                } catch {}
              }
            };

            const timer = setTimeout(() => {
              killedDueToTimeout = true;
              killProcessTree();
            }, TIMEOUT_MS);

            goProc.stdout.on('data', d => { goStdout += d.toString(); });
            goProc.stderr.on('data', d => { goStderr += d.toString(); });

            let cleanedUp = false;
            const cleanup = () => {
              if (cleanedUp) return;
              cleanedUp = true;
              clearTimeout(timer);
              try {
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                }
              } catch {}
            };

            res.on('close', () => {
              if (!res.writableEnded) {
                cleanup();
                killProcessTree();
              }
            });

            goProc.on('close', codeExit => {
              cleanup();

              if (killedDueToTimeout) {
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: false,
                  stdout: goStdout,
                  stderr: `Execution timed out (${TIMEOUT_MS / 1000}s limit). Please check for infinite loops or channel deadlocks.\n${goStderr}`,
                  exitDetail: 'Timeout exceeded'
                }));
              }

              const combined = `${goStdout} ${goStderr}`;
              // Canonical Go status: exit code 0 means success
              let passed = codeExit === 0;

              if (isTestMode) {
                // In Go test, exit code 0 means all tests passed. Any failure exits non-zero and outputs '--- FAIL:'
                passed = codeExit === 0 && !combined.includes('--- FAIL:');
              }

              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: passed,
                stdout: goStdout,
                stderr: goStderr,
                exitDetail: passed ? 'Exited with status 0' : `Execution failed (status ${codeExit})`
              }));
            });

            goProc.on('error', err => {
              cleanup();
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: false,
                stdout: '',
                stderr: `Failed to spawn go: ${err.message}`,
                exitDetail: 'Go compiler not found'
              }));
            });
          } catch (e: any) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: e.message }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [
    localGoRunnerPlugin(),
    tailwindcss(),
    react(),
  ],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@monaco-editor/') || id.includes('node_modules/monaco-editor/')) {
            return 'monaco-vendor';
          }
          if (id.includes('node_modules/react-markdown/') || id.includes('node_modules/remark-gfm/')) {
            return 'markdown-vendor';
          }
        },
      },
    },
  },
})
