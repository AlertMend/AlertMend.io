import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* Frontend runs on 5174 so it doesn't collide with the marketing site
 * (5173). The backend listens on 4000; we use Vite's proxy for /api/*
 * so all fetches stay same-origin and avoid CORS pre-flights in dev. */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
