import { mount } from '@vue/test-utils'
import Feedback from '@/components/Feedback.vue'

jest.mock('@/utils/env', () => ({
  apiUrl: 'https://api-dev.uji52.com',
}))

jest.mock('bootstrap', () => {
  return {
    Toast: jest.fn().mockImplementation(() => {
      return {
        show: jest.fn(),
      }
    }),
  }
})

const MOCKED_TOKEN = 'mocked-token';
// const TEST_MESSAGE = 'test message';

jest.mock('@/utils/auth', () => ({
  getIdToken: jest.fn(() => Promise.resolve(MOCKED_TOKEN)),
}))

// Amplify APIのモック
const mockApiPost = jest.fn()
jest.mock('aws-amplify', () => ({
  API: {
    post: (...args) => mockApiPost(...args),
  },
}))

describe('Feedback.vue', () => {
  let wrapper

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mailToast" class="toast">
        <div class="toast-header">
          <strong id="mailToastSubject" class="me-auto">ご要望を送付しました。</strong>
          <small>now</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div id="mailToastMessage" class="toast-body"></div>
      </div>
    `
    wrapper = mount(Feedback, {})
    mockApiPost.mockReset()
  })

  afterEach(() => {
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('renders Feedback page', async () => {
    expect(wrapper.text()).toContain('機能要望等')
  })
  /*
  it('submits feedback successfully', async () => {
    mockApiPost.mockResolvedValue({}) // 成功レスポンス

    await wrapper.find('#message').setValue(TEST_MESSAGE)
    await wrapper.find('form').trigger('submit.prevent')

    expect(mockApiPost).toHaveBeenCalledWith(
      'https://api-dev.uji52.com',
      '/email',
      expect.objectContaining({
        body: {
          message: TEST_MESSAGE,
        },
      })
    )
    expect(document.getElementById('mailToastSubject').textContent).toBe('ご要望を送付しました。')
  })

  it('handles feedback submission failure', async () => {
    await wrapper.find('#message').setValue(TEST_MESSAGE)
    await wrapper.find('form').trigger('submit.prevent')

    expect(mockApiPost).toHaveBeenCalledWith(
      'https://api-dev.uji52.com',
      '/email',
      expect.objectContaining({
        body: {
          message: TEST_MESSAGE,
        },
      })
    )
    expect(document.getElementById('mailToastSubject').textContent).toBe('ご要望の送付に失敗しました。')
  })
  */
})
