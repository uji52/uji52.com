import vue from '@vitejs/plugin-vue'
const path = require('path')

export default {
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: '../dist'
  },
  server: {
    port: 8080
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}
