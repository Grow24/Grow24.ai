import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/testing-responsiveness/',
  server: {
    host: '0.0.0.0',
    port: Number(process.env.TESTING_RESPONSIVENESS_PORT || 5290),
    strictPort: true,
  },
  plugins: [react(), tailwindcss()],
})
