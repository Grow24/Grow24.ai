import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const hbmpOneBase = process.env.HBMP_ONE_BASE ?? '/HBMP_One/'
const hbmpOnePort = Number(process.env.HBMP_ONE_PORT || 5175)

// https://vitejs.dev/config/
export default defineConfig({
  base: hbmpOneBase,
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
    port: hbmpOnePort,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.HBMP_API_PORT || '4000'}`,
        changeOrigin: true,
      },
    },
  },
})

