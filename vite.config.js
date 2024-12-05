import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({

  server: {
    proxy: {
      "/api": {
        // target: "https://api.apis.net.pe",
        // target: "http://localhost/",
        // target: "https://api-cotizador.escacorpnube.com.pe/",
        target: "https://escalabs.com/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

