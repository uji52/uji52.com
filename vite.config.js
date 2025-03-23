import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { loadEnv } from 'vite'
import { defineConfig } from 'rollup'
const path = require('path')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
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
    publicDir: path.resolve(__dirname, 'public'),
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
              sizes: '48x48',
              type: 'image/x-icon'
            },
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png'
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
    },
    define: {
      'process.env': env
    }
  }
})
