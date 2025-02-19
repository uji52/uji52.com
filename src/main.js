import { createApp } from 'vue'
import App from './App.vue'

import '/assets/scss/styles.scss'
// import * as bootstrap from 'bootstrap' // サイズを気にせずBootstrap全体をimportする場合
import { Tooltip, Toast, Popover } from 'bootstrap';

createApp(App).mount('#app')

