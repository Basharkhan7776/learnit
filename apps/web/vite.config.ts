import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@learnit/ui': path.resolve(import.meta.dirname, '../../packages/ui/src'),
      '@repo/ui': path.resolve(import.meta.dirname, '../../packages/ui/src'),
      'ui': path.resolve(import.meta.dirname, '../../packages/ui/src'),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
});
