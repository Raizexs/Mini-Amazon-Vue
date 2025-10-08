// frontend/vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Permite configurar el backend por .env → VITE_API_URL
  const env = loadEnv(mode, process.cwd(), '')
  const API_URL = env.VITE_API_URL || 'http://127.0.0.1:8000'

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        // Todas las llamadas /api → FastAPI
        '/api': {
          target: API_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''), 
          // ^ Descomenta si tu backend NO tiene el prefijo /api en sus rutas.
        },
      },
    },
  }
})