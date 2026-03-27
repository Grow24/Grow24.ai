import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Local Univer packages - use built lib files for packages that are built, src for others
      '@univerjs/core': path.resolve(__dirname, '../univer/univer/packages/core/lib/es'),
      '@univerjs/docs': path.resolve(__dirname, '../univer/univer/packages/docs/lib/es'),
      '@univerjs/docs-ui': path.resolve(__dirname, '../univer/univer/packages/docs-ui/lib/es'),
      '@univerjs/docs-drawing-ui': path.resolve(__dirname, '../univer/univer/packages/docs-drawing-ui/src'),
      '@univerjs/docs-hyper-link-ui': path.resolve(__dirname, '../univer/univer/packages/docs-hyper-link-ui/src'),
      '@univerjs/docs-mention-ui': path.resolve(__dirname, '../univer/univer/packages/docs-mention-ui/src'),
      '@univerjs/docs-quick-insert-ui': path.resolve(__dirname, '../univer/univer/packages/docs-quick-insert-ui/src'),
      '@univerjs/docs-thread-comment-ui': path.resolve(__dirname, '../univer/univer/packages/docs-thread-comment-ui/src'),
      '@univerjs/ui': path.resolve(__dirname, '../univer/univer/packages/ui/lib/es'),
      '@univerjs/design': path.resolve(__dirname, '../univer/univer/packages/design/lib/es'),
      '@univerjs/engine-render': path.resolve(__dirname, '../univer/univer/packages/engine-render/lib/es'),
      '@univerjs/engine-formula': path.resolve(__dirname, '../univer/univer/packages/engine-formula/lib/es'),
      '@univerjs/drawing': path.resolve(__dirname, '../univer/univer/packages/drawing/src'),
      '@univerjs/mockdata': path.resolve(__dirname, '../univer/univer/mockdata/src'),
    },
    preserveSymlinks: false,
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
      '@univerjs/docs',
      '@univerjs/docs-ui',
    ],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})

