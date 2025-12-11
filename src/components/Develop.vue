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
        <h2>Encode</h2>
        <form>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="plane">文字列</label>
              <input
                id="plane"
                v-model="plane"
                class="form-control"
                placeholder="文字列"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-3">
              <label for="b64strb64">Base64(文字列)</label>
              <input
                id="b64str"
                v-model="b64str"
                class="form-control"
                placeholder="Base64(文字列)"
              />
            </div>
            <div class="col-md-3 mb-3">
              <label for="b64strb64url">Base64URL(文字列)</label>
              <input
                id="b64urlstr"
                v-model="b64urlstr"
                class="form-control"
                placeholder="Base64URL(文字列)"
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
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="unicode">Unicode</label>
              <input
                id="unicode"
                v-model="unicode"
                class="form-control"
                placeholder="Unicode"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="strHex">16進数</label>
              <input
                id="strHex"
                v-model="strHex"
                class="form-control"
                placeholder="16進数"
              />
            </div>
          </div>
          <p id="encodeError">{{ encodeError }}</p>
        </form>
        <h2>Hash</h2>
        <form>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="hashPlain">文字列</label>
              <input
                id="hashPlain"
                v-model="hashPlain"
                class="form-control"
                placeholder="Plain"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="hashHex">16進数</label>
              <input
                id="hashHex"
                v-model="hashHex"
                class="form-control"
                placeholder="Hex"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="hashHex">MD5</label>
              <input
                id="hashMd5"
                v-model="hashMd5"
                class="form-control"
                placeholder="MD5"
                readonly
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-3">
              <label for="hashSha1">SHA1</label>
              <input
                id="hashSha1"
                v-model="hashSha1"
                class="form-control"
                placeholder="SHA1"
                readonly
              />
            </div>
            <div class="col-md-3 mb-3">
              <label for="hashSha1">SHA1(Base64Encoded)</label>
              <input
                id="hashSha1b64"
                v-model="hashSha1b64"
                class="form-control"
                placeholder="SHA1B64"
                readonly
              />
            </div>
            <div class="col-md-3 mb-3">
              <label for="hashSha1">SHA1(Base64URLEncoded)</label>
              <input
                id="hashSha1b64url"
                v-model="hashSha1b64url"
                class="form-control"
                placeholder="SHA1B64URL"
                readonly
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-3">
              <label for="hashSha256">SHA256</label>
              <input
                id="hashSha256"
                v-model="hashSha256"
                class="form-control"
                placeholder="SHA256"
                readonly
              />
            </div>
            <div class="col-md-3 mb-3">
              <label for="hashSha256">SHA256(Base64Encoded)</label>
              <input
                id="hashSha256b64"
                v-model="hashSha256b64"
                class="form-control"
                placeholder="SHA256B64"
                readonly
              />
            </div>
            <div class="col-md-3 mb-3">
              <label for="hashSha256">SHA256(Base64URLEncoded)</label>
              <input
                id="hashSha256b64url"
                v-model="hashSha256b64url"
                class="form-control"
                placeholder="SHA256B64URL"
                readonly
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-3">
              <label for="hashSha512">SHA512</label>
              <input
                id="hashSha512"
                v-model="hashSha512"
                class="form-control"
                placeholder="SHA512"
                readonly
              />
            </div>
            <div class="col-md-3 mb-3">
              <label for="hashSha512">SHA512(Base64Encoded)</label>
              <input
                id="hashSha512b64"
                v-model="hashSha512b64"
                class="form-control"
                placeholder="SHA512B64"
                readonly
              />
            </div>
            <div class="col-md-3 mb-3">
              <label for="hashSha512">SHA512(Base64URLEncoded)</label>
              <input
                id="hashSha512b64url"
                v-model="hashSha512b64url"
                class="form-control"
                placeholder="SHA512B64URL"
                readonly
              />
            </div>
          </div>
          <p id="hasherror">{{ hasherror }}</p>
        </form>
        <h2>数値変換</h2>
        <form>
          <div class="row">
            <div class="col-md-2 mb-3">
              <label for="bin">2進数</label>
              <input
                id="bin"
                v-model="bin"
                class="form-control"
                placeholder="2進数"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label for="quat">4進数</label>
              <input
                id="quat"
                v-model="quat"
                class="form-control"
                placeholder="4進数"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label for="oct">8進数</label>
              <input
                id="oct"
                v-model="oct"
                class="form-control"
                placeholder="8進数"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label for="dec">10進数</label>
              <input
                id="dec"
                v-model="dec"
                class="form-control"
                placeholder="10進数"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label for="hex">16進数</label>
              <input
                id="hex"
                v-model="hex"
                class="form-control"
                placeholder="16進数"
              />
            </div>
          </div>
          <p id="numberConversionError">{{ numberConversionError }}</p>
        </form>
        <h2>時間変換</h2>
        <form>
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="totalSeconds">秒(合計)</label>
              <input
                id="totalSeconds"
                v-model="totalSeconds"
                class="form-control"
                placeholder="秒"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-2 mb-3">
              <label for="seconds">秒</label>
              <input
                id="seconds"
                v-model="seconds"
                class="form-control"
                placeholder="残り秒"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label for="minutes">分</label>
              <input
                id="minutes"
                v-model="minutes"
                class="form-control"
                placeholder="分"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label for="hours">時間</label>
              <input
                id="hours"
                v-model="hours"
                class="form-control"
                placeholder="時間"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label for="days">日</label>
              <input
                id="days"
                v-model="days"
                class="form-control"
                placeholder="日"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label for="weeks">週間</label>
              <input
                id="weeks"
                v-model="weeks"
                class="form-control"
                placeholder="週間"
              />
            </div>
          </div>
          <p id="timeConversionError">{{ timeConversionError }}</p>
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
import { ref, watch, nextTick } from 'vue'
import CryptoJS from 'crypto-js'

