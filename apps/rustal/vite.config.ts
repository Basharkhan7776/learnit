import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'

function localRustRunnerPlugin(): Plugin {
  return {
    name: 'local-rust-runner',
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
            const hasRunner = fs.existsSync(path.join(runnerDir, 'Cargo.toml'));
            const usesExternalCrates = /(axum|tokio|tower|serde|postgres|tungstenite|http_body_util)/.test(code);

            // Use cached Cargo runner if external crates are required
            if (usesExternalCrates && hasRunner) {
              let runnerCode = code;
              if (!runnerCode.includes('fn main')) {
                runnerCode += '\n\n#[allow(dead_code)]\nfn main() {}\n';
              }
              const runnerMainRs = path.join(runnerDir, 'src/main.rs');
              fs.writeFileSync(runnerMainRs, runnerCode, 'utf-8');

              const cargoArgs = isTest
                ? ['test', '--color=always']
                : ['run', '--color=always'];

              const cargoProc = spawn('cargo', cargoArgs, { cwd: runnerDir });
              let cargoStdout = '';
              let cargoStderr = '';

              cargoProc.stdout.on('data', d => { cargoStdout += d.toString(); });
              cargoProc.stderr.on('data', d => { cargoStderr += d.toString(); });

              cargoProc.on('close', codeExit => {
                const combined = `${cargoStdout} ${cargoStderr}`;
                let passed = codeExit === 0;
                if (isTest) {
                  if (combined.includes('FAILED')) {
                    passed = false;
                  }
                  if (combined.includes('test result: ok')) {
                    passed = true;
                  }
                }

                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: passed,
                  stdout: cargoStdout,
                  stderr: cargoStderr,
                  exitDetail: passed ? 'Exited with status 0' : `Execution failed (status ${codeExit})`
                }));
              });

              cargoProc.on('error', err => {
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: false,
                  stdout: '',
                  stderr: `Failed to spawn cargo: ${err.message}`,
                  exitDetail: 'Cargo runner error'
                }));
              });
              return;
            }

            // Fallback to fast rustc directly for standard library exercises
            const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rustal-'));
            const rsFile = path.join(tempDir, 'main.rs');
            const binFile = path.join(tempDir, 'main');

            fs.writeFileSync(rsFile, code, 'utf-8');

            const rustcArgs = ['--color=always', rsFile, '-o', binFile];
            if (isTest) {
              rustcArgs.unshift('--test');
            }

            const compileProc = spawn('rustc', rustcArgs);
            let compileStderr = '';
            let compileStdout = '';

            compileProc.stderr.on('data', d => { compileStderr += d.toString(); });
            compileProc.stdout.on('data', d => { compileStdout += d.toString(); });

            compileProc.on('close', codeExit => {
              if (codeExit !== 0) {
                try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: false,
                  stdout: compileStdout,
                  stderr: compileStderr,
                  exitDetail: `Compilation failed (status ${codeExit})`
                }));
              }

              const runProc = spawn(binFile, []);
              let runStdout = '';
              let runStderr = '';

              runProc.stdout.on('data', d => { runStdout += d.toString(); });
              runProc.stderr.on('data', d => { runStderr += d.toString(); });

              runProc.on('close', runExit => {
                try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: runExit === 0,
                  stdout: runStdout,
                  stderr: runStderr || compileStderr,
                  exitDetail: `Exited with status ${runExit}`
                }));
              });

              runProc.on('error', err => {
                try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: false,
                  stdout: runStdout,
                  stderr: err.message,
                  exitDetail: 'Execution error'
                }));
              });
            });

            compileProc.on('error', err => {
              try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: false,
                stdout: '',
                stderr: `Failed to spawn rustc: ${err.message}`,
                exitDetail: 'Compiler not found'
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

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@learnit/ui': path.resolve(import.meta.dirname, '../../packages/ui/src'),
      '@repo/ui': path.resolve(import.meta.dirname, '../../packages/ui/src'),
      'ui': path.resolve(import.meta.dirname, '../../packages/ui/src'),
    },
  },
  plugins: [
    localRustRunnerPlugin(),
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
