import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  copyPublicDir: false,
  plugins: [react({ jsxRuntime: 'automatic' })],
  build: {
    lib: {
      entry: 'src/index.jsx',
      name: 'AnimatedText',
      fileName: (format) => `animated-text.${format}.js`,
    },
    rollupOptions: {
      // Externalize React to avoid bundling it
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  }
})
