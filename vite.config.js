import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
const path = require('path')

export default {
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: '../dist'
  },
  server: {
    port: 8080
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'uji52.com',
        short_name: 'uji52',
        description: '趣味プログラミング',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'src/assets/img/favicon.ico',
            sizes: '192x192',
            type: 'image/x-icon'
          },
          {
            src: 'src/assets/img/favicon.ico',
            sizes: '512x512',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}
