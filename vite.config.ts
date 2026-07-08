import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/rangoli/",
  plugins: [react()],
  server:{
    allowedHosts:['9cb0-2406-8800-9014-2ca1-b4c5-ce53-f7f-8b00.ngrok-free.app']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
