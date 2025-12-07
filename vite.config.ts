import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Removed explicit define for process.env to allow index.html polyfill 
  // to serve as the fallback for global process access.
})