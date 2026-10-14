/**
 * WebAuthn (FIDO2) クライアントサイド ユーティリティ
 */

const SESSION_STORAGE_KEY = 'fido_webauthn_credentials'

/**
 * ArrayBuffer または Uint8Array を Base64URL 文字列へ変換 (RFC 7515 / 4648)
 * @param {ArrayBuffer | Uint8Array} buffer
 * @returns {string}
 */
export function bufferToBase64Url(buffer) {
  if (!buffer) return ''
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Base64URL 文字列を Uint8Array へ変換
 * @param {string} base64url
 * @returns {Uint8Array}
 */
export function base64UrlToBytes(base64url) {
  if (!base64url) return new Uint8Array(0)
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4 !== 0) {
    base64 += '='
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/**
 * 文字列 (UTF-8) を Uint8Array へ変換
 * @param {string} str
 * @returns {Uint8Array}
 */
export function stringToBytes(str) {
  return new TextEncoder().encode(str || '')
}

/**
 * Uint8Array または ArrayBuffer を文字列 (UTF-8) へデコード
 * @param {ArrayBuffer | Uint8Array} buffer
 * @returns {string}
 */
export function bytesToString(buffer) {
  if (!buffer) return ''
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  return new TextDecoder().decode(bytes)
}

/**
 * 暗号論的疑似乱数によるバイト列生成
 * @param {number} length
 * @returns {Uint8Array}
 */
export function generateRandomBytes(length = 32) {
  const array = new Uint8Array(length)
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    throw new Error('crypto.getRandomValues が利用できません。')
  }
  crypto.getRandomValues(array)
  return array
}

/**
 * 文字列 (UTF-8) を Base64URL 文字列へ変換
 * @param {string} str
 * @returns {string}
 */
export function stringToBase64Url(str) {
  return bufferToBase64Url(stringToBytes(str))
}

/**
 * GUID (UUID v4) の生成
 * @returns {string}
 */
export function generateGuid() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40 // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80 // Variant RFC 4122
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }
  throw new Error('crypto.getRandomValues が利用できません。')
}

/**
 * ランダムなBase64URL文字列の生成（challenge用など）
 * @param {number} length バイト数
 * @returns {string}
 */
export function generateRandomBase64Url(length = 32) {
  return bufferToBase64Url(generateRandomBytes(length))
}

/**
 * SessionStorage からクレデンシャル一覧を取得
 * @returns {Array<object>}
 */
export function getStoredCredentials() {
  if (typeof window === 'undefined' || !window.sessionStorage) return []
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    return []
  }
}

/**
 * SessionStorage にクレデンシャルを保存（最新が先頭）
 * @param {object} cred
 */
export function saveStoredCredential(cred) {
  if (typeof window === 'undefined' || !window.sessionStorage) return
  try {
    const current = getStoredCredentials()
    const filtered = current.filter((item) => item.id !== cred.id)
    filtered.unshift({
      ...cred,
      savedAt: new Date().toISOString()
    })
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(filtered))
  } catch (err) {
    console.warn('SessionStorage へのクレデンシャル保存に失敗しました:', err)
  }
}

/**
 * SessionStorage のクレデンシャルを全消去
 */
export function clearStoredCredentials() {
  if (typeof window === 'undefined' || !window.sessionStorage) return
  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch (err) {
    console.warn('SessionStorage のクレデンシャル消去に失敗しました:', err)
  }
}

/**
 * PublicKeyCredential オブジェクト（作成・認証レスポンス）をシリアライズ可能なプレーンオブジェクトへ変換
 * @param {PublicKeyCredential} credential
 * @returns {object}
 */
export function parseCredentialResponse(credential) {
  if (!credential) return null

  const result = {
    id: credential.id,
    rawId: bufferToBase64Url(credential.rawId),
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment || null
  }

  const res = credential.response

  if (res) {
    // clientDataJSON
    if (res.clientDataJSON) {
      result.clientDataJSON = bufferToBase64Url(res.clientDataJSON)
      try {
        result.clientDataParsed = JSON.parse(bytesToString(res.clientDataJSON))
      } catch (e) {
        result.clientDataParsed = null
      }
    }

    // Attestation Response (Registration)
    if (res.attestationObject) {
      result.attestationObject = bufferToBase64Url(res.attestationObject)
    }
    if (typeof res.getTransports === 'function') {
      result.transports = res.getTransports()
    }
    if (typeof res.getPublicKey === 'function') {
      const pk = res.getPublicKey()
      result.publicKey = pk ? bufferToBase64Url(pk) : null
    }
    if (typeof res.getPublicKeyAlgorithm === 'function') {
      result.publicKeyAlgorithm = res.getPublicKeyAlgorithm()
    }
    if (typeof res.getAuthenticatorData === 'function') {
      const authData = res.getAuthenticatorData()
      result.authenticatorData = authData ? bufferToBase64Url(authData) : null
    }

    // Assertion Response (Authentication)
    if (res.authenticatorData && !result.authenticatorData) {
      result.authenticatorData = bufferToBase64Url(res.authenticatorData)
    }
    if (res.signature) {
      result.signature = bufferToBase64Url(res.signature)
    }
    if (res.userHandle) {
      result.userHandle = bufferToBase64Url(res.userHandle)
      result.userHandleString = bytesToString(res.userHandle)
    }
  }

  return result
}
