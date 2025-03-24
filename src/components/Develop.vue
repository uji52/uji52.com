<template>
  <div class="developer-page">
    <section name="head" class="section section-shaped section-lg my-0">
      <div class="shape shape-style-1 shape-default shape-skew"></div>
      <div class="container shifted">
        <h1 class="display-5 fw-bold text-body-emphasis">Development Tools</h1>
      </div>
    </section>
    <section>
      <div class="container">
        <h2>Base64 Encode</h2>
        <form>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="b64plane">文字列</label>
              <input
                id="b64plane"
                v-model="b64plane"
                class="form-control"
                placeholder="文字列"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="b64hex">Base64(16進数)</label>
              <input
                id="b64hex"
                v-model="b64hex"
                class="form-control"
                placeholder="Base64(16進数)"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="b64strb64">Base64(文字列)</label>
              <input
                id="b64str"
                v-model="b64str"
                class="form-control"
                placeholder="Base64(文字列)"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="b64strb64url">Base64URL(文字列)</label>
              <input
                id="b64urlstr"
                v-model="b64urlstr"
                class="form-control"
                placeholder="Base64URL(文字列)"
              />
            </div>
          </div>
          <p id="b64error">{{ b64error }}</p>
        </form>
        <h2>URL Encode</h2>
        <form>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="urldecode">文字列</label>
              <input
                id="urldecode"
                v-model="urldecode"
                class="form-control"
                placeholder="文字列"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="urlencode">URL Encode</label>
              <input
                id="urlencode"
                v-model="urlencode"
                class="form-control"
                placeholder="URL Encode"
              />
            </div>
          </div>
          <p id="urlError" v-if="urlerror">{{ urlerror }}</p>
        </form>
        <h2>Hash</h2>
        <form>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="hashplain">文字列</label>
              <input
                id="hashplain"
                v-model="hashplain"
                class="form-control"
                placeholder="Plain"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="hashbin">バイナリ列</label>
              <input
                id="hashbin"
                v-model="hashbin"
                class="form-control"
                placeholder="00520052"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="hashsha256">SHA256</label>
              <input
                id="hashsha256"
                v-model="hashsha256"
                class="form-control"
                placeholder="SHA256"
                readonly
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="hashsha256">SHA256(Base64Encoded)</label>
              <input
                id="hashsha256b64"
                v-model="hashsha256b64"
                class="form-control"
                placeholder="SHA256B64"
                readonly
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="hashsha256">SHA256(Base64URLEncoded)</label>
              <input
                id="hashsha256b64url"
                v-model="hashsha256b64url"
                class="form-control"
                placeholder="SHA256B64URL"
                readonly
              />
            </div>
          </div>
          <p id="hasherror">{{ hasherror }}</p>
        </form>
        <h2>Random</h2>
        <form>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="randomseed">ランダムシード</label>
              <input
                id="randomseed"
                v-model="randomseed"
                class="form-control"
                placeholder="ランダムシード"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="randomlength">文字列長</label>
              <input
                id="randomlength"
                number
                v-model="randomlength"
                class="form-control"
                placeholder="文字列長"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <input
                id="randomgenerateButton"
                type="button"
                v-on:click="randomgenerate"
                class="btn btn-success"
                value="生成"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="randomvalue">ランダム値</label>
              <input
                id="randomvalue"
                v-model="randomvalue"
                class="form-control"
                placeholder="ランダム値"
              />
            </div>
          </div>
          <p>{{ randomerror }}</p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CryptoJS from 'crypto-js'

const b64plane = ref('')
const b64hex = ref('')
const b64str = ref('')
const b64urlstr = ref('')
const b64error = ref('')

const urldecode = ref('')
const urlencode = ref('')
const urlerror = ref('')

const hashplain = ref('')
const hashbin = ref('')
const hashsha256 = ref('')
const hashsha256b64 = ref('')
const hashsha256b64url = ref('')
const hasherror = ref('')

const randomseed = ref(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
)
const randomlength = ref(10)
const randomvalue = ref('')
const randomerror = ref('')

