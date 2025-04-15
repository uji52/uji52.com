import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Header from '@/components/Header.vue'
import * as auth from '@/utils/auth'

// Auth utilsのモック
jest.mock('@/utils/auth', () => ({
  handleSignup: jest.fn(),
  handleConfirmSignUp: jest.fn(),
  handleSignin: jest.fn(),
  resendConfirmationCode: jest.fn(),
  handleSignout: jest.fn(),
  checkCurrentUser: jest.fn(),
  completeNewPassword: jest.fn(),
  handleDeleteAccount: jest.fn()
}))

// Bootstrap Modalのモック
class MockModal {
  constructor(element) {
    this.element = element
    this._element = element
    this._config = { backdrop: true }
    this._backdrop = { show: jest.fn(), hide: jest.fn() }
    this.show = jest.fn()
    this.hide = jest.fn()
  }
}

jest.mock('bootstrap/js/dist/modal', () => ({
  default: MockModal
}))

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
    // DOM要素の準備
    document.body.innerHTML = `
      <div id="authModal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content"></div>
        </div>
      </div>
    `

    wrapper = mount(Header, {
      global: {
        plugins: [router],
      }
    })
    await router.isReady()
  })

  afterEach(() => {
    wrapper.unmount()
    document.body.innerHTML = ''
    jest.clearAllMocks()
  })

  it('renders navigation links correctly', () => {
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(5) // Icon + 4 navigation links

    const navItems = ['Home', 'Develop', 'ReleaseNote', 'Request']
    navItems.forEach(item => {
      const link = links.find(el => el.text() === item)
      expect(link).toBeTruthy()
    })
  })

  it('shows signin/signup buttons when not authenticated', () => {
    const signinButton = wrapper.find('button[type="button"]', {
      text: 'Signin'
    })
    const signupButton = wrapper.find('button[type="button"]', {
      text: 'Signup'
    })

    expect(signinButton.exists()).toBe(true)
    expect(signupButton.exists()).toBe(true)
  })

  it('shows user dropdown when authenticated', async () => {
    // ユーザー認証状態をモック
    auth.checkCurrentUser.mockResolvedValue({
      signInDetails: { loginId: 'testuser' }
    })

    await wrapper.vm.checkAuthState()
    await nextTick()

    const dropdown = wrapper.find('.dropdown')
    expect(dropdown.exists()).toBe(true)
    expect(wrapper.find('.dropdown span').text()).toBe('testuser')
  })

  it('handles signin process', async () => {
    // サインイン成功のモック
    auth.handleSignin.mockResolvedValue({ user: { username: 'testuser' } })

    wrapper.vm.loginForm = {
      username: 'testuser',
      password: 'password123'
    }

    await wrapper.vm.onSignin()

    expect(auth.handleSignin).toHaveBeenCalledWith('testuser', 'password123')
    expect(wrapper.vm.errorMessage).toBe('')
  })

  it('handles signup process', async () => {
    // サインアップ成功のモック
    auth.handleSignup.mockResolvedValue({ user: { username: 'newuser' } })

    wrapper.vm.loginForm = {
      username: 'newuser',
      email: 'test@example.com',
      password: 'password123'
    }

    await wrapper.vm.onSignup()

    expect(auth.handleSignup).toHaveBeenCalledWith('newuser', 'test@example.com', 'password123')
    expect(wrapper.vm.showVerificationForm).toBe(true)
  })

  it('handles signout process', async () => {
    await wrapper.vm.onSignout()
    expect(auth.handleSignout).toHaveBeenCalled()
    expect(wrapper.vm.isAuthenticated).toBe(false)
    expect(wrapper.vm.username).toBe('')
  })

  it('handles verify code process', async () => {
    wrapper.vm.loginForm = {
      username: 'newuser',
    }
    wrapper.vm.verificationCode = '123456'
    await wrapper.vm.onVerifyCode()
    expect(auth.handleConfirmSignUp).toHaveBeenCalled()
  })

  it('handles navigation highlighting', async () => {
    // Home
    await router.push('/')
    await nextTick()
    expect(wrapper.find('#linkLanding').classes()).toContain('link-secondary')

    // Develop
    await router.push('/develop')
    await nextTick()
    expect(wrapper.find('#linkDevelop').classes()).toContain('link-secondary')
  })

  it('handles delete account confirmation', async () => {
    // window.confirm のモック
    const confirmSpy = jest.spyOn(window, 'confirm')
    confirmSpy.mockReturnValue(true)

    await wrapper.vm.confirmDeleteAccount()

    expect(confirmSpy).toHaveBeenCalled()
    expect(auth.handleDeleteAccount).toHaveBeenCalled()
    expect(wrapper.vm.isAuthenticated).toBe(false)

    confirmSpy.mockRestore()
  })


  it('displays error message on failed signin', async () => {
    auth.handleSignin.mockRejectedValue(new Error('Invalid credentials'))
    wrapper.vm.loginForm = {
      username: 'wronguser',
      password: 'wrongpass'
    }
    await wrapper.vm.onSignin()
    expect(wrapper.vm.errorMessage).toBe('サインインに失敗しました')
  })

  it('displays error message on failed signup', async () => {
    auth.handleSignup.mockRejectedValue(new Error('Signup failed'))
    wrapper.vm.loginForm = {
      username: 'failuser',
      email: 'fail@example.com',
      password: 'failpass'
    }
    await wrapper.vm.onSignup()
    expect(wrapper.vm.errorMessage).toBe('サインアップに失敗しました')
  })

  it('shows verification form after successful signup', async () => {
    auth.handleSignup.mockResolvedValue({ user: { username: 'verifyuser' } })
    wrapper.vm.loginForm = {
      username: 'verifyuser',
      email: 'verify@example.com',
      password: 'verify123'
    }
    await wrapper.vm.onSignup()
    expect(wrapper.vm.showVerificationForm).toBe(true)
  })

})
