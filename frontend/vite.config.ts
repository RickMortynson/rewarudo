import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'

const rootDir = path.resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window',
    'process.env': {}
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(rootDir, 'src/')
      }
    ]
  }
})