// functions
const stringToHex = (str) => {
  return Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const hexToString = (hex) => {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) {
    throw new Error('Invalid hexadecimal string')
  }
  const bytes = new Uint8Array(
    hex.match(/.{2}/g).map((byte) => parseInt(byte, 16))
  )
  return new TextDecoder().decode(bytes)
}

const stringToBase64 = (str) => {
  const utf8Bytes = new TextEncoder().encode(str)
  const base64 = btoa(String.fromCharCode(...utf8Bytes))
  return base64
}

const base64ToString = (base64) => {
  try {
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    )
    const bytes = Uint8Array.from(atob(paddedBase64), (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch (e) {
    throw new Error('Invalid Base64 string')
  }
}

const randomgenerate = () => {
  const array = new Uint8Array(randomlength.value)
  crypto.getRandomValues(array)
  randomvalue.value = ''
  for (let i = 0; i < randomlength.value; i++) {
    const index = array[i] % randomseed.value.length
    randomvalue.value += randomseed.value[index]
  }
}

// watchers
watch(
  () => b64plane.value,
  (newValue) => {
    if (!newValue) {
      b64hex.value = ''
      b64str.value = ''
      b64urlstr.value = ''
      return
    }
    const hexValue = stringToHex(newValue)
    const strValue = stringToBase64(newValue)
    const urlstrValue = strValue
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    b64hex.value = hexValue
    b64str.value = strValue
    b64urlstr.value = urlstrValue
  }
)

watch(
  () => b64hex.value,
  (newValue) => {
    const hexRegex = /^([0-9a-f][0-9a-f])+$/
    if (!hexRegex.test(newValue)) {
      b64plane.value = ''
      b64str.value = ''
      b64error.value = 'その値はBase64エンコードされた16進数ではないです。'
      return
    }
    const b64planeValue = hexToString(newValue)
    b64plane.value = b64planeValue
    b64error.value = ''
  }
)

watch(
  () => b64str.value,
  (newValue) => {
    try {
      b64plane.value = ''
      b64plane.value = base64ToString(newValue)
      b64error.value = ''
    } catch (err) {
      b64error.value = err.message
    }
  }
)

watch(
  () => b64urlstr.value,
  (newValue) => {
    try {
      b64plane.value = ''
      b64plane.value = base64ToString(newValue)
      b64error.value = ''
    } catch (err) {
      b64error.value = err.message
    }
  }
)

watch(
  () => urldecode.value,
  (newValue) => {
    try {
      const urlencodeValue = encodeURIComponent(newValue)
      urlencode.value = urlencodeValue
      urlerror.value = ''
    } catch (err) {
      urlerror.value = err.message
    }
  }
)

watch(
  () => urlencode.value,
  (newValue) => {
    try {
      const urldecodeValue = decodeURIComponent(newValue)
      urldecode.value = urldecodeValue
      urlerror.value = ''
    } catch (err) {
      urlerror.value =
        err.name === 'URIError'
          ? 'その値はURLデコードできないです。'
          : err.message
    }
  }
)

watch(
  () => hashplain.value,
  (newValue) => {
    if (!newValue) {
      hashbin.value = ''
      hashsha256.value = ''
      hashsha256b64.value = ''
      hashsha256b64url.value = ''
      return
    }
    hashbin.value = Array.from(new TextEncoder().encode(newValue))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    hashsha256.value = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(newValue))
    hashsha256b64.value = CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(newValue))
    hashsha256b64url.value = CryptoJS.enc.Base64url.stringify(CryptoJS.SHA256(newValue))
  }
)

watch(
  () => hashbin.value,
  (newValue) => {
    if (!newValue) {
      hashplain.value = ''
      hashsha256.value = ''
      hashsha256b64.value = ''
      hashsha256b64url.value = ''
      return
    }
    hashplain.value = new TextDecoder().decode(
      new Uint8Array(
        newValue.match(/.{2}/g).map((byte) => parseInt(byte, 16))
      )
    )
    hashsha256.value = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(newValue))
    hashsha256b64.value = CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(newValue))
    hashsha256b64url.value = CryptoJS.enc.Base64url.stringify(CryptoJS.SHA256(newValue))
  }
)

</script>

<style scoped></style>
