import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:4000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': apiUrl,
      },
    },
  }
})
