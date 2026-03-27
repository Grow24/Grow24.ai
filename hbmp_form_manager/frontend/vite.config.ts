import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.HBMP_FORM_MANAGER_BASE || '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.HBMP_FORM_MANAGER_PORT || 5186),
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.HBMP_FORM_MANAGER_API_PORT || 5187}`,
        changeOrigin: true,
      },
    },
  },
})


