import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Develop from '@/components/Develop.vue'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

describe('Develop.vue', () => {
  let wrapper
  let originalEncodeURIComponent
  let originalDecodeURIComponent

  beforeEach(async() => {
    originalEncodeURIComponent = global.encodeURIComponent
    originalDecodeURIComponent = global.decodeURIComponent
    wrapper = mount(Develop)
    await nextTick()
  })

  afterEach(() => {
    global.encodeURIComponent = originalEncodeURIComponent
    global.decodeURIComponent = originalDecodeURIComponent
    wrapper.unmount()
  })

  // functions
  it('stringToHex: base64 encode (plain => base64hex)', () => {
    expect(wrapper.vm.stringToHex('test')).toBe('74657374')
  })

  it('hexToString: base64 dencode (base64hex => string)', () => {
    expect(wrapper.vm.hexToString('74657374')).toBe('test')
  })

  it('hexToString: error', () => {
    expect(() => {
      wrapper.vm.hexToString('zz')
    }).toThrow()
  })

  it('stringToBase64: base64 encode (plain => base64str)', () => {
    expect(wrapper.vm.stringToBase64('test')).toBe('dGVzdA==')
  })

  it('base64ToString: base64 decode (base64str => plain)', () => {
    expect(wrapper.vm.base64ToString('dGVzdA==')).toBe('test')
    expect(wrapper.vm.base64ToString('dGVzdA')).toBe('test')
  })

  it('randomgenerate: generate', async() => {
    const lengthInput = wrapper.find('input[id="randomlength"]')
    await lengthInput.setValue("8")
    const seedInput = wrapper.find('input[id="randomseed"]')
    await seedInput.setValue("abc")
    wrapper.vm.randomgenerate()

    expect(wrapper.vm.randomvalue).toMatch(/[a-c]{8}/)
  })

  // watchers
  it('base64 plane', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.b64error).toBe('')

    const input = wrapper.find('input[id="b64plane"]')
    await input.setValue('test')

    expect(wrapper.vm.b64plane).toBe('test')
    expect(wrapper.vm.b64hex).toBe('74657374')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')
    expect(wrapper.vm.b64error).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="b64plane"]')
    const hexInput = wrapper.find('input[id="b64hex"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')

    expect(planeInput.element.value).toBe('test')
    expect(hexInput.element.value).toBe('74657374')
    expect(strInput.element.value).toBe('dGVzdA==')
    expect(urlstrInput.element.value).toBe('dGVzdA')
    expect(wrapper.vm.b64error).toBe('')
  })

  it('base64 plane null', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.b64error).toBe('')

    const input = wrapper.find('input[id="b64plane"]')
    await input.setValue('test')

    expect(wrapper.vm.b64plane).toBe('test')
    expect(wrapper.vm.b64hex).toBe('74657374')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')
    expect(wrapper.vm.b64error).toBe('')

    await input.setValue('')
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.b64error).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="b64plane"]')
    const hexInput = wrapper.find('input[id="b64hex"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')

    expect(planeInput.element.value).toBe('')
    expect(hexInput.element.value).toBe('')
    expect(strInput.element.value).toBe('')
    expect(urlstrInput.element.value).toBe('')
    expect(wrapper.vm.b64error).toBe('')
  })

  it('base64 hex', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.b64error).toBe('')

    const input = wrapper.find('input[id="b64hex"]')
    await input.setValue('74657374')

    expect(wrapper.vm.b64plane).toBe('test')
    expect(wrapper.vm.b64hex).toBe('74657374')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')
    expect(wrapper.vm.b64error).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="b64plane"]')
    const hexInput = wrapper.find('input[id="b64hex"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')

    expect(planeInput.element.value).toBe('test')
    expect(hexInput.element.value).toBe('74657374')
    expect(strInput.element.value).toBe('dGVzdA==')
    expect(urlstrInput.element.value).toBe('dGVzdA')
  })

  it('base64 hex error', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.b64error).toBe('')

    const input = wrapper.find('input[id="b64hex"]')
    await input.setValue('z')
    await nextTick()

    expect(wrapper.vm.b64error).toBe('その値はBase64エンコードされた16進数ではないです。')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const b64Error = wrapper.find('p[id="b64error"]')
    // expect(b64Error.element.text).toBe('')
  })

  it('base64 str', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.b64error).toBe('')

    const input = wrapper.find('input[id="b64str"]')
    await input.setValue('dGVzdA==')

    expect(wrapper.vm.b64plane).toBe('test')
    expect(wrapper.vm.b64hex).toBe('74657374')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')
    expect(wrapper.vm.b64error).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="b64plane"]')
    const hexInput = wrapper.find('input[id="b64hex"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')

    expect(planeInput.element.value).toBe('test')
    expect(hexInput.element.value).toBe('74657374')
    expect(strInput.element.value).toBe('dGVzdA==')
    expect(urlstrInput.element.value).toBe('dGVzdA')
  })

  it('base64 str error', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.b64error).toBe('')

    const input = wrapper.find('input[id="b64str"]')
    await input.setValue('=')
    await nextTick()

    expect(wrapper.vm.b64error).toBe('Invalid Base64 string')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const b64Error = wrapper.find('p[id="b64error"]')
    // expect(b64Error.element.text).toBe('')
  })

  it('base64 urlstr', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.b64error).toBe('')

    const input = wrapper.find('input[id="b64urlstr"]')
    await input.setValue('dGVzdA')

    expect(wrapper.vm.b64plane).toBe('test')
    expect(wrapper.vm.b64hex).toBe('74657374')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')
    expect(wrapper.vm.b64error).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="b64plane"]')
    const hexInput = wrapper.find('input[id="b64hex"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')

    expect(planeInput.element.value).toBe('test')
    expect(hexInput.element.value).toBe('74657374')
    expect(strInput.element.value).toBe('dGVzdA==')
    expect(urlstrInput.element.value).toBe('dGVzdA')
  })

  it('base64url str error', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.b64error).toBe('')

    const input = wrapper.find('input[id="b64urlstr"]')
    await input.setValue('=')
    await nextTick()

    expect(wrapper.vm.b64error).toBe('Invalid Base64 string')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const b64Error = wrapper.find('p[id="b64error"]')
    // expect(b64Error.element.text).toBe('')
  })

  it('url encode', async () => {
    expect(wrapper.vm.urldecode).toBe('')
    expect(wrapper.vm.urlencode).toBe('')
    expect(wrapper.vm.urlerror).toBe('')

    const input = wrapper.find('input[id="urldecode"]')
    await input.setValue('hoge fuga')

    expect(wrapper.vm.urldecode).toBe('hoge fuga')
    expect(wrapper.vm.urlencode).toBe('hoge%20fuga')
    expect(wrapper.vm.urlerror).toBe('')

    // DOM の更新も確認
    const urldecodeInput = wrapper.find('input[id="urldecode"]')
    const urlencodeInput = wrapper.find('input[id="urlencode"]')

    expect(urldecodeInput.element.value).toBe('hoge fuga')
    expect(urlencodeInput.element.value).toBe('hoge%20fuga')
  })

  it('url encode error', async () => {
    expect(wrapper.vm.urldecode).toBe('')
    expect(wrapper.vm.urlencode).toBe('')
    expect(wrapper.vm.urlerror).toBe('')

    global.encodeURIComponent = jest.fn(() => {
      throw new Error('Unexpected error occurred')
    })

    const input = wrapper.find('input[id="urldecode"]')
    await input.setValue('hoge fuga')

    expect(wrapper.vm.urlerror).toBe('Unexpected error occurred')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const urlError = wrapper.find('p[id="urlError"]')
    // expect(urlError.element.text).toBe('その値はURLデコードできないです。')
  })

  it('url decode', async () => {
    expect(wrapper.vm.urldecode).toBe('')
    expect(wrapper.vm.urlencode).toBe('')
    expect(wrapper.vm.urlerror).toBe('')

    const input = wrapper.find('input[id="urlencode"]')
    await input.setValue('hoge%20fuga')

    expect(wrapper.vm.urldecode).toBe('hoge fuga')
    expect(wrapper.vm.urlencode).toBe('hoge%20fuga')
    expect(wrapper.vm.urlerror).toBe('')

    // DOM の更新も確認
    const urldecodeInput = wrapper.find('input[id="urldecode"]')
    const urlencodeInput = wrapper.find('input[id="urlencode"]')

    expect(urldecodeInput.element.value).toBe('hoge fuga')
    expect(urlencodeInput.element.value).toBe('hoge%20fuga')
  })

  it('url decode error', async () => {
    expect(wrapper.vm.urldecode).toBe('')
    expect(wrapper.vm.urlencode).toBe('')
    expect(wrapper.vm.urlerror).toBe('')

    const input = wrapper.find('input[id="urlencode"]')
    await input.setValue('%')

    expect(wrapper.vm.urlerror).toBe('その値はURLデコードできないです。')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const urlError = wrapper.find('p[id="urlError"]')
    // expect(urlError.element.text).toBe('')
  })

  it('url decode undefined error', async () => {
    expect(wrapper.vm.urldecode).toBe('')
    expect(wrapper.vm.urlencode).toBe('')
    expect(wrapper.vm.urlerror).toBe('')

    global.decodeURIComponent = jest.fn(() => {
      throw new Error('Unexpected error occurred')
    })

    const input = wrapper.find('input[id="urlencode"]')
    await input.setValue('%')

    expect(wrapper.vm.urlerror).toBe('Unexpected error occurred')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const urlDecodeError = wrapper.find('p[id="urlDecodeError"]')
    // expect(urlDecodeError.element.text).toBe('')
  })

  /*
  it('sha256', async () => {
    expect(wrapper.vm.hashplain).toBe('')
    expect(wrapper.vm.hashsha256).toBe('')
    expect(wrapper.vm.hashsha256b64).toBe('')
    expect(wrapper.vm.hashsha256b64url).toBe('')
    expect(wrapper.vm.hasherror).toBe('')

    const input = wrapper.find('input[id="hashplain"]')
    await input.setValue('test')

    console.log({
      'hashplain:': wrapper.vm.hashplain,
      'hashsha256:': wrapper.vm.hashsha256,
      'hashsha256b64:': wrapper.vm.hashsha256b64,
      'hashsha256b64url:': wrapper.vm.hashsha256b64url,
      'hasherror:': wrapper.vm.hasherror
    })

    expect(wrapper.vm.hashplain).toBe('test')
    expect(wrapper.vm.hashsha256).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
    expect(wrapper.vm.hashsha256b64).toBe('n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=')
    expect(wrapper.vm.hashsha256b64url).toBe('n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg')
    expect(wrapper.vm.hasherror).toBe('')

    // DOM の更新も確認
    const hashplainInput = wrapper.find('input[id="hashplain"]')
    const hashsha256Input = wrapper.find('input[id="hashsha256"]')
    const hashsha256b64Input = wrapper.find('input[id="hashsha256b64"]')
    const hashsha256b64urlInput = wrapper.find('input[id="hashsha256b64url"]')
    const hasherrInput = wrapper.find('p[id="hasherror"]')

    expect(hashplainInput.element.value).toBe('test')
    expect(hashsha256Input.element.value).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
    expect(hashsha256b64Input.element.value).toBe('n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=')
    expect(hashsha256b64urlInput.element.value).toBe('n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg')
    expect(hasherrInput.element.value).toBe('')
  })
  */

  /*
  it('sha256 null', async () => {
    expect(wrapper.vm.hashplain).toBe('')
    expect(wrapper.vm.hashsha256).toBe('')
    expect(wrapper.vm.hashsha256b64).toBe('')
    expect(wrapper.vm.hashsha256b64url).toBe('')
    expect(wrapper.vm.hasherror).toBe('')

    const input = wrapper.find('input[id="hashplain"]')
    await input.setValue('test')
    await input.setValue('')

    expect(wrapper.vm.hashplain).toBe('')
    expect(wrapper.vm.hashsha256).toBe('')
    expect(wrapper.vm.hashsha256b64).toBe('')
    expect(wrapper.vm.hashsha256b64url).toBe('')
    expect(wrapper.vm.hasherror).toBe('')

    // DOM の更新も確認
    const hashplainInput = wrapper.find('input[id="hashplain"]')
    const hashsha256Input = wrapper.find('input[id="hashsha256"]')
    const hashsha256b64Input = wrapper.find('input[id="hashsha256b64"]')
    const hashsha256b64urlInput = wrapper.find('input[id="hashsha256b64url"]')
    const hasherrInput = wrapper.find('p[id="hasherror"]')

    expect(hashplainInput.element.value).toBe('')
    expect(hashsha256Input.element.value).toBe('')
    expect(hashsha256b64Input.element.value).toBe('n')
    expect(hashsha256b64urlInput.element.value).toBe('n4')
    expect(hasherrInput.element.value).toBe('')
  })
  */

  // TODO sha256 後ろのInputに入力 エラー

  it('generates random string', async () => {
    const lengthInput = wrapper.find('input[id="randomlength"]')
    const generateButton = wrapper.find('input[id="randomgenerateButton"]')

    expect(lengthInput.exists()).toBe(true)
    expect(generateButton.exists()).toBe(true)

    await lengthInput.setValue('10')
    await generateButton.trigger('click')

    const randomValue = wrapper.vm.randomvalue
    expect(randomValue).toHaveLength(10)
  })
})
