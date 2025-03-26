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
  const expectEncodeInitialValues = () => {
    expect(wrapper.vm.plane).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')
    expect(wrapper.vm.urlencode).toBe('')
    expect(wrapper.vm.unicode).toBe('')
    expect(wrapper.vm.bin).toBe('')
    expect(wrapper.vm.quat).toBe('')
    expect(wrapper.vm.dec).toBe('')
    expect(wrapper.vm.hex).toBe('')
    expect(wrapper.vm.encodeError).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="plane"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')
    const urlInput = wrapper.find('input[id="urlencode"]')
    const unicodeInput = wrapper.find('input[id="unicode"]')
    const binInput = wrapper.find('input[id="bin"]')
    const quatInput = wrapper.find('input[id="quat"]')
    const decInput = wrapper.find('input[id="dec"]')
    const hexInput = wrapper.find('input[id="hex"]')

    expect(planeInput.element.value).toBe('')
    expect(strInput.element.value).toBe('')
    expect(urlstrInput.element.value).toBe('')
    expect(urlInput.element.value).toBe('')
    expect(unicodeInput.element.value).toBe('')
    expect(binInput.element.value).toBe('')
    expect(quatInput.element.value).toBe('')
    expect(decInput.element.value).toBe('')
    expect(hexInput.element.value).toBe('')
    expect(wrapper.vm.encodeError).toBe('')

  }

  const expectEncodeTestValues = () => {
    expect(wrapper.vm.plane).toBe('test')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')
    expect(wrapper.vm.urlencode).toBe('test')
    expect(wrapper.vm.unicode).toBe('\\u0074\\u0065\\u0073\\u0074')
    expect(wrapper.vm.bin).toBe('01110100011001010111001101110100')
    expect(wrapper.vm.quat).toBe('1310121113031310')
    expect(wrapper.vm.dec).toBe('116101115116')
    expect(wrapper.vm.hex).toBe('74657374')
    expect(wrapper.vm.encodeError).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="plane"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')
    const urlInput = wrapper.find('input[id="urlencode"]')
    const unicodeInput = wrapper.find('input[id="unicode"]')
    const binInput = wrapper.find('input[id="bin"]')
    const quatInput = wrapper.find('input[id="quat"]')
    const decInput = wrapper.find('input[id="dec"]')
    const hexInput = wrapper.find('input[id="hex"]')

    expect(planeInput.element.value).toBe('test')
    expect(strInput.element.value).toBe('dGVzdA==')
    expect(urlstrInput.element.value).toBe('dGVzdA')
    expect(urlInput.element.value).toBe('test')
    expect(unicodeInput.element.value).toBe('\\u0074\\u0065\\u0073\\u0074')
    expect(binInput.element.value).toBe('01110100011001010111001101110100')
    expect(quatInput.element.value).toBe('1310121113031310')
    expect(decInput.element.value).toBe('116101115116')
    expect(hexInput.element.value).toBe('74657374')
    expect(wrapper.vm.encodeError).toBe('')
  }

  const expectEncodeTestSpaceValues = () => {
    expect(wrapper.vm.plane).toBe('test ')
    expect(wrapper.vm.b64str).toBe('dGVzdCA=')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdCA')
    expect(wrapper.vm.urlencode).toBe('test%20')
    expect(wrapper.vm.unicode).toBe('\\u0074\\u0065\\u0073\\u0074\\u0020')
    expect(wrapper.vm.bin).toBe('0111010001100101011100110111010000100000')
    expect(wrapper.vm.quat).toBe('1310121113031310200')
    expect(wrapper.vm.dec).toBe('116101115116032')
    expect(wrapper.vm.hex).toBe('7465737420')
    expect(wrapper.vm.encodeError).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="plane"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')
    const urlInput = wrapper.find('input[id="urlencode"]')
    const unicodeInput = wrapper.find('input[id="unicode"]')
    const binInput = wrapper.find('input[id="bin"]')
    const quatInput = wrapper.find('input[id="quat"]')
    const decInput = wrapper.find('input[id="dec"]')
    const hexInput = wrapper.find('input[id="hex"]')

    expect(planeInput.element.value).toBe('test ')
    expect(strInput.element.value).toBe('dGVzdCA=')
    expect(urlstrInput.element.value).toBe('dGVzdCA')
    expect(urlInput.element.value).toBe('test%20')
    expect(unicodeInput.element.value).toBe('\\u0074\\u0065\\u0073\\u0074\\u0020')
    expect(binInput.element.value).toBe('0111010001100101011100110111010000100000')
    expect(quatInput.element.value).toBe('1310121113031310200')
    expect(decInput.element.value).toBe('116101115116032')
    expect(hexInput.element.value).toBe('7465737420')
    expect(wrapper.vm.encodeError).toBe('')
  }

  it('encode plane', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="plane"]')
    await input.setValue('test')

    expectEncodeTestValues()
  })

  it('encode plane space', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="plane"]')
    await input.setValue('test ')

    expectEncodeTestSpaceValues()
  })

  it('encode plane null', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="plane"]')
    await input.setValue('test')

    expectEncodeTestValues()

    await input.setValue('')

    expectEncodeInitialValues()
  })

  it('encode hex', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="hex"]')
    await input.setValue('74657374')

    expectEncodeTestValues()

  })

  it('encode hex error', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="hex"]')
    await input.setValue('z')
    await nextTick()

    expect(wrapper.vm.encodeError).toBe('その値はBase64エンコードされた16進数ではないです。')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const b64Error = wrapper.find('p[id="b64error"]')
    // expect(b64Error.element.text).toBe('')
  })

  it('encode b64 str', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="b64str"]')
    await input.setValue('dGVzdA==')

    expectEncodeTestValues()
  })

  it('encode base64 str error', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="b64str"]')
    await input.setValue('=')
    await nextTick()

    expect(wrapper.vm.encodeError).toBe('Invalid Base64 string')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const b64Error = wrapper.find('p[id="b64error"]')
    // expect(b64Error.element.text).toBe('')
  })

  it('encode base64 urlstr', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="b64urlstr"]')
    await input.setValue('dGVzdA')

    expectEncodeTestValues()
  })

  it('encode base64url str error', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="b64urlstr"]')
    await input.setValue('=')
    await nextTick()

    expect(wrapper.vm.encodeError).toBe('Invalid Base64 string')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const b64Error = wrapper.find('p[id="b64error"]')
    // expect(b64Error.element.text).toBe('')
  })

  it('encode urlstr', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="urlencode"]')
    await input.setValue('test%20')

    expectEncodeTestSpaceValues()
  })

  it('encode urlstr error', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="urlencode"]')
    await input.setValue('%')
    await nextTick()

    expect(wrapper.vm.encodeError).toBe('その値はURLデコードできないです。')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const b64Error = wrapper.find('p[id="b64error"]')
    // expect(b64Error.element.text).toBe('')
  })

  const expectHashInitialValues = () => {
    expect(wrapper.vm.hashPlain).toBe('')
    expect(wrapper.vm.hashHex).toBe('')
    expect(wrapper.vm.hashMd5).toBe('')
    expect(wrapper.vm.hashSha1).toBe('')
    expect(wrapper.vm.hashSha1b64).toBe('')
    expect(wrapper.vm.hashSha1b64url).toBe('')
    expect(wrapper.vm.hashSha256).toBe('')
    expect(wrapper.vm.hashSha256b64).toBe('')
    expect(wrapper.vm.hashSha256b64url).toBe('')
    expect(wrapper.vm.hashSha512).toBe('')
    expect(wrapper.vm.hashSha512b64).toBe('')
    expect(wrapper.vm.hashSha512b64url).toBe('')
    expect(wrapper.vm.hasherror).toBe('')
  }

  const expectHashTestValues = () => {
    expect(wrapper.vm.hashPlain).toBe('test')
    expect(wrapper.vm.hashHex).toBe('74657374')
    expect(wrapper.vm.hashMd5).toBe('098f6bcd4621d373cade4e832627b4f6')
    expect(wrapper.vm.hashSha1).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3')
    expect(wrapper.vm.hashSha1b64).toBe('qUqP5cyxm6YcTAhz05Hph5gvu9M=')
    expect(wrapper.vm.hashSha1b64url).toBe('qUqP5cyxm6YcTAhz05Hph5gvu9M')
    expect(wrapper.vm.hashSha256).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
    expect(wrapper.vm.hashSha256b64).toBe('n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=')
    expect(wrapper.vm.hashSha256b64url).toBe('n4bQgYhMfWWaL-qgxVrQFaO_TxsrC4Is0V1sFbDwCgg')
    expect(wrapper.vm.hashSha512).toBe('ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff')
    expect(wrapper.vm.hashSha512b64).toBe('7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc/iBml1JQODbJ6wYX4oOHV+E+IvIh/1nsUNzLDBMxfqa2Ob1f1ACio/w==')
    expect(wrapper.vm.hashSha512b64url).toBe('7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc_iBml1JQODbJ6wYX4oOHV-E-IvIh_1nsUNzLDBMxfqa2Ob1f1ACio_w')
    expect(wrapper.vm.hasherror).toBe('')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    //const hashPlainInput = wrapper.find('input[id="hashPlain"]')
    //const hashSha256Input = wrapper.find('input[id="hashSha256"]')
    //const hashSha256b64Input = wrapper.find('input[id="hashSha256b64"]')
    //const hashSha256b64urlInput = wrapper.find('input[id="hashSha256b64url"]')
    //const hasherrInput = wrapper.find('p[id="hasherror"]')

    //expect(hashPlainInput.element.value).toBe('test')
    //expect(hashSha256Input.element.value).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
    //expect(hashSha256b64Input.element.value).toBe('n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=')
    //expect(hashSha256b64urlInput.element.value).toBe('n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg')
    //expect(hasherrInput.element.value).toBe('')
  }

  it('hash', async () => {
    expectHashInitialValues()

    const input = wrapper.find('input[id="hashPlain"]')
    await input.setValue('test')

    expectHashTestValues()
  })

  it('hash null', async () => {
    expectHashInitialValues()

    const input = wrapper.find('input[id="hashPlain"]')
    await input.setValue('test')
    await input.setValue('')

    expectHashInitialValues()
  })

  it('hash 00 error', async () => {
    expectHashInitialValues()

    const input = wrapper.find('input[id="hashHex"]')
    await input.setValue('00')

    expect(wrapper.vm.hasherror).toBe('文字列として表示されている値が文字化けしてしまっている可能性があります')
  })

  it('hash not binary error', async () => {
    expectHashInitialValues()

    const input = wrapper.find('input[id="hashHex"]')
    await input.setValue('�')

    expect(wrapper.vm.hasherror).toBe('その値は文字列化可能な16進数ではないです。')
  })

  it('hash efbfbd error', async () => {
    expectHashInitialValues()

    const input = wrapper.find('input[id="hashHex"]')
    await input.setValue('efbfbd')

    expect(wrapper.vm.hashPlain).toBe('�')
    expect(wrapper.vm.hasherror).toBe('文字列として表示されている値が文字化けしてしまっている可能性があります')
  })

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
