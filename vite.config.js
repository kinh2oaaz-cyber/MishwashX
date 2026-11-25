import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * GitHub Pages deployment notes
 * -----------------------------
 * Project sites live at  https://<user>.github.io/<repo>/  and therefore need a
 * non-root base path. Set VITE_BASE_PATH=/<repo>/ in .env (or in the workflow).
 * User/organisation sites and custom domains use VITE_BASE_PATH=/ .
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'

  return {
    base,
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      chunkSizeWarningLimit: 1400,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            if (id.includes('three')) return 'vendor-three'
            if (id.includes('gsap')) return 'vendor-gsap'
            if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils'))
              return 'vendor-motion'
            if (id.includes('@supabase')) return 'vendor-supabase'
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/'))
              return 'vendor-react'
            return 'vendor'
          },
        },
      },
    },
    server: { port: 5173, open: false },
    preview: { port: 4173 },
  }
})