class UndecodableError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UndecodableError'
  }
}

const errorMessages = {
  invalidBinary: 'Invalid binary string',
  invalidQuaternary: 'Invalid quaternary string',
  invalidDecimal: 'Invalid decimal string',
  invalidHexadecimal: 'Invalid hexadecimal string',
  invalidBase64: 'Invalid Base64 string',
  invalidUnicode: 'Invalid Unicode string',
  invalidURLEncoding: 'Invalid URL encoding'
}

const plane = ref('')
const strHex = ref('')
const b64str = ref('')
const b64urlstr = ref('')
const unicode = ref('')
const urlencode = ref('')
const encodeError = ref('')

const hashMd5 = ref('')
const hashPlain = ref('')
const hashHex = ref('')
const hashSha1 = ref('')
const hashSha1b64 = ref('')
const hashSha1b64url = ref('')
const hashSha256 = ref('')
const hashSha256b64 = ref('')
const hashSha256b64url = ref('')
const hashSha512 = ref('')
const hashSha512b64 = ref('')
const hashSha512b64url = ref('')
const hasherror = ref('')

const bin = ref('')
const quat = ref('')
const oct = ref('')
const dec = ref('')
const hex = ref('')
const numberConversionError = ref('')

const totalSeconds = ref('')
const seconds = ref('')
const minutes = ref('')
const hours = ref('')
const days = ref('')
const weeks = ref('')
const timeConversionError = ref('')

const randomseed = ref(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
)
const randomlength = ref(10)
const randomvalue = ref('')
const randomerror = ref('')

// 時間変換の循環更新を防ぐフラグと現在更新中のフィールド
let isUpdatingTimeConversion = false
// プログラムから更新しているフィールドを記録
const programmaticUpdateFields = new Set()

