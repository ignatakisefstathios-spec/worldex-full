import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    include: [/node_modules/],
    exclude: [],
    target: 'esnext'
  },
  optimizeDeps: {
    include: [
      '@worldcoin/minikit-react',
      '@worldcoin/minikit-js',
      '@worldcoin/minikit-react/**/*',
      '@worldcoin/minikit-js/**/*'
    ],
    force: true
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/]
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  }
})'
