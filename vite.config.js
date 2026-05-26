import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginShiki from './scripts/vite-plugin-shiki.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vitePluginShiki(), react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true
  }
})