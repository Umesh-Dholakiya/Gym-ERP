import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic'
  })],
  server: {
    port: 3000,
    host: true, // Listen on all network interfaces
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['@heroicons/react/outline'],
  },
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/, // Include both .js and .jsx files
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});