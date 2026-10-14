import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { TextEncoder, TextDecoder } from 'util'
import DevelopFido from '@/components/DevelopFido.vue'
import {
  saveStoredCredential,
  clearStoredCredentials,
  stringToBytes
} from '@/utils/webauthn'

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder
}

describe('DevelopFido.vue', () => {
  let wrapper
  let originalCredentials

  beforeEach(() => {
    clearStoredCredentials()
    originalCredentials = navigator.credentials
  })

  afterEach(() => {
    if (originalCredentials !== undefined) {
      Object.defineProperty(navigator, 'credentials', {
        value: originalCredentials,
        configurable: true,
        writable: true
      })
    }
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders registration and authentication forms and json views', async () => {
    wrapper = mount(DevelopFido)
    await nextTick()

    // Form inputs exist
    expect(wrapper.find('#regRpId').exists()).toBe(true)
    expect(wrapper.find('#regRpName').exists()).toBe(true)
    expect(wrapper.find('#regUserName').exists()).toBe(true)
    expect(wrapper.find('#regUserDisplayName').exists()).toBe(true)
    expect(wrapper.find('#regUserId').exists()).toBe(true)
    expect(wrapper.find('#regChallenge').exists()).toBe(true)
    expect(wrapper.find('#btnCreateCredential').exists()).toBe(true)

    expect(wrapper.find('#authRpId').exists()).toBe(true)
    expect(wrapper.find('#authChallenge').exists()).toBe(true)
    expect(wrapper.find('#authCredentialId').exists()).toBe(true)
    expect(wrapper.find('#btnGetCredential').exists()).toBe(true)

    // JSON pre elements exist
    expect(wrapper.find('#regOptionsJson').exists()).toBe(true)
    expect(wrapper.find('#authOptionsJson').exists()).toBe(true)
  })

  it('updates registration options JSON in real-time when inputs change', async () => {
    wrapper = mount(DevelopFido)
    await nextTick()

    const rpNameInput = wrapper.find('#regRpName')
    await rpNameInput.setValue('Updated RP Name')

    const jsonPre = wrapper.find('#regOptionsJson')
    expect(jsonPre.text()).toContain('"name": "Updated RP Name"')
  })

  it('updates authentication options JSON in real-time when inputs change', async () => {
    wrapper = mount(DevelopFido)
    await nextTick()

    const credInput = wrapper.find('#authCredentialId')
    await credInput.setValue('test-cred-id-123')

    const jsonPre = wrapper.find('#authOptionsJson')
    expect(jsonPre.text()).toContain('test-cred-id-123')
  })

  it('synchronizes challenge between registration and authentication and encodes to Base64URL in JSON', async () => {
    wrapper = mount(DevelopFido)
    await nextTick()

    const regChallengeInput = wrapper.find('#regChallenge')
    const authChallengeInput = wrapper.find('#authChallenge')

    // Initial value is identical
    expect(regChallengeInput.element.value).not.toBe('')
    expect(regChallengeInput.element.value).toBe(
      authChallengeInput.element.value
    )

    // Updating registration challenge syncs to authentication and encodes in label & JSON
    await regChallengeInput.setValue('test-challenge-val')
    expect(authChallengeInput.element.value).toBe('test-challenge-val')

    // Base64URL for "test-challenge-val" is "dGVzdC1jaGFsbGVuZ2UtdmFs"
    expect(wrapper.text()).toContain('dGVzdC1jaGFsbGVuZ2UtdmFs')
    expect(wrapper.find('#regOptionsJson').text()).toContain(
      '"challenge": "dGVzdC1jaGFsbGVuZ2UtdmFs"'
    )
    expect(wrapper.find('#authOptionsJson').text()).toContain(
      '"challenge": "dGVzdC1jaGFsbGVuZ2UtdmFs"'
    )

    // Updating authentication challenge syncs back to registration
    await authChallengeInput.setValue('custom-synced-challenge-2')
    expect(regChallengeInput.element.value).toBe('custom-synced-challenge-2')

    // Regenerate button regenerates both simultaneously
    const buttons = wrapper.findAll('button')
    const regenChalBtn = buttons.find(
      (b) =>
        b.text().includes('再生成') &&
        b.element.closest('.mb-3')?.querySelector('#regChallenge')
    )
    expect(regenChalBtn).toBeDefined()
    await regenChalBtn.trigger('click')
    expect(regChallengeInput.element.value).not.toBe(
      'custom-synced-challenge-2'
    )
    expect(regChallengeInput.element.value).toBe(
      authChallengeInput.element.value
    )
  })

  it('regenerates user id when button clicked', async () => {
    wrapper = mount(DevelopFido)
    await nextTick()

    const initialUserId = wrapper.find('#regUserId').element.value

    const buttons = wrapper.findAll('button')
    const regenUserIdBtn = buttons.find(
      (b) =>
        b.text().includes('再生成') &&
        b.element.closest('.mb-3')?.querySelector('#regUserId')
    )
    expect(regenUserIdBtn).toBeDefined()
    await regenUserIdBtn.trigger('click')

    expect(wrapper.find('#regUserId').element.value).not.toBe(initialUserId)
  })

  it('displays Base64URL label side-by-side and updates on input', async () => {
    wrapper = mount(DevelopFido)
    await nextTick()

    const userIdInput = wrapper.find('#regUserId')
    await userIdInput.setValue('test-user-guid')

    // Base64URL for "test-user-guid"
    // stringToBytes('test-user-guid') -> dGVzdC11c2VyLWd1aWQ
    expect(wrapper.text()).toContain('dGVzdC11c2VyLWd1aWQ')
    expect(wrapper.find('#regOptionsJson').text()).toContain(
      '"id": "dGVzdC11c2VyLWd1aWQ"'
    )
  })

  it('handles successful credential creation (Registration)', async () => {
    const mockClientData = stringToBytes(
      JSON.stringify({ type: 'webauthn.create', challenge: 'chal' })
    )
    const mockCredential = {
      id: 'mock-created-cred-id',
      rawId: new Uint8Array([1, 2, 3]).buffer,
      type: 'public-key',
      authenticatorAttachment: 'platform',
      response: {
        clientDataJSON: mockClientData.buffer,
        attestationObject: new Uint8Array([4, 5, 6]).buffer,
        getTransports: () => ['internal'],
        getPublicKey: () => new Uint8Array([7, 8]).buffer,
        getPublicKeyAlgorithm: () => -7,
        getAuthenticatorData: () => new Uint8Array([9, 10]).buffer
      }
    }

    const mockCreate = jest.fn().mockResolvedValue(mockCredential)
    Object.defineProperty(navigator, 'credentials', {
      value: { create: mockCreate, get: jest.fn() },
      configurable: true,
      writable: true
    })

    wrapper = mount(DevelopFido)
    await nextTick()

    const createBtn = wrapper.find('#btnCreateCredential')
    await createBtn.trigger('click')
    await nextTick()

    expect(mockCreate).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Keyの作成に成功しました')
    // Automatically populated auth credentialId
    expect(wrapper.find('#authCredentialId').element.value).toBe(
      'mock-created-cred-id'
    )

    // Result JSON view is rendered
    expect(wrapper.find('#regResultJson').exists()).toBe(true)
    expect(wrapper.find('#regResultJson').text()).toContain(
      'mock-created-cred-id'
    )
  })

  it('handles credential creation error', async () => {
    const mockCreate = jest.fn().mockRejectedValue(new Error('User cancelled'))
    Object.defineProperty(navigator, 'credentials', {
      value: { create: mockCreate, get: jest.fn() },
      configurable: true,
      writable: true
    })

    wrapper = mount(DevelopFido)
    await nextTick()

    const createBtn = wrapper.find('#btnCreateCredential')
    await createBtn.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Key作成エラー')
    expect(wrapper.text()).toContain('User cancelled')
  })

  it('handles successful credential assertion (Authentication)', async () => {
    const mockClientData = stringToBytes(
      JSON.stringify({ type: 'webauthn.get', challenge: 'chal' })
    )
    const mockCredential = {
      id: 'mock-auth-cred-id',
      rawId: new Uint8Array([1, 2, 3]).buffer,
      type: 'public-key',
      response: {
        clientDataJSON: mockClientData.buffer,
        authenticatorData: new Uint8Array([4, 5]).buffer,
        signature: new Uint8Array([6, 7]).buffer,
        userHandle: stringToBytes('user-1').buffer
      }
    }

    const mockGet = jest.fn().mockResolvedValue(mockCredential)
    Object.defineProperty(navigator, 'credentials', {
      value: { create: jest.fn(), get: mockGet },
      configurable: true,
      writable: true
    })

    wrapper = mount(DevelopFido)
    await nextTick()

    const getBtn = wrapper.find('#btnGetCredential')
    await getBtn.trigger('click')
    await nextTick()

    expect(mockGet).toHaveBeenCalled()
    expect(wrapper.text()).toContain('認証に成功しました')
    expect(wrapper.find('#authResultJson').exists()).toBe(true)
    expect(wrapper.find('#authResultJson').text()).toContain(
      'mock-auth-cred-id'
    )
  })

  it('handles authentication error', async () => {
    const mockGet = jest
      .fn()
      .mockRejectedValue(new Error('No credentials match'))
    Object.defineProperty(navigator, 'credentials', {
      value: { create: jest.fn(), get: mockGet },
      configurable: true,
      writable: true
    })

    wrapper = mount(DevelopFido)
    await nextTick()

    const getBtn = wrapper.find('#btnGetCredential')
    await getBtn.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('認証エラー')
    expect(wrapper.text()).toContain('No credentials match')
  })

  it('manages stored credentials and allows selecting or clearing them', async () => {
    saveStoredCredential({
      id: 'saved-cred-xyz',
      rawId: 'raw-xyz',
      userName: 'alice@example.com',
      rpId: 'localhost'
    })

    wrapper = mount(DevelopFido)
    await nextTick()

    // Stored credentials should be visible in table
    expect(wrapper.text()).toContain('alice@example.com')
    expect(wrapper.text()).toContain('saved-cred-xyz')

    // Click "認証にセット"
    const setBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('認証にセット'))
    expect(setBtn).toBeDefined()
    await setBtn.trigger('click')
    expect(wrapper.find('#authCredentialId').element.value).toBe(
      'saved-cred-xyz'
    )

    // Clear storage
    const clearBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('すべて削除'))
    expect(clearBtn).toBeDefined()
    await clearBtn.trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain(
      '現在SessionStorageに保管されているKeyはありません'
    )
  })

  it('allows adding multiple credentials to allowCredentials and reflects them in request options JSON', async () => {
    wrapper = mount(DevelopFido)
    await nextTick()

    // 1つ目の鍵を入力
    const credInput0 = wrapper.find('#authCredentialId')
    await credInput0.setValue('credential-alpha')

    // 「＋ 鍵を追加」ボタンをクリック
    const addBtn = wrapper.find('#btnAddAuthCredential')
    expect(addBtn.exists()).toBe(true)
    await addBtn.trigger('click')
    await nextTick()

    // 2つ目の入力欄が存在し、初期値が空文字（MouseEvent等ではない）ことを確認
    const credInput1 = wrapper.find('#authCredentialId_1')
    expect(credInput1.exists()).toBe(true)
    expect(credInput1.element.value).toBe('')
    await credInput1.setValue('credential-beta')

    // JSON の options に2件反映されていることを確認
    const optionsJsonText = wrapper.find('#authOptionsJson').text()
    const options = JSON.parse(optionsJsonText)
    expect(options.allowCredentials).toBeDefined()
    expect(options.allowCredentials).toHaveLength(2)
    expect(options.allowCredentials[0].id).toBe('credential-alpha')
    expect(options.allowCredentials[0].type).toBe('public-key')
    expect(options.allowCredentials[1].id).toBe('credential-beta')

    // 1つ目の削除ボタンをクリック
    const deleteBtns = wrapper
      .findAll('button')
      .filter((b) => b.attributes('title') === 'この鍵を削除')
    expect(deleteBtns.length).toBe(2)
    await deleteBtns[0].trigger('click')
    await nextTick()

    // 残りの1件 (credential-beta) になる
    const updatedJson = JSON.parse(wrapper.find('#authOptionsJson').text())
    expect(updatedJson.allowCredentials).toHaveLength(1)
    expect(updatedJson.allowCredentials[0].id).toBe('credential-beta')
  })

  it('supports clearing credentials and adding all stored credentials', async () => {
    saveStoredCredential({
      id: 'stored-cred-1',
      rawId: 'raw-1',
      userName: 'user1@example.com',
      transports: ['internal']
    })
    saveStoredCredential({
      id: 'stored-cred-2',
      rawId: 'raw-2',
      userName: 'user2@example.com',
      transports: ['usb']
    })

    wrapper = mount(DevelopFido)
    await nextTick()

    // 「クリア (空欄=パスキー)」ボタンをクリック
    const clearAuthBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('クリア (空欄=パスキー)'))
    expect(clearAuthBtn).toBeDefined()
    await clearAuthBtn.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('指定なし（Discoverable Credential')
    const clearOptions = JSON.parse(wrapper.find('#authOptionsJson').text())
    expect(clearOptions.allowCredentials).toBeUndefined()

    // 「保存中の全鍵を追加」ボタンをクリック
    const addAllBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('保存中の全鍵を追加'))
    expect(addAllBtn).toBeDefined()
    await addAllBtn.trigger('click')
    await nextTick()

    const allOptions = JSON.parse(wrapper.find('#authOptionsJson').text())
    expect(allOptions.allowCredentials).toHaveLength(2)
    expect(allOptions.allowCredentials.map((c) => c.id).sort()).toEqual([
      'stored-cred-1',
      'stored-cred-2'
    ])
  })

  it('passes multiple allowCredentials to navigator.credentials.get', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      id: 'test-cred-id',
      rawId: new Uint8Array([1, 2, 3]).buffer,
      type: 'public-key',
      response: {
        authenticatorData: new Uint8Array([4, 5, 6]).buffer,
        clientDataJSON: new TextEncoder().encode(
          JSON.stringify({ type: 'webauthn.get', challenge: 'dummy' })
        ).buffer,
        signature: new Uint8Array([7, 8, 9]).buffer
      },
      getClientExtensionResults: () => ({})
    })

    Object.defineProperty(navigator, 'credentials', {
      value: { create: jest.fn(), get: mockGet },
      configurable: true,
      writable: true
    })

    wrapper = mount(DevelopFido)
    await nextTick()

    // 2つの有効な鍵を設定
    await wrapper.find('#authCredentialId').setValue('cred-first')
    await wrapper.find('#btnAddAuthCredential').trigger('click')
    await nextTick()
    await wrapper.find('#authCredentialId_1').setValue('cred-second')

    // 認証ボタン押下
    const getBtn = wrapper.find('#btnGetCredential')
    await getBtn.trigger('click')
    await nextTick()

    expect(mockGet).toHaveBeenCalledTimes(1)
    const callArgs = mockGet.mock.calls[0][0]
    expect(callArgs.publicKey.allowCredentials).toBeDefined()
    expect(callArgs.publicKey.allowCredentials).toHaveLength(2)
    expect(callArgs.publicKey.allowCredentials[0].type).toBe('public-key')
    expect(callArgs.publicKey.allowCredentials[0].id).toBeInstanceOf(
      ArrayBuffer
    )
    expect(callArgs.publicKey.allowCredentials[1].id).toBeInstanceOf(
      ArrayBuffer
    )
  })
})