// functions
const stringToHex = (str) => {
  return Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const hexToString = (hex) => {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) {
    throw new UndecodableError(errorMessages.invalidHexadecimal)
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

const stringToUnicode = (str) => {
  return Array.from(str)
    .map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
    .join('')
}

const unicodeToString = (unicodeStr) => {
  return unicodeStr.replace(/\\u[\dA-F]{4}/gi, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
  })
}

const cleanEncodeValues = () => {
  b64str.value = ''
  b64urlstr.value = ''
  urlencode.value = ''
  unicode.value = ''
  strHex.value = ''
}

/*
 * 数値変換初期化
 */
const cleanNumberConvertValues = (excludeField = '') => {
  if (excludeField !== 'bin') bin.value = ''
  if (excludeField !== 'quat') quat.value = ''
  if (excludeField !== 'oct') oct.value = ''
  if (excludeField !== 'dec') dec.value = ''
  if (excludeField !== 'hex') hex.value = ''
}

/*
 * 時間変換初期化
 */
const cleanTimeConvertValues = (excludeField = '') => {
  if (excludeField !== 'totalSeconds') totalSeconds.value = ''
  if (excludeField !== 'seconds') seconds.value = ''
  if (excludeField !== 'minutes') minutes.value = ''
  if (excludeField !== 'hours') hours.value = ''
  if (excludeField !== 'days') days.value = ''
  if (excludeField !== 'weeks') weeks.value = ''
  timeConversionError.value = ''
}

// watchers
/**
 * 文字列変換
 */
watch(
  () => plane.value,
  (newValue) => {
    if (!newValue) {
      cleanEncodeValues()
      return
    }
    b64str.value = stringToBase64(newValue)
    const urlstrValue = b64str.value
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    b64urlstr.value = urlstrValue
    urlencode.value = encodeURIComponent(newValue)
    unicode.value = stringToUnicode(newValue)
    strHex.value = stringToHex(newValue)
  }
)

watch(
  () => b64str.value,
  (newValue) => {
    try {
      plane.value = ''
      plane.value = base64ToString(newValue)
      encodeError.value = ''
    } catch (err) {
      encodeError.value = err.message
    }
  }
)

watch(
  () => b64urlstr.value,
  (newValue) => {
    try {
      plane.value = ''
      plane.value = base64ToString(newValue)
      encodeError.value = ''
    } catch (err) {
      encodeError.value = err.message
    }
  }
)

watch(
  () => urlencode.value,
  (newValue) => {
    try {
      plane.value = decodeURIComponent(newValue)
    } catch (err) {
      encodeError.value =
        err.name === 'URIError'
          ? 'その値はURLデコードできないです。'
          /* c8 ignore start */
          : err.message // 入らない想定
          /* c8 ignore stop */
    }
  }
)

watch(
  () => unicode.value,
  (newValue) => {
    try {
      plane.value = ''
      plane.value = unicodeToString(newValue)
      encodeError.value = ''
    /* c8 ignore start */
    } catch (err) {
      encodeError.value = err.message // 入らない想定
    }
    /* c8 ignore stop */
  }
)

watch(
  () => strHex.value,
  (newValue) => {
    if (!newValue) {
      cleanEncodeValues()
      return
    }
    const regex = /^[0-9a-fA-F]+$/
    if (!regex.test(newValue)) {
      encodeError.value = 'その値はBase64エンコードされた16進数ではないです。'
      return
    }
    try {
      const planeValue = hexToString(newValue)
      plane.value = planeValue
      encodeError.value = ''
    } catch (err) {
      encodeError.value = 'unknown error: ' + err.message
      if (err instanceof UndecodableError)
        encodeError.value = '文字列化できる16進数ではありません。'
    }
  }
)

/**
 * Hash化
 */
watch(
  () => hashPlain.value,
  (newValue) => {
    if (!newValue) {
      hashMd5.value = ''
      hashHex.value = ''
      hashSha1.value = ''
      hashSha1b64.value = ''
      hashSha1b64url.value = ''
      hashSha256.value = ''
      hashSha256b64.value = ''
      hashSha256b64url.value = ''
      hashSha512.value = ''
      hashSha512b64.value = ''
      hashSha512b64url.value = ''
      return
    }
    hashHex.value = Array.from(new TextEncoder().encode(newValue))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    hashMd5.value = CryptoJS.enc.Hex.stringify(CryptoJS.MD5(newValue))
    hashSha1.value = CryptoJS.enc.Hex.stringify(CryptoJS.SHA1(newValue))
    hashSha1b64.value = CryptoJS.enc.Base64.stringify(CryptoJS.SHA1(newValue))
    hashSha1b64url.value = CryptoJS.enc.Base64url.stringify(
      CryptoJS.SHA1(newValue)
    )
    hashSha256.value = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(newValue))
    hashSha256b64.value = CryptoJS.enc.Base64.stringify(
      CryptoJS.SHA256(newValue)
    )
    hashSha256b64url.value = CryptoJS.enc.Base64url.stringify(
      CryptoJS.SHA256(newValue)
    )
    hashSha512.value = CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(newValue))
    hashSha512b64.value = CryptoJS.enc.Base64.stringify(
      CryptoJS.SHA512(newValue)
    )
    hashSha512b64url.value = CryptoJS.enc.Base64url.stringify(
      CryptoJS.SHA512(newValue)
    )
  }
)

