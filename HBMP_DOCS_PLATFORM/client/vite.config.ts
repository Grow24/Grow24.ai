import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const hbmpDocsBase = process.env.HBMP_DOCS_BASE ?? '/HBMP_DOCS_PLATFORM/'
const hbmpDocsPort = Number(process.env.HBMP_DOCS_PORT || 5177)

// https://vitejs.dev/config/
export default defineConfig({
  base: hbmpDocsBase,
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
    host: '0.0.0.0',
    port: hbmpDocsPort,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.HBMP_DOCS_API_PORT || '4000'}`,
        changeOrigin: true,
      },
    },
  },
})

