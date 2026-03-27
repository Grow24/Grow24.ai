import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const appManagerBase = process.env.APP_MANAGER_BASE ?? '/app_manager/'
const appManagerPort = Number(process.env.APP_MANAGER_PORT || 5183)
const appManagerApiPort = Number(process.env.APP_MANAGER_API_PORT || 5185)

export default defineConfig({
  base: appManagerBase,
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: appManagerPort,
    strictPort: true,
    watch: {
      ignored: ['**/backend/**']
    },
    proxy: {
      '/app_manager/api': {
        target: `http://localhost:${appManagerApiPort}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app_manager/, ''),
      },
    },
  },
  optimizeDeps: {
    exclude: ['backend']
  }
})
