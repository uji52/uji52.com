import { createApp } from 'vue'
import router from '@/router'

// モックアプリケーションインスタンス
const mockApp = {
  use: jest.fn(),
  mount: jest.fn()
}

// createAppのモック
jest.mock('vue', () => ({
  createApp: jest.fn(() => mockApp)
}))

// routerのモック
jest.mock('@/router', () => ({
  __esModule: true,
  default: {}
}))

describe('main.js', () => {
  beforeEach(() => {
    // テストごとにモックをリセット
    jest.clearAllMocks()

    // main.jsを各テストの前に実行
    jest.isolateModules(() => {
      require('@/main.js')
    })
  })

  it('creates Vue application with App component', () => {
    // createAppが呼び出されたことを確認
    expect(createApp).toHaveBeenCalled()
    // 引数の型とプロパティを確認
    const calledArg = createApp.mock.calls[0][0]
    expect(calledArg.__name).toBe('App')
    expect(typeof calledArg.render).toBe('function')
    expect(typeof calledArg.setup).toBe('function')
  })

  it('uses router plugin', () => {
    expect(mockApp.use).toHaveBeenCalledWith(router)
  })

  it('mounts app to #app element', () => {
    expect(mockApp.mount).toHaveBeenCalledWith('#app')
  })
})
