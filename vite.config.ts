import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'path'
import { vite404Plugin } from './vite-404-plugin'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Univer is a huge monorepo — watching it exhausts Linux inotify (ENOSPC). HBMPONE is a
    // separate Vite dev server. Ignore both so root `npm run dev` only watches this app.
    watch: {
      ignored: [
        '**/univer/**',
        '**/HBMPONE/**',
        '**/dist/**',
        '**/backend/**',
      ],
    },
    proxy: {
      // More specific than `/api` → HBMP backend
      '/api/send-email': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // HBMPONE client (Vite) — keep /HBMPONE prefix; client uses base: /HBMPONE/
      '/HBMPONE': {
        target: `http://localhost:${process.env.HBMPONE_PORT || '5175'}`,
        changeOrigin: true,
        ws: true,
      },
      // HBMP docs API (Express on 4000 by default)
      '/api': {
        target: `http://localhost:${process.env.HBMP_API_PORT || '4000'}`,
        changeOrigin: true,
      },
      '/univer': {
        target: `http://localhost:${process.env.UNIVER_PORT || '3002'}`,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/univer/, ''),
      },
    },
  },
  plugins: [
    vite404Plugin(),
    TanStackRouterVite(),
    react({
      // Ensure React is properly handled
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@routes': resolve(__dirname, './src/routes'),
      '@lib': resolve(__dirname, './src/lib'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    target: 'ES2022',
    minify: 'terser',
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Don't manually chunk React - let Vite handle it to avoid loading issues
          if (id.includes('node_modules')) {
            // Only chunk large libraries, not React
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three'
            }
            if (id.includes('@tanstack')) {
              return 'tanstack'
            }
            // Let everything else be auto-chunked by Vite
          }
        },
      },
    },
  },
})
