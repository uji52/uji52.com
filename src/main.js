import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Amplify } from 'aws-amplify'
import { userPoolId, clientId , identityPoolId} from '@/utils/env'

import '/assets/scss/styles.scss'

Amplify.configure({
  Auth: {
    Cognito: {
      region: 'ap-northeast-1',
      userPoolId: userPoolId,
      userPoolClientId: clientId,
      identityPoolId: identityPoolId,
    }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
