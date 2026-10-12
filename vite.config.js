import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginShiki from './scripts/vite-plugin-shiki.js'

// Preload the body font (Geist 400) so text renders without waiting on CSS parse.
// Runs post-build because the woff2 filename is content-hashed.
function preloadBodyFont() {
  return {
    name: 'preload-body-font',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        const font = Object.keys(bundle).find((f) => /geist-sans-latin-400-normal-.*\.woff2$/.test(f))
        if (!font) throw new Error('preload-body-font: Geist 400 woff2 not found in bundle')
        return [{
          tag: 'link',
          attrs: { rel: 'preload', href: `/${font}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head',
        }]
      },
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vitePluginShiki(), react(), preloadBodyFont()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true
  }
})
