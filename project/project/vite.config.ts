import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Memungkinkan akses dari perangkat lain
    port: 5173,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});