<template>
  <div class="container">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom"
    >
      <nav>
        <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <router-link id="linkTop" to="/" class="nav-link px-2">
              <svg
                class="bi"
                width="32"
                height="32"
                role="img"
                aria-label="Icon"
              >
                <use xlink:href="#icon"></use>
              </svg>
            </router-link>
          </li>
          <li>
            <router-link
              id="linkLanding"
              to="/"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/' }"
              >Home</router-link
            >
          </li>
          <li>
            <router-link
              id="linkDevelop"
              to="/develop"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/develop' }"
              >Develop</router-link
            >
          </li>
          <li>
            <router-link
              id="linkRelease"
              to="/release"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/release' }"
              >ReleaseNote</router-link
            >
          </li>
          <li>
            <router-link
              id="linkFeedback"
              to="/feedback"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/feedback' }"
              >Request</router-link
            >
          </li>
        </ul>
      </nav>
      <template v-if="isAuthenticated">
        <div class="dropdown text-end">
          <a
            href="#"
            class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span class="me-2">{{ username }}</span>
          </a>
          <ul class="dropdown-menu text-small" style="">
            <li><a class="dropdown-item" @click="onSignout">Signout</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item danger" @click="confirmDeleteAccount"
                >Delete Account</a
              >
            </li>
          </ul>
        </div>
      </template>
      <template v-if="!isAuthenticated">
        <div class="mb-3">
          <button
            type="button"
            class="btn btn-outline-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#authModal"
            :class="{ active: !isSignup }"
            @click="isSignup = false"
          >
            Signin
          </button>
          <button
            type="button"
            class="btn btn-outline-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#authModal"
            :class="{ active: isSignup }"
            @click="isSignup = true"
          >
            Signup
          </button>
        </div>
      </template>
    </header>
  </div>

  <div
    class="modal fade"
    id="authModal"
    tabindex="-1"
    aria-labelledby="authModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="authModalLabel">
            {{ isSignup ? 'Signup' : 'Signin' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <template v-if="requiresNewPassword">
            <div class="mb-3">
              <h5>新しいパスワードを設定してください</h5>
              <input
                type="password"
                v-model="newPassword"
                placeholder="新しいパスワード"
                class="form-control mb-2"
              />
              <button
                type="button"
                class="btn btn-primary"
                @click="onCompleteNewPassword"
              >
                パスワードを設定
              </button>
            </div>
          </template>
          <template v-else-if="showVerificationForm">
            <input
              type="text"
              v-model="verificationCode"
              placeholder="Verification Code"
              class="form-control mb-2"
            />
            <button
              type="button"
              class="btn btn-primary me-2"
              @click="onVerifyCode"
            >
              Verify Code
            </button>
          </template>
          <template v-else>
            <div class="mb-3">
              <input
                type="text"
                v-model="loginForm.username"
                placeholder="username"
                class="form-control mb-2"
              />
              <input
                v-if="isSignup"
                type="email"
                v-model="loginForm.email"
                placeholder="Email"
                class="form-control mb-2"
              />
              <input
                type="password"
                v-model="loginForm.password"
                placeholder="Password"
                class="form-control mb-2"
              />
            </div>
          </template>
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            v-if="!requiresNewPassword && !showVerificationForm"
            type="button"
            class="btn btn-primary"
            @click="isSignup ? onSignup() : onSignin()"
          >
            {{ isSignup ? 'Signup now' : 'Signin now' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
    <symbol id="icon" viewBox="0 0 64 64">
      <path
        fill="#888888"
        stroke="#444444"
        d="M 10 4 L 32 4 Q 40 10 32 16 L 16 16 L 16 16 L 16 20 L 16 24 C 28 28 36 32 36 44 C 36 56 28 60 16 60 L 8 60 Q 0 56 8 48 L 16 48 C 20 48 24 48 24 42 C 24 36 20 34 16 34 L 10 34 L 4 30 L 4 10 Z M 56 60 L 28 60 L 24 56 L 24 48 L 48 20 C 52 16 50 14 44 14 C 38 14 40 20 40 20 Q 34 28 28 20 C 28 12 36 4 44 4 C 52 4 60 12 60 20 L 59 22 L 38 48 L 56 48 Q 64 54 56 60 Z"
      ></path>
    </symbol>
  </svg>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import {
  handleSignup,
  handleConfirmSignUp,
  handleSignin,
  resendConfirmationCode,
  handleSignout,
  checkCurrentUser,
  completeNewPassword,
  handleDeleteAccount
} from '../utils/auth'

const isAuthenticated = ref(false)
const username = ref('')
const loginForm = ref({
  username: '',
  email: '',
  password: ''
})
const requiresNewPassword = ref(false)
const newPassword = ref('')
const tempUser = ref(null)
const isSignup = ref(false)
const errorMessage = ref('')
const showVerificationForm = ref(false)
const verificationCode = ref('')
const unverifiedUser = ref(null)
const authModal = ref(null)

const onSignup = async () => {
  try {
    errorMessage.value = ''
    const result = await handleSignup(
      loginForm.value.username,
      loginForm.value.email,
      loginForm.value.password
    )
    unverifiedUser.value = result.user
    showVerificationForm.value = true
  } catch (error) {
    errorMessage.value = 'サインアップに失敗しました'
  }
}

const onVerifyCode = async () => {
  try {
    await handleConfirmSignUp(
      loginForm.value.username || loginForm.value.email,
      verificationCode.value
    )
    showVerificationForm.value = false
    await onSignin()
  } catch (error) {
    errorMessage.value = '認証コードの確認に失敗しました'
  }
}

const onSignin = async () => {
  try {
    errorMessage.value = ''
    const result = await handleSignin(
      loginForm.value.username,
      loginForm.value.password
    )
    if (result.requiresNewPassword) {
      requiresNewPassword.value = true
      tempUser.value = result.user
    } else if (
      result.user &&
      result.user.nextStep &&
      result.user.nextStep.signInStep == 'CONFIRM_SIGN_UP'
    ) {
      showVerificationForm.value = true
      unverifiedUser.value = result.user
      await resendConfirmationCode(loginForm.value.username)
    } else {
      await checkAuthState()
      await onSigninSuccess()
    }
  } catch (error) {
    errorMessage.value = 'サインインに失敗しました'
  }
}

const onSigninSuccess = async () => {
  await checkAuthState()
  if (authModal.value) {
    authModal.value.hide()
  }
}

const onCompleteNewPassword = async () => {
  try {
    if (!newPassword.value) {
      errorMessage.value = '新しいパスワードを入力してください'
      return
    }
    await completeNewPassword(tempUser.value, newPassword.value)
    requiresNewPassword.value = false
    await checkAuthState()
  } catch (error) {
    errorMessage.value = 'パスワードの設定に失敗しました'
  }
}

const onSignout = async () => {
  try {
    await handleSignout()
    isAuthenticated.value = false
    username.value = ''
  } catch (error) {
    errorMessage.value = '信じられないですが、ログアウトに失敗しました'
  }
}

const checkAuthState = async () => {
  const user = await checkCurrentUser()
  if (user) {
    isAuthenticated.value = true
    username.value = user.signInDetails.loginId
  }
}

const confirmDeleteAccount = async () => {
  if (
    confirm('アカウントを削除してもよろしいですか？この操作は取り消せません。')
  ) {
    try {
      await handleDeleteAccount()
      isAuthenticated.value = false
      username.value = ''
      // ユーザー情報をクリア
      loginForm.value = {
        username: '',
        email: '',
        password: ''
      }
    } catch (error) {
      errorMessage.value = 'アカウントの削除に失敗しました'
    }
  }
}

onMounted(() => {
  checkAuthState()
  const modalElement = document.getElementById('authModal')
  authModal.value = new Modal(modalElement)
  modalElement.addEventListener('hide.bs.modal', () => {
    errorMessage.value = '' // エラーメッセージをクリア
    if (!isAuthenticated.value) {
      showVerificationForm.value = false
      requiresNewPassword.value = false
    }
  })
})
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
.bi {
  fill: currentColor;
  vertical-align: text-bottom;
}
.login-form {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  z-index: 1000;
  width: 300px;
}
.btn-link.active {
  text-decoration: underline;
  color: var(--bs-primary);
}
.danger {
  color: #dc3545;
}
.modal-content {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
}
.modal-header {
  border-bottom: 1px solid var(--bs-border-color);
}
.modal-footer {
  border-top: 1px solid var(--bs-border-color);
}
</style>
