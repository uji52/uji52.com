import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '/assets/scss/styles.scss'
// import * as bootstrap from 'bootstrap' // サイズを気にせずBootstrap全体をimportする場合
// import { Tooltip, Toast, Popover } from 'bootstrap';

const app = createApp(App)
app.use(router)
app.mount('#app')
