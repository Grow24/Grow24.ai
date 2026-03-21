import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Served under http://localhost:5173/HBMPONE/ via root app proxy (see repo root vite.config.ts).
// Standalone: `HBMPONE_BASE=/ npm run dev` → http://localhost:<port>/
const hbmpBase = process.env.HBMPONE_BASE ?? '/HBMPONE/'
const hbmpPort = Number(process.env.HBMPONE_PORT || 5175)

// https://vitejs.dev/config/
export default defineConfig({
  base: hbmpBase,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@xyflow/react', 
      'framer-motion',
      '@univerjs/core',
      '@univerjs/sheets',
      '@univerjs/sheets-ui',
      '@univerjs/sheets-formula',
      '@univerjs/ui',
      '@univerjs/design',
    ],
  },
  server: {
    host: '0.0.0.0', // Allow external access (needed for ngrok)
    port: hbmpPort,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.HBMP_API_PORT || '4000'}`,
        changeOrigin: true,
      },
    },
  },
})

