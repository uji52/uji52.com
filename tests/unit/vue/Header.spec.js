import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Header from '@/components/Header.vue'

// ルーターの設定
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
    { path: '/develop', name: 'Develop', component: { template: '<div>Develop</div>' } },
    { path: '/release', name: 'ReleaseNote', component: { template: '<div>ReleaseNote</div>' } },
    { path: '/feedback', name: 'Request', component: { template: '<div>Request</div>' } }
  ]
})

describe('Header.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(Header, {
      global: {
        plugins: [router]
      }
    })
    await router.isReady()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders header with navigation links', () => {
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(5) // アイコン + 4つのナビゲーションリンク
  })

  it('shows icon in the first link', () => {
    const iconLink = wrapper.find('a[id="linkTop"]')
    const svg = iconLink.find('svg.bi')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('32')
    expect(svg.attributes('height')).toBe('32')
  })

  it('highlights current route', async () => {
    // Home ページへ遷移
    await router.push('/')
    await nextTick()
    expect(wrapper.find('a[id="linkLanding"]').classes()).toContain('link-secondary')

    // Develop ページへ遷移
    await router.push('/develop')
    await nextTick()
    expect(wrapper.find('a[id="linkDevelop"]').classes()).toContain('link-secondary')
  })

  it('contains all navigation items', () => {
    const navItems = ['Home', 'Develop', 'ReleaseNote', 'Request']
    const links = wrapper.findAll('a')

    navItems.forEach(item => {
      const link = links.find(link => link.text() === item)
      expect(link).toBeTruthy()
    })
  })
})
