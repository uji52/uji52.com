import { TextEncoder, TextDecoder } from 'util'
import {
  bufferToBase64Url,
  base64UrlToBytes,
  stringToBytes,
  bytesToString,
  stringToBase64Url,
  generateGuid,
  generateRandomBytes,
  generateRandomBase64Url,
  getStoredCredentials,
  saveStoredCredential,
  clearStoredCredentials,
  parseCredentialResponse,
  isWebViewEnvironment
} from '@/utils/webauthn'

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder
}

describe('webauthn.js utility', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  describe('bufferToBase64Url & base64UrlToBytes', () => {
    it('correctly encodes and decodes roundtrip', () => {
      const original = new Uint8Array([0, 1, 2, 250, 255, 62, 63])
      const b64url = bufferToBase64Url(original)
      expect(typeof b64url).toBe('string')
      expect(b64url).not.toContain('+')
      expect(b64url).not.toContain('/')
      expect(b64url).not.toContain('=')

      const decoded = base64UrlToBytes(b64url)
      expect(Array.from(decoded)).toEqual(Array.from(original))
    })

    it('handles empty / null inputs', () => {
      expect(bufferToBase64Url(null)).toBe('')
      expect(base64UrlToBytes('')).toEqual(new Uint8Array(0))
      expect(base64UrlToBytes(null)).toEqual(new Uint8Array(0))
    })
  })

  describe('stringToBytes & bytesToString', () => {
    it('correctly converts string to bytes and back', () => {
      const text = 'Hello WebAuthn 🔑'
      const bytes = stringToBytes(text)
      expect(bytesToString(bytes)).toBe(text)
    })

    it('handles empty inputs', () => {
      expect(bytesToString(null)).toBe('')
      expect(Array.from(stringToBytes(''))).toEqual([])
    })
  })

  describe('stringToBase64Url', () => {
    it('encodes UTF-8 string to base64url', () => {
      const text = 'test-guid-1234'
      const b64url = stringToBase64Url(text)
      const decodedBytes = base64UrlToBytes(b64url)
      expect(bytesToString(decodedBytes)).toBe(text)
    })
  })

  describe('random generators & GUID', () => {
    it('generates random bytes of given length', () => {
      const bytes = generateRandomBytes(16)
      expect(bytes.length).toBe(16)
    })

    it('generates random base64url string', () => {
      const str = generateRandomBase64Url(32)
      expect(typeof str).toBe('string')
      expect(str.length).toBeGreaterThan(0)
    })

    it('generates valid GUID format', () => {
      const guid = generateGuid()
      expect(typeof guid).toBe('string')
      expect(guid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    })

    it('generates GUID with getRandomValues when randomUUID is unavailable', () => {
      const originalRandomUUID = crypto.randomUUID
      try {
        crypto.randomUUID = undefined
        const guid = generateGuid()
        expect(typeof guid).toBe('string')
        expect(guid).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        )
      } finally {
        crypto.randomUUID = originalRandomUUID
      }
    })

    it('throws error when crypto.getRandomValues is unavailable', () => {
      const originalGetRandomValues = crypto.getRandomValues
      const originalRandomUUID = crypto.randomUUID
      try {
        crypto.getRandomValues = undefined
        crypto.randomUUID = undefined
        expect(() => generateRandomBytes(16)).toThrow(
          'crypto.getRandomValues が利用できません。'
        )
        expect(() => generateGuid()).toThrow(
          'crypto.getRandomValues が利用できません。'
        )
      } finally {
        crypto.getRandomValues = originalGetRandomValues
        crypto.randomUUID = originalRandomUUID
      }
    })
  })

  describe('sessionStorage helpers', () => {
    it('saves, retrieves, and clears credentials', () => {
      expect(getStoredCredentials()).toEqual([])

      const cred1 = { id: 'cred-1', rawId: 'raw-1', type: 'public-key' }
      saveStoredCredential(cred1)
      expect(getStoredCredentials().length).toBe(1)
      expect(getStoredCredentials()[0].id).toBe('cred-1')

      // Save another credential
      const cred2 = { id: 'cred-2', rawId: 'raw-2', type: 'public-key' }
      saveStoredCredential(cred2)
      const list = getStoredCredentials()
      expect(list.length).toBe(2)
      expect(list[0].id).toBe('cred-2') // newest first

      // Overwrite cred-1
      saveStoredCredential({ id: 'cred-1', extra: 'updated' })
      const listUpdated = getStoredCredentials()
      expect(listUpdated.length).toBe(2)
      expect(listUpdated[0].id).toBe('cred-1')

      clearStoredCredentials()
      expect(getStoredCredentials()).toEqual([])
    })

    it('safely catches exceptions from sessionStorage.setItem / removeItem', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      const setItemSpy = jest
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {
          throw new Error('QuotaExceededError')
        })
      const removeItemSpy = jest
        .spyOn(Storage.prototype, 'removeItem')
        .mockImplementation(() => {
          throw new Error('SecurityError')
        })

      try {
        expect(() => {
          saveStoredCredential({ id: 'test' })
        }).not.toThrow()
        expect(warnSpy).toHaveBeenCalled()

        expect(() => {
          clearStoredCredentials()
        }).not.toThrow()
      } finally {
        setItemSpy.mockRestore()
        removeItemSpy.mockRestore()
        warnSpy.mockRestore()
      }
    })
  })

  describe('parseCredentialResponse', () => {
    it('handles null/undefined credential', () => {
      expect(parseCredentialResponse(null)).toBeNull()
    })

    it('parses registration attestation response', () => {
      const clientDataObj = {
        type: 'webauthn.create',
        challenge: 'test-challenge',
        origin: 'https://example.com'
      }
      const clientDataBytes = stringToBytes(JSON.stringify(clientDataObj))

      const mockCredential = {
        id: 'test-id',
        rawId: new Uint8Array([1, 2, 3]).buffer,
        type: 'public-key',
        authenticatorAttachment: 'platform',
        response: {
          clientDataJSON: clientDataBytes.buffer,
          attestationObject: new Uint8Array([4, 5, 6]).buffer,
          getTransports: () => ['internal'],
          getPublicKey: () => new Uint8Array([7, 8, 9]).buffer,
          getPublicKeyAlgorithm: () => -7,
          getAuthenticatorData: () => new Uint8Array([10, 11]).buffer
        }
      }

      const parsed = parseCredentialResponse(mockCredential)
      expect(parsed.id).toBe('test-id')
      expect(parsed.type).toBe('public-key')
      expect(parsed.authenticatorAttachment).toBe('platform')
      expect(parsed.clientDataParsed).toEqual(clientDataObj)
      expect(parsed.transports).toEqual(['internal'])
      expect(parsed.publicKeyAlgorithm).toBe(-7)
      expect(typeof parsed.publicKey).toBe('string')
      expect(typeof parsed.authenticatorData).toBe('string')
    })

    it('parses authentication assertion response', () => {
      const clientDataObj = {
        type: 'webauthn.get',
        challenge: 'auth-challenge',
        origin: 'https://example.com'
      }
      const clientDataBytes = stringToBytes(JSON.stringify(clientDataObj))

      const mockCredential = {
        id: 'auth-id',
        rawId: new Uint8Array([10, 20]).buffer,
        type: 'public-key',
        response: {
          clientDataJSON: clientDataBytes.buffer,
          authenticatorData: new Uint8Array([30, 40]).buffer,
          signature: new Uint8Array([50, 60]).buffer,
          userHandle: stringToBytes('user-handle-123').buffer
        }
      }

      const parsed = parseCredentialResponse(mockCredential)
      expect(parsed.id).toBe('auth-id')
      expect(parsed.clientDataParsed).toEqual(clientDataObj)
      expect(parsed.userHandleString).toBe('user-handle-123')
      expect(typeof parsed.signature).toBe('string')
    })
  })

  describe('isWebViewEnvironment', () => {
    it('returns false for standard desktop and mobile browsers', () => {
      const desktopChrome =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      const mobileSafari =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      const androidChrome =
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36'

      expect(isWebViewEnvironment(desktopChrome)).toBe(false)
      expect(isWebViewEnvironment(mobileSafari)).toBe(false)
      expect(isWebViewEnvironment(androidChrome)).toBe(false)
      expect(isWebViewEnvironment('')).toBe(false)
      expect(isWebViewEnvironment(null)).toBe(false)
    })

    it('returns true for Android WebViews', () => {
      const androidWv =
        'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UD1A.231105.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.43 Mobile Safari/537.36'
      const androidVersion =
        'Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; LGMS323 Build/KOT49I.MS32310c) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36'

      expect(isWebViewEnvironment(androidWv)).toBe(true)
      expect(isWebViewEnvironment(androidVersion)).toBe(true)
    })

    it('returns true for iOS WebViews and in-app browsers', () => {
      const iosWebView =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
      const lineBrowser =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Line/13.1.0'

      expect(isWebViewEnvironment(iosWebView)).toBe(true)
      expect(isWebViewEnvironment(lineBrowser)).toBe(true)
    })
  })
})
