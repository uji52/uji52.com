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

describe('Feedback.vue', () => {
  let wrapper

  beforeEach(() => {
    // テスト用のDOM要素を追加
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
  })

  afterEach(() => {
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('renders Feedback page', async () => {
    expect(wrapper.text()).toContain('機能要望等')
  })

  it('submits feedback successfully', async () => {
    // fetch関数をモック
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    )

    // フォームの入力を設定
    await wrapper.find('#name').setValue('Test User')
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#message').setValue('This is a test message.')

    // フォームを送信
    await wrapper.find('form').trigger('submit.prevent')

    // fetch関数が呼び出されたことを確認
    expect(global.fetch).toHaveBeenCalledWith('https://api-dev.uji52.com/email', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message.',
      }),
    }))

    // 成功時のトーストメッセージが表示されることを確認
    expect(document.getElementById('mailToastSubject').textContent).toBe('ご要望を送付しました。')
  })

  it('handles feedback submission failure', async () => {
    // fetch関数をモック
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    )

    // フォームの入力を設定
    await wrapper.find('#name').setValue('Test User')
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#message').setValue('This is a test message.')

    // フォームを送信
    await wrapper.find('form').trigger('submit.prevent')

    // fetch関数が呼び出されたことを確認
    expect(global.fetch).toHaveBeenCalledWith('https://api-dev.uji52.com/email', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message.',
      }),
    }))

    // 失敗時のトーストメッセージが表示されることを確認
    expect(document.getElementById('mailToastSubject').textContent).toBe('ご要望を送付に失敗しました。')
  })
})
