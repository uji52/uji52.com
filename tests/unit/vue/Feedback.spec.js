import { mount } from '@vue/test-utils'
import Feedback from '@/components/Feedback.vue'

jest.mock('bootstrap', () => {
  return {
    Toast: jest.fn().mockImplementation(() => {
      return {
        show: jest.fn(),
      }
    }),
  }
})

const TEST_MESSAGE = 'test message';
const TEST_ACCESS_KEY = 'mocked-access-key';
const TEST_SECRET_ACCESS_KEY = 'mocked-secret-access-key';
const TEST_SESSION_TOKEN = 'mocked-session-token';
const TEST_AUTHORIZATION_HEADER = 'AWS4-HMAC-SHA256 ...';

const TEST_SESSION = {
  credentials: {
    accessKeyId: TEST_ACCESS_KEY,
    secretAccessKey: TEST_SECRET_ACCESS_KEY,
    sessionToken: TEST_SESSION_TOKEN,
  },
  userSub: 'test-sub',
}

jest.mock('@/utils/env', () => ({
  apiHost: "api-dev.uji52.com",
}))

jest.mock('@/utils/auth', () => ({
  getSession: jest.fn(() => Promise.resolve(TEST_SESSION)),
}))

jest.mock('@aws-sdk/signature-v4', () => ({
  SignatureV4: jest.fn().mockImplementation(() => ({
    sign: jest.fn(async (req) => ({
      ...req,
      headers: {
        ...req.headers,
        Authorization: TEST_AUTHORIZATION_HEADER,
        'X-Amz-Security-Token': TEST_SESSION_TOKEN,
      },
    })),
  })),
}))

jest.mock('@aws-crypto/sha256-js', () => ({
  Sha256: jest.fn(),
}))

jest.mock('@aws-sdk/protocol-http', () => ({
  HttpRequest: jest.fn().mockImplementation((args) => args),
}))

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  })
)

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
  })

  afterEach(() => {
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('renders Feedback page', async () => {
    expect(wrapper.text()).toContain('機能要望等')
  })

  it('submits feedback successfully', async () => {
    await wrapper.find('#message').setValue(TEST_MESSAGE)
    await wrapper.find('form').trigger('submit.prevent')

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api-dev.uji52.com/email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TEST_AUTHORIZATION_HEADER,
          'X-Amz-Security-Token': TEST_SESSION_TOKEN,
          host: 'api-dev.uji52.com',
        },
        body: JSON.stringify({
          message: TEST_MESSAGE,
          sub: 'test-sub',
        })
      }
    )
    const { getSession } = require('@/utils/auth')
    expect(getSession).toHaveBeenCalled()
    expect(document.getElementById('mailToastSubject').textContent).toBe('ご要望を送付しました。')
  })
})
