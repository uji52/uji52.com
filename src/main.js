import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '/assets/scss/styles.scss'
// import { Tooltip, Toast, Popover } from 'bootstrap'; // 必要に応じて有効化

const app = createApp(App)
app.use(router)
app.mount('#app')
