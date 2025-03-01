import { createRouter, createWebHistory } from 'vue-router'
import Landing from './components/Landing.vue'
import Develop from './components/Develop.vue'
import ReleaseNote from './components/ReleaseNote.vue'
import Feedback from './components/Feedback.vue'
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router