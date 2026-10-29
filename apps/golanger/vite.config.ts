import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  server: {
    port: 5174,
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
});
