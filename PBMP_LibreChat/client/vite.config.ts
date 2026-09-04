import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const base = process.env.PBMP_LIBRECHAT_BASE ?? '/PBMP_LibreChat/'
const port = Number(process.env.PBMP_LIBRECHAT_PORT || 5200)
const apiPort = process.env.PBMP_LIBRECHAT_API_PORT || '5201'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port,
    strictPort: true,
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === '1',
      interval: Number(process.env.CHOKIDAR_INTERVAL || 1000),
    },
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
      '/PBMP_LibreChat/api': {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/PBMP_LibreChat/, '') || '/',
      },
    },
  },
})