watch(
  () => hashHex.value,
  (newValue) => {
    hasherror.value = ''
    if (!newValue) {
      hashMd5.value = ''
      hashPlain.value = ''
      hashSha1.value = ''
      hashSha1b64.value = ''
      hashSha1b64url.value = ''
      hashSha256.value = ''
      hashSha256b64.value = ''
      hashSha256b64url.value = ''
      hashSha512.value = ''
      hashSha512b64.value = ''
      hashSha512b64url.value = ''
      return
    }
    try {
      hashPlain.value = new TextDecoder().decode(
        new Uint8Array(
          newValue.match(/.{2}/g).map((byte) => parseInt(byte, 16))
        )
      )
      // 特殊文字のチェックは不要
      // eslint-disable-next-line no-control-regex
      if (/[\x00-\x1f�]/.test(hashPlain.value)) {
        hasherror.value =
          '文字列として表示されている値が文字化けしてしまっている可能性があります'
      }
    } catch (err) {
      hasherror.value = 'その値は文字列化可能な16進数ではないです。'
    }
  }
)

/**
 * 数値変換
 */
watch(
  () => bin.value,
  (newValue) => {
    if (!newValue) {
      cleanNumberConvertValues('bin')
      return
    }
    const regex = /^[0-1]+$/
    if (!regex.test(newValue)) {
      numberConversionError.value = 'その値は2進数の値ではありません'
      return
    }
    try {
      quat.value = parseInt(newValue, 2).toString(4)
      oct.value = parseInt(newValue, 2).toString(8)
      dec.value = parseInt(newValue, 2).toString(10)
      hex.value = parseInt(newValue, 2).toString(16)
      numberConversionError.value = ''
    /* c8 ignore start */
    } catch (err) {
      numberConversionError.value = 'unknown error: ' + err.message
    }
    /* c8 ignore stop */
  }
)

watch(
  () => quat.value,
  (newValue) => {
    if (!newValue) {
      cleanNumberConvertValues('quat')
      return
    }
    const regex = /^[0-3]+$/
    if (!regex.test(newValue)) {
      numberConversionError.value = 'その値は4進数の値ではありません'
      return
    }
    try {
      bin.value = parseInt(newValue, 4).toString(2)
      oct.value = parseInt(newValue, 4).toString(8)
      dec.value = parseInt(newValue, 4).toString(10)
      hex.value = parseInt(newValue, 4).toString(16)
      numberConversionError.value = ''
    /* c8 ignore start */
    } catch (err) {
      numberConversionError.value = 'unknown error: ' + err.message
    }
    /* c8 ignore stop */
  }
)

watch(
  () => oct.value,
  (newValue) => {
    if (!newValue) {
      cleanNumberConvertValues('oct')
      return
    }
    const regex = /^[0-7]+$/
    if (!regex.test(newValue)) {
      numberConversionError.value = 'その値は8進数の値ではありません'
      return
    }
    try {
      bin.value = parseInt(newValue, 8).toString(2)
      quat.value = parseInt(newValue, 8).toString(4)
      dec.value = parseInt(newValue, 8).toString(10)
      hex.value = parseInt(newValue, 8).toString(16)
      numberConversionError.value = ''
    /* c8 ignore start */
    } catch (err) {
      numberConversionError.value = 'unknown error: ' + err.message
    }
    /* c8 ignore stop */
  }
)

