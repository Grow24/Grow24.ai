import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.DATAFLOW_BACKEND_PORT || process.env.PORT || '3001'}`,
        changeOrigin: true,
      },
      '/ws': {
        target: `ws://localhost:${process.env.DATAFLOW_BACKEND_PORT || process.env.PORT || '3001'}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
