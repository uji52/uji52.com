import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
const path = require('path')

export default {
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html')
      }
    },
    assetsDir: 'assets',
  },
  publicDir: '../public',
  base: '/',
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
            src: '/favicon.ico',
            sizes: '256x256',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        verbose: false,
        warnRuleAsDeprecated: false
      }
    }
  }
}
