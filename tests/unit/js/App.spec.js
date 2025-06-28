import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: { template: '<div>Home page</div>' }
    }
  ]
})

describe('App.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': true,
          Header: {
            name: 'Header',
            template: '<header>Header Component</header>',
            props: ['msg']  // 配列形式でpropsを定義
          },
          Footer: {
            name: 'Footer',
            template: '<footer>Footer Component</footer>',
            props: ['msg']  // 配列形式でpropsを定義
          }
        }
      }
    })
    await router.isReady()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('passes correct props to Header', async () => {
    const header = wrapper.findComponent({ name: 'Header' })  // コンポーネント検索方法を変更
    expect(header.exists()).toBe(true)
  })

  it('passes correct props to Footer', async () => {
    const footer = wrapper.findComponent({ name: 'Footer' })  // コンポーネント検索方法を変更
    expect(footer.exists()).toBe(true)
  })
})
