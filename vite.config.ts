import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/leetcode': {
          target: 'https://leetcode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/leetcode/, '/graphql'),
        },
      },
    },
  }
})
