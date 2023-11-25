/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
  ],
  envDir: './src/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/') //fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [
      'node_modules'
    ]
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'), // fileURLToPath(new URL('src/main.ts')),
      name: 'async-estimator',
      fileName: (format) => `async-estimator.${format}.js`,
    },
    rollupOptions: {
      external: [], // ['vue']
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          /*vue: 'Vue',*/
        },
      },
    },
  },
})
