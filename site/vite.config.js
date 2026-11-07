import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// The site reads ../lib, ../app, ../server and the recorded data/ at build time, so every
// number on the page is generated from the repo, never typed. Pages serves /GitGenie/ (capital G).
export default defineConfig({
  base: '/GitGenie/',
  plugins: [react()],
  server: { fs: { allow: ['..'] } },
});
