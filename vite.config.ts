import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Fills %SITE_URL% in index.html with the live web address (set SITE_URL when building,
 * e.g. SITE_URL=https://hillsbrook.farm). Facebook needs full addresses for the share picture.
 * Without it the addresses stay relative, which is fine for testing.
 */
function siteUrl(): Plugin {
  const url = (process.env.SITE_URL ?? '').replace(/\/$/, '')
  return { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', url) }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
  build: {
    // three.js alone is ~900 kB before compression (~240 kB gzipped); it loads separately after the text.
    chunkSizeWarningLimit: 1000,
  },
})
