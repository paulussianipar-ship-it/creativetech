import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    // TipTap / ProseMirror pulls in a few large editor-only chunks.
    // Split them so the public (non-admin) bundle stays lean.
    rollupOptions: {
      output: {
        manualChunks: {
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})