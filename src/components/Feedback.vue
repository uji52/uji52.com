<template>
  <div class="developer-page">
    <section name="head" class="section section-shaped section-lg my-0">
      <div class="shape shape-style-1 shape-default shape-skew"></div>
      <div class="container shifted">
        <h1 class="display-5 fw-bold text-body-emphasis text-center">
          機能要望等
        </h1>
      </div>
    </section>
    <section name="head" class="section section-shaped section-lg my-0">
      <div class="shape shape-style-1 shape-default shape-skew"></div>
      <div class="container shifted">
        <form @submit.prevent="submitFeedback" class="feedback-form">
          <div class="form-group">
            <label for="name" class="col-md-6 mb-6">(任意)Name</label>
            <input type="text" id="name" v-model="name" class="col-md-3 mb-3" />
          </div>
          <div class="form-group">
            <label for="email" class="col-md-6 mb-6">(任意)Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="col-md-3 mb-3"
            />
          </div>
          <div class="form-group">
            <label for="message" class="col-md-6 mb-6">(必須)Message</label>
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
import { apiUrl } from '@/utils/env'

const name = ref('')
const email = ref('')
const message = ref('')

const submitFeedback = async () => {
  const response = await fetch(apiUrl + '/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      message: message.value
    })
  })

  const mailToast = document.getElementById('mailToast')
  const mailToastSubject = document.getElementById('mailToastSubject')
  const mailToastMessage = document.getElementById('mailToastMessage')
  const toastBootstrap = new Toast(mailToast)

  if (response.ok) {
    toastBootstrap.show()
  } else {
    mailToastSubject.textContent = 'ご要望の送付に失敗しました。'
    mailToastMessage.innerHTML =
      '<p>申し訳ないですが</p><p>一旦要望の送付は諦めてください。</p>'
    toastBootstrap.show()
  }
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
