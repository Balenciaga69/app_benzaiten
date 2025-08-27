import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    open: true,
    port: 7414,
    host: '0.0.0.0',
    hmr: {
      port: 7414,
      host: 'localhost',
    },
  },
})
