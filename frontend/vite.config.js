// frontend/vite.config.js  ← YEHI FILE HAI NA?
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    legacy({
      targets: ['defaults', 'not IE 11', 'iOS >= 12']
    })
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',   
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  esbuild: {
    target: 'es2015'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015'
    }
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast'],
          map: ['leaflet', 'react-leaflet']
        }
      }
    }
  }
})