// vite.config.js
import { execFileSync } from 'node:child_process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { blogIndexPlugin } from './scripts/lib/blogIndexPlugin.mjs'
import { parseRuntimeConfig } from './src/lib/runtimeConfig.js'
import { REFERRER_POLICY, contentSecurityPolicy, inlineScripts } from './scripts/lib/securityPolicy.mjs'

// The commit a build came from. The live smoke compares it with the commit it
// expects production to serve (scripts/smoke-live.mjs).
const buildCommit = () => {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return 'unknown'
  }
}

const stampBuildCommit = () => ({
  name: 'stamp-build-commit',
  apply: 'build',
  transformIndexHtml: () => [{ tag: 'meta', attrs: { name: 'build-commit', content: buildCommit() }, injectTo: 'head' }],
})

// Placed right after <meta charset> so the policy governs the inline GitHub
// Pages redirect script that follows; built after Vite's own transforms so its
// hashes see the final HTML.
const securityPolicy = (runtimeConfig) => ({
  name: 'security-policy',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: html => {
      const policy = contentSecurityPolicy(runtimeConfig, inlineScripts(html))
      const tags = `\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />\n    <meta name="referrer" content="${REFERRER_POLICY}" />`
      if (!/<meta charset="[^"]*"\s*\/?>/i.test(html) || policy.includes('"')) throw new Error('Cannot place the Content-Security-Policy in index.html')
      return html.replace(/<meta charset="[^"]*"\s*\/?>/i, match => match + tags)
    },
  },
})

export default defineConfig(({ command, mode }) => {
  // Validate the same VITE_* values Vite inlines: a malformed value fails the
  // production build instead of silently disabling a feature.
  const runtimeConfig = parseRuntimeConfig(loadEnv(mode, process.cwd(), 'VITE_'))
  if (runtimeConfig.errors.length) {
    const message = `Invalid configuration:\n  - ${runtimeConfig.errors.join('\n  - ')}`
    if (command === 'build') throw new Error(message)
    console.warn(message)
  }
  return {
    plugins: [
      react(),
      blogIndexPlugin({ blogsDir: fileURLToPath(new URL('./src/blogs', import.meta.url)) }),
      stampBuildCommit(),
      securityPolicy(runtimeConfig),
    ],
    base: '/',
    test: {
      include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.{js,mjs}'],
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      css: true,
      maxWorkers: 2,
      // Rendering full styled-components trees in jsdom routinely takes seconds;
      // the 5s default flakes on loaded machines.
      testTimeout: 15000,
      // Keep tests hermetic: force Supabase "unconfigured" so nothing hits the
      // network, regardless of whether a local .env exists.
      env: {
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_ANON_KEY: '',
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{js,jsx}', 'scripts/lib/*.mjs'],
        thresholds: {
          statements: 95,
          branches: 90,
          functions: 95,
          lines: 95,
        },
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
            // supabase-js — imported on demand for view counts and the dashboard
            if (id.includes('@supabase/')) {
              return 'supabase';
            }
          },
        },
      },
    },
  }
})
