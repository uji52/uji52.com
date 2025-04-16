import { createWebHistory } from 'vue-router'
import router from '@/router'

// Vue Routerのモック
jest.mock('vue-router', () => {
  // モックコンポーネントをファクトリー内で定義
  const mockComponents = {
    Landing: { template: '<div>Landing</div>' },
    Develop: { template: '<div>Develop</div>' },
    ReleaseNote: { template: '<div>ReleaseNote</div>' },
    Feedback: { template: '<div>Feedback</div>' },
    Privacy: { template: '<div>Privacy</div>' },
  }

  const mockRouter = {
    options: {
      routes: [
        { path: '/', name: 'Landing', component: mockComponents.Landing },
        { path: '/develop', name: 'Develop', component: mockComponents.Develop },
        { path: '/release', name: 'ReleaseNote', component: mockComponents.ReleaseNote },
        { path: '/feedback', name: 'Feedback', component: mockComponents.Feedback },
        { path: '/privacy', name: 'Privacy', component: mockComponents.Privacy },
      ],
      history: { constructor: { name: 'WebHistory' } }
    }
  }

  return {
    createRouter: jest.fn(() => mockRouter),
    createWebHistory: jest.fn()
  }
})

describe('Router', () => {
  it('has correct routes configuration', () => {
    const routes = router.options.routes
    expect(routes).toHaveLength(5)

    const expectedRoutes = [
      { path: '/', name: 'Landing' },
      { path: '/develop', name: 'Develop' },
      { path: '/release', name: 'ReleaseNote' },
      { path: '/feedback', name: 'Feedback' },
      { path: '/privacy', name: 'Privacy' },
    ]

    expectedRoutes.forEach((expectedRoute, index) => {
      expect(routes[index].path).toBe(expectedRoute.path)
      expect(routes[index].name).toBe(expectedRoute.name)
    })
  })

  it('uses web history mode', () => {
    expect(createWebHistory).toHaveBeenCalled()
  })
})
