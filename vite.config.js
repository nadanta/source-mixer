// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/source-mixer/',  // IMPORTANT: must match your GitHub repo name
  build: {
    outDir: 'docs'
  }
});
