import { createRouter, createWebHistory } from 'vue-router'
import Landing from './components/Landing.vue'
import Develop from './components/Develop.vue'
import ReleaseNote from './components/ReleaseNote.vue'
import Feedback from './components/Feedback.vue'
import Privacy from './components/Privacy.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/develop',
    name: 'Develop',
    component: Develop
  },
  {
    path: '/release',
    name: 'ReleaseNote',
    component: ReleaseNote
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  beforeEach: (to, from, next) => {
    if (to.path === '/manifest.json') {
      return next(false)
    }
    next()
  }
})

export default router