watch(
  () => dec.value,
  (newValue) => {
    if (!newValue) {
      cleanNumberConvertValues('dec')
      return
    }
    const regex = /^[0-9]+$/
    if (!regex.test(newValue)) {
      numberConversionError.value = 'その値は10進数の値ではありません'
      return
    }
    try {
      bin.value = parseInt(newValue, 10).toString(2)
      quat.value = parseInt(newValue, 10).toString(4)
      oct.value = parseInt(newValue, 10).toString(8)
      hex.value = parseInt(newValue, 10).toString(16)
      numberConversionError.value = ''
    /* c8 ignore start */
    } catch (err) {
      numberConversionError.value = 'unknown error: ' + err.message
    }
    /* c8 ignore stop */
  }
)

watch(
  () => hex.value,
  (newValue) => {
    if (!newValue) {
      cleanNumberConvertValues('hex')
      return
    }
    const regex = /^[0-9a-fA-F]+$/
    if (!regex.test(newValue)) {
      numberConversionError.value = 'その値は16進数の値ではありません'
      return
    }
    try {
      bin.value = parseInt(newValue, 16).toString(2)
      quat.value = parseInt(newValue, 16).toString(4)
      oct.value = parseInt(newValue, 16).toString(8)
      dec.value = parseInt(newValue, 16).toString(10)
      numberConversionError.value = ''
    /* c8 ignore start */
    } catch (err) {
      numberConversionError.value = 'unknown error: ' + err.message
    }
    /* c8 ignore stop */
  }
)

/**
 * 時間変換
 * @param {string} sourceField - 変換元フィールド名
 * @param {string} sourceValue - 変換元の値（秒数の文字列）
 * @returns {Promise<boolean>} 変換成功時はtrue、失敗時はfalse
 */
const updateTimeConversion = async (sourceField, sourceValue) => {
  // 整数のみを許可
  const regex = /^[0-9]+$/
  if (!regex.test(sourceValue)) {
    timeConversionError.value = '秒は整数である必要があります。'
    return false
  }

  try {
    isUpdatingTimeConversion = true
    const value = Math.floor(sourceValue) // 整数に変換

    // すべての値を秒に統一して計算
    let totalSecs = 0

    // ソースフィールドから秒に変換
    switch (sourceField) {
      case 'totalSeconds':
        totalSecs = value
        break
      case 'minutes':
        totalSecs = value * 60
        break
      case 'hours':
        totalSecs = value * 3600
        break
      case 'days':
        totalSecs = value * 86400
        break
      case 'weeks':
        totalSecs = value * 604800
        break
    }

    // 秒から各単位に計算（整数除算を使用）
    const calcSeconds = totalSecs % 60  // 残り秒
    const calcMinutes = Math.floor(totalSecs / 60) % 60  // 分（時間からの余り）
    const calcHours = Math.floor(totalSecs / 3600) % 24  // 時間（日からの余り）
    const calcDays = Math.floor(totalSecs / 86400) % 7  // 日（週間からの余り）
    const calcWeeks = Math.floor(totalSecs / 604800)  // 週間

    // プログラム更新としてマーク（watcher 側で無視するため）
    programmaticUpdateFields.add('totalSeconds')
    programmaticUpdateFields.add('seconds')
    programmaticUpdateFields.add('minutes')
    programmaticUpdateFields.add('hours')
    programmaticUpdateFields.add('days')
    programmaticUpdateFields.add('weeks')

    totalSeconds.value = totalSecs.toString()
    seconds.value = calcSeconds.toString()
    minutes.value = calcMinutes.toString()
    hours.value = calcHours.toString()
    days.value = calcDays.toString()
    weeks.value = calcWeeks.toString()

    // 次の tick まで programmaticUpdateFields を保持して watcher の自発的再計算を防止
    await nextTick()
    programmaticUpdateFields.clear()

    timeConversionError.value = ''
    return true
  } catch (err) {
    /* c8 ignore start */
    timeConversionError.value = 'unknown error: ' + err.message
    return false
    /* c8 ignore stop */
  } finally {
    isUpdatingTimeConversion = false
  }
}

watch(
  () => totalSeconds.value,
  (newValue) => {
    if (!newValue) {
      cleanTimeConvertValues('totalSeconds')
      return
    }
    if (isUpdatingTimeConversion || programmaticUpdateFields.has('totalSeconds')) {
      return
    }
    updateTimeConversion('totalSeconds', newValue)
  }
)

