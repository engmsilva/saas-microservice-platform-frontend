import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@monaco-editor/react']
  },
  resolve: {
    alias: {
      '@monaco-editor/react': '@monaco-editor/react'
    }
  }
});