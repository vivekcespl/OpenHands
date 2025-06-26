import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 12000,
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 12000
    }
  },
  preview: {
    host: true,
    port: 12000,
    strictPort: true,
    cors: true
  }
});