watch(
  () => seconds.value,
  (newValue) => {
    if (!newValue) {
      return
    }
    if (isUpdatingTimeConversion || programmaticUpdateFields.has('seconds')) {
      return
    }
    // seconds + minutes * 60 で総秒数を計算
    const remain = Math.floor(newValue)
    const mins = minutes.value ? Math.floor(minutes.value) : 0
    const hrs = hours.value ? Math.floor(hours.value) : 0
    const dys = days.value ? Math.floor(days.value) : 0
    const wks = weeks.value ? Math.floor(weeks.value) : 0
    const totalSecs = remain + mins * 60 + hrs * 3600 + dys * 86400 + wks * 604800
    updateTimeConversion('totalSeconds', totalSecs.toString())
  }
)

watch(
  () => minutes.value,
  (newValue) => {
    if (isUpdatingTimeConversion || programmaticUpdateFields.has('minutes')) {
      return
    }
    // 残り秒 + 分 * 60 + 時間 * 3600 + 日 * 86400 + 週間 * 604800 で総秒数を計算
    const remain = seconds.value ? Math.floor(seconds.value) : 0
    const mins = newValue ? Math.floor(newValue) : 0
    const hrs = hours.value ? Math.floor(hours.value) : 0
    const dys = days.value ? Math.floor(days.value) : 0
    const wks = weeks.value ? Math.floor(weeks.value) : 0
    const totalSecs = remain + mins * 60 + hrs * 3600 + dys * 86400 + wks * 604800
    updateTimeConversion('totalSeconds', totalSecs.toString())
  }
)

watch(
  () => hours.value,
  (newValue) => {
    if (isUpdatingTimeConversion || programmaticUpdateFields.has('hours')) {
      return
    }
    // 残り秒 + 分 * 60 + 時間 * 3600 + 日 * 86400 + 週間 * 604800 で総秒数を計算
    const remain = seconds.value ? Math.floor(seconds.value) : 0
    const mins = minutes.value ? Math.floor(minutes.value) : 0
    const hrs = newValue ? Math.floor(newValue) : 0
    const dys = days.value ? Math.floor(days.value) : 0
    const wks = weeks.value ? Math.floor(weeks.value) : 0
    const totalSecs = remain + mins * 60 + hrs * 3600 + dys * 86400 + wks * 604800
    updateTimeConversion('totalSeconds', totalSecs.toString())
  }
)

watch(
  () => days.value,
  (newValue) => {
    if (isUpdatingTimeConversion || programmaticUpdateFields.has('days')) {
      return
    }
    // 残り秒 + 分 * 60 + 時間 * 3600 + 日 * 86400 + 週間 * 604800 で総秒数を計算
    const remain = seconds.value ? Math.floor(seconds.value) : 0
    const mins = minutes.value ? Math.floor(minutes.value) : 0
    const hrs = hours.value ? Math.floor(hours.value) : 0
    const dys = newValue ? Math.floor(newValue) : 0
    const wks = weeks.value ? Math.floor(weeks.value) : 0
    const totalSecs = remain + mins * 60 + hrs * 3600 + dys * 86400 + wks * 604800
    updateTimeConversion('totalSeconds', totalSecs.toString())
  }
)

watch(
  () => weeks.value,
  (newValue) => {
    if (isUpdatingTimeConversion || programmaticUpdateFields.has('weeks')) {
      return
    }
    // 残り秒 + 分 * 60 + 時間 * 3600 + 日 * 86400 + 週間 * 604800 で総秒数を計算
    const remain = seconds.value ? Math.floor(seconds.value) : 0
    const mins = minutes.value ? Math.floor(minutes.value) : 0
    const hrs = hours.value ? Math.floor(hours.value) : 0
    const dys = days.value ? Math.floor(days.value) : 0
    const wks = newValue ? Math.floor(newValue) : 0
    const totalSecs = remain + mins * 60 + hrs * 3600 + dys * 86400 + wks * 604800
    updateTimeConversion('totalSeconds', totalSecs.toString())
  }
)

</script>

<style scoped></style>
