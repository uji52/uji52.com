import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/components/Landing.vue'
import Develop from '@/components/Develop.vue'
import ReleaseNote from '@/components/ReleaseNote.vue'
import Feedback from '@/components/Feedback.vue'

// ルーターのモックを作成
const router = createRouter({
  history: createWebHistory(),
  routes: [
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
})

describe('Landing.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Landing, {
      global: {
        plugins: [router]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders welcome message', async () => {
    await router.isReady()
    expect(wrapper.text()).toContain('Welcome to uji52.com')
  })

  it('has develop tools link', async () => {
    await router.isReady()
    const link = wrapper.find('a[id="devToolLink"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('開発ツール')
  })
})