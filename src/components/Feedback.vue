<template>
  <div class="developer-page">
    <section name="head" class="section section-shaped section-lg my-0">
      <div class="shape shape-style-1 shape-default shape-skew"></div>
      <div class="container shifted">
        <h1 class="display-5 fw-bold text-body-emphasis text-center">
          機能要望等
        </h1>
        <h2 class="display-7 fw-bold text-body-emphasis text-center">
          サインインの上、要望を送信してください
        </h2>
      </div>
    </section>
    <section name="head" class="section section-shaped section-lg my-0">
      <div class="shape shape-style-1 shape-default shape-skew"></div>
      <div class="container shifted">
        <form @submit.prevent="submitFeedback" class="feedback-form">
          <div class="form-group">
            <label for="message" class="col-md-6 mb-6">Message</label>
            <textarea
              id="message"
              v-model="message"
              required
              class="col-md-3 mb-3"
            ></textarea>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-success">Submit</button>
          </div>
        </form>
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
          <div
            id="mailToast"
            class="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div class="toast-header">
              <strong id="mailToastSubject" class="me-auto"
                >ご要望を送付しました。</strong
              >
              <small>now</small>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div id="mailToastMessage" class="toast-body">
              <p>対応するかわからないですが</p>
              <p>要望ありがとうございます。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Toast } from 'bootstrap'
import { apiHost } from '@/utils/env'
import { getSession } from '@/utils/auth'

import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Sha256 } from '@aws-crypto/sha256-js'
import { HttpRequest } from '@aws-sdk/protocol-http'

const message = ref('')

const submitFeedback = async () => {

  const path = '/email'
  const method = 'POST'
  const region = 'ap-northeast-1'
  const session = await getSession()
  if (!session || !session.credentials) {
    errorToast("サインインの上、再度お試しください。")
    return
  }

  const body = JSON.stringify({
    message: message.value,
    user: JSON.stringify(session.user),
  })

  alert(JSON.stringify(session))
  console.log(JSON.stringify(session))

  const request = new HttpRequest({
    protocol: 'https:',
    hostname: apiHost,
    method,
    path,
    headers: {
      'Content-Type': 'application/json',
      host: apiHost
    },
    body
  })

  const signer = new SignatureV4({
    credentials: {
      accessKeyId: session.credentials.accessKeyId,
      secretAccessKey: session.credentials.secretAccessKey,
      sessionToken: session.credentials.sessionToken,
    },
    region,
    service: 'execute-api',
    sha256: Sha256
  })

  const signed = await signer.sign(request)

  // fetch用ヘッダー変換
  const headers = {}
  for (const [k, v] of Object.entries(signed.headers)) {
    headers[k] = v
  }

  const response = await fetch(`https://${apiHost}${path}`, {
    method,
    headers,
    body
  })

  const mailToast = document.getElementById('mailToast')
  const toastBootstrap = new Toast(mailToast)

  if (response.ok) {
    // 成功時の処理があれば追加
  } else {
    errorToast()
  }
  toastBootstrap.show()
}

const errorToast = (message) => {
  const mailToastSubject = document.getElementById('mailToastSubject')
  const mailToastMessage = document.getElementById('mailToastMessage')
  mailToastSubject.textContent = 'ご要望の送付に失敗しました。'
  mailToastMessage.innerHTML =
    '<p>申し訳ないですが</p><p>一旦要望の送付は諦めてください。</p>' + (message ? `<p>${message}</p>` : '')
}
</script>

<style scoped>
.feedback-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #525252;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 1rem;
}

.form-group label {
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.form-group button {
  align-self: center;
}
</style>
