import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: [
      'wagmi', 
      'viem', 
      'wagmi/connectors',
      '@worldcoin/minikit-react',
      '@worldcoin/minikit-js'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  esbuild: {
    target: 'es2020'
  },
  resolve: {
    dedupe: ['wagmi', 'viem', '@worldcoin/minikit-react', '@worldcoin/minikit-js'],
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: 'util',
    }
  }
})
