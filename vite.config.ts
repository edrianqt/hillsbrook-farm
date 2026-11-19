import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // three.js alone is ~900 kB before compression (~240 kB gzipped); it loads separately after the text.
    chunkSizeWarningLimit: 1000,
  },
})
