import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// The site reads ../lib, ../app, ../server and the recorded data/ at build time, so every
// number on the page is generated from the repo, never typed. Pages serves the Next.js app at /GitGenie/ (capital G) and this dashboard at /GitGenie/lab/.
export default defineConfig({
  base: '/GitGenie/lab/',
  plugins: [react()],
  server: { fs: { allow: ['..'] } },
});
