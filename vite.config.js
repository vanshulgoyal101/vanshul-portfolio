// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    // Keep tests hermetic: force Supabase "unconfigured" so nothing hits the
    // network, regardless of whether a local .env exists.
    env: {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/test/**',
        'src/**/*.test.{js,jsx}',
        'src/**/index.js',
      ],
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Raise warning threshold since three.js is inherently large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vite's dynamic-import preload helper is statically imported by the
          // entry. If Rollup parks it inside a lazy vendor chunk, that chunk
          // becomes a first-paint dependency and code-splitting is defeated.
          if (id.includes('vite/preload-helper')) {
            return 'vite-preload';
          }
          // Core React — loads first, kept small
          if (id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          // React itself
          if (id.includes('node_modules/react/')) {
            return 'react-core';
          }
          // Framer Motion — used on critical path
          if (id.includes('framer-motion')) {
            return 'framer';
          }
          // styled-components
          if (id.includes('styled-components')) {
            return 'styled';
          }
          // Three.js core — unavoidably large, isolated chunk
          if (id.includes('node_modules/three/')) {
            return 'three-core';
          }
          // React Three Fiber + Drei — lazy loaded with Canvas
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'three-react';
          }
          // react-icons — only used in Hero social links
          if (id.includes('react-icons')) {
            return 'icons';
          }
          // Markdown rendering — only on blog post page
          if (id.includes('react-markdown') || id.includes('gray-matter') || id.includes('remark') || id.includes('rehype') || id.includes('unified') || id.includes('micromark')) {
            return 'markdown';
          }
        },
      },
    },
  },
})