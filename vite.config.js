// my-mcq-app/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // string shorthand for simple proxy
      '/api': {
        // The address of your FastAPI backend
        target: 'http://127.0.0.1:8000',
        // Change the origin of the host header to the target URL
        changeOrigin: true,
        // Note: No rewrite is needed here because your FastAPI routes are
        // already prefixed with /api. If they were not, you would add:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})