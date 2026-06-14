// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Raise warning threshold since three.js is inherently large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
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
          // GSAP — not critical, defer
          if (id.includes('gsap')) {
            return 'gsap';
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
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'styled-components'],
    // Exclude heavy 3D libs from pre-bundling — they're loaded lazily
    exclude: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
})