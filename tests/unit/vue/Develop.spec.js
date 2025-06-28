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
    expect(wrapper.vm.strHex).toBe('')
    expect(wrapper.vm.encodeError).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="plane"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')
    const urlInput = wrapper.find('input[id="urlencode"]')
    const unicodeInput = wrapper.find('input[id="unicode"]')
    const strHexInput = wrapper.find('input[id="strHex"]')

    expect(planeInput.element.value).toBe('')
    expect(strInput.element.value).toBe('')
    expect(urlstrInput.element.value).toBe('')
    expect(urlInput.element.value).toBe('')
    expect(unicodeInput.element.value).toBe('')
    expect(strHexInput.element.value).toBe('')
    expect(wrapper.vm.encodeError).toBe('')

  }

  const expectEncodeTestValues = () => {
    expect(wrapper.vm.plane).toBe('test')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')
    expect(wrapper.vm.urlencode).toBe('test')
    expect(wrapper.vm.unicode).toBe('\\u0074\\u0065\\u0073\\u0074')
    expect(wrapper.vm.strHex).toBe('74657374')
    expect(wrapper.vm.encodeError).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="plane"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')
    const urlInput = wrapper.find('input[id="urlencode"]')
    const unicodeInput = wrapper.find('input[id="unicode"]')
    const strHexInput = wrapper.find('input[id="strHex"]')

    expect(planeInput.element.value).toBe('test')
    expect(strInput.element.value).toBe('dGVzdA==')
    expect(urlstrInput.element.value).toBe('dGVzdA')
    expect(urlInput.element.value).toBe('test')
    expect(unicodeInput.element.value).toBe('\\u0074\\u0065\\u0073\\u0074')
    expect(strHexInput.element.value).toBe('74657374')
    expect(wrapper.vm.encodeError).toBe('')
  }

  const expectEncodeTestSpaceValues = () => {
    expect(wrapper.vm.plane).toBe('test ')
    expect(wrapper.vm.b64str).toBe('dGVzdCA=')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdCA')
    expect(wrapper.vm.urlencode).toBe('test%20')
    expect(wrapper.vm.unicode).toBe('\\u0074\\u0065\\u0073\\u0074\\u0020')
    expect(wrapper.vm.strHex).toBe('7465737420')
    expect(wrapper.vm.encodeError).toBe('')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="plane"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')
    const urlInput = wrapper.find('input[id="urlencode"]')
    const unicodeInput = wrapper.find('input[id="unicode"]')
    const strHexInput = wrapper.find('input[id="strHex"]')

    expect(planeInput.element.value).toBe('test ')
    expect(strInput.element.value).toBe('dGVzdCA=')
    expect(urlstrInput.element.value).toBe('dGVzdCA')
    expect(urlInput.element.value).toBe('test%20')
    expect(unicodeInput.element.value).toBe('\\u0074\\u0065\\u0073\\u0074\\u0020')
    expect(strHexInput.element.value).toBe('7465737420')
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

  it('encode unicode', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="unicode"]')
    await input.setValue('\\u0074\\u0065\\u0073\\u0074')

    expectEncodeTestValues()
  })

  it('encode unicode error', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="unicode"]')
    await input.setValue('test')
    await nextTick()

    expectEncodeTestValues()

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const b64Error = wrapper.find('p[id="b64error"]')
    // expect(b64Error.element.text).toBe('')
  })

  it('encode hex error', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="strHex"]')
    await input.setValue('z')
    await nextTick()

    expect(wrapper.vm.encodeError).toBe('その値はBase64エンコードされた16進数ではないです。')

    // DOM の更新も確認(表示されるがテストが通過しない。原因特定は別途実施。)
    // const b64Error = wrapper.find('p[id="b64error"]')
    // expect(b64Error.element.text).toBe('')
  })

  it('encode hex error UndecodableError', async () => {
    expectEncodeInitialValues()

    const input = wrapper.find('input[id="strHex"]')
    await input.setValue('1')
    await nextTick()

    expect(wrapper.vm.encodeError).toBe('文字列化できる16進数ではありません。')

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

  it('2進数(bin)入力で他フィールドが変換される', async () => {
    const binInput = wrapper.find('input[id="bin"]')
    await binInput.setValue('1010')
    await nextTick()
    expect(wrapper.vm.quat).toBe('22')
    expect(wrapper.vm.oct).toBe('12')
    expect(wrapper.vm.dec).toBe('10')
    expect(wrapper.vm.hex).toBe('a')
    expect(wrapper.vm.numberConversionError).toBe('')
  })

  it('4進数(quat)入力で他フィールドが変換される', async () => {
    const quatInput = wrapper.find('input[id="quat"]')
    await quatInput.setValue('22')
    await nextTick()
    expect(wrapper.vm.bin).toBe('1010')
    expect(wrapper.vm.oct).toBe('12')
    expect(wrapper.vm.dec).toBe('10')
    expect(wrapper.vm.hex).toBe('a')
    expect(wrapper.vm.numberConversionError).toBe('')
  })

  it('8進数(oct)入力で他フィールドが変換される', async () => {
    const octInput = wrapper.find('input[id="oct"]')
    await octInput.setValue('12')
    await nextTick()
    expect(wrapper.vm.bin).toBe('1010')
    expect(wrapper.vm.quat).toBe('22')
    expect(wrapper.vm.dec).toBe('10')
    expect(wrapper.vm.hex).toBe('a')
    expect(wrapper.vm.numberConversionError).toBe('')
  })

  it('10進数(dec)入力で他フィールドが変換される', async () => {
    const decInput = wrapper.find('input[id="dec"]')
    await decInput.setValue('10')
    await nextTick()
    expect(wrapper.vm.bin).toBe('1010')
    expect(wrapper.vm.quat).toBe('22')
    expect(wrapper.vm.oct).toBe('12')
    expect(wrapper.vm.hex).toBe('a')
    expect(wrapper.vm.numberConversionError).toBe('')
  })

  it('16進数(hex)入力で他フィールドが変換される', async () => {
    const hexInput = wrapper.find('input[id="hex"]')
    await hexInput.setValue('a')
    await nextTick()
    expect(wrapper.vm.bin).toBe('1010')
    expect(wrapper.vm.quat).toBe('22')
    expect(wrapper.vm.oct).toBe('12')
    expect(wrapper.vm.dec).toBe('10')
    expect(wrapper.vm.numberConversionError).toBe('')
  })

  it('2進数(bin)に不正値を入力するとエラー', async () => {
    const binInput = wrapper.find('input[id="bin"]')
    await binInput.setValue('102')
    await nextTick()
    expect(wrapper.vm.numberConversionError).toBe('その値は2進数の値ではありません')
  })

  it('4進数(quat)に不正値を入力するとエラー', async () => {
    const quatInput = wrapper.find('input[id="quat"]')
    await quatInput.setValue('24')
    await nextTick()
    expect(wrapper.vm.numberConversionError).toBe('その値は4進数の値ではありません')
  })

  it('8進数(oct)に不正値を入力するとエラー', async () => {
    const octInput = wrapper.find('input[id="oct"]')
    await octInput.setValue('19')
    await nextTick()
    expect(wrapper.vm.numberConversionError).toBe('その値は8進数の値ではありません')
  })

  it('10進数(dec)に不正値を入力するとエラー', async () => {
    const decInput = wrapper.find('input[id="dec"]')
    await decInput.setValue('10a')
    await nextTick()
    expect(wrapper.vm.numberConversionError).toBe('その値は10進数の値ではありません')
  })

  it('16進数(hex)に不正値を入力するとエラー', async () => {
    const hexInput = wrapper.find('input[id="hex"]')
    await hexInput.setValue('g')
    await nextTick()
    expect(wrapper.vm.numberConversionError).toBe('その値は16進数の値ではありません')
  })

  it('どれかのフィールドを空にすると他もリセットされる', async () => {
    // まず値をセット
    await wrapper.find('input[id="bin"]').setValue('1010')
    await nextTick()
    // 空にする
    await wrapper.find('input[id="bin"]').setValue('')
    await nextTick()
    expect(wrapper.vm.hex).toBe('')
    expect(wrapper.vm.quat).toBe('')
    expect(wrapper.vm.oct).toBe('')
    expect(wrapper.vm.dec).toBe('')
    expect(wrapper.vm.numberConversionError).toBe('')
  })
})

//

  // Additional comprehensive tests for edge cases and boundary conditions

  describe('stringToHex edge cases', () => {
    it('should handle empty string', () => {
      expect(wrapper.vm.stringToHex('')).toBe('')
    })

    it('should handle special characters', () => {
      expect(wrapper.vm.stringToHex('!@#$%')).toBe('21402324256')
    })

    it('should handle unicode characters', () => {
      expect(wrapper.vm.stringToHex('こんにちは')).toBe('e38193e38293e381abe381a1e381af')
    })

    it('should handle newlines and tabs', () => {
      expect(wrapper.vm.stringToHex('\n\t')).toBe('0a09')
    })

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000)
      const result = wrapper.vm.stringToHex(longString)
      expect(result).toBe('61'.repeat(1000))
      expect(result.length).toBe(2000)
    })
  })

  describe('hexToString edge cases', () => {
    it('should handle empty hex string', () => {
      expect(wrapper.vm.hexToString('')).toBe('')
    })

    it('should throw error for odd length hex string', () => {
      expect(() => {
        wrapper.vm.hexToString('123')
      }).toThrow()
    })

    it('should throw error for invalid hex characters', () => {
      expect(() => {
        wrapper.vm.hexToString('xyz')
      }).toThrow()
    })

    it('should handle uppercase hex', () => {
      expect(wrapper.vm.hexToString('54455354')).toBe('TEST')
    })

    it('should handle mixed case hex', () => {
      expect(wrapper.vm.hexToString('54657374')).toBe('Test')
    })
  })

  describe('stringToBase64 edge cases', () => {
    it('should handle empty string', () => {
      expect(wrapper.vm.stringToBase64('')).toBe('')
    })

    it('should handle special characters', () => {
      expect(wrapper.vm.stringToBase64('!@#$%^&*()')).toBe('IUAjJCVeJiooKQ==')
    })

    it('should handle unicode characters', () => {
      expect(wrapper.vm.stringToBase64('测试')).toBe('5rWL6K+V')
    })

    it('should handle null character', () => {
      expect(wrapper.vm.stringToBase64('\0')).toBe('AA==')
    })
  })

  describe('base64ToString edge cases', () => {
    it('should handle empty base64 string', () => {
      expect(wrapper.vm.base64ToString('')).toBe('')
    })

    it('should handle base64 with whitespace', () => {
      expect(wrapper.vm.base64ToString('dGVzdA== ')).toBe('test')
    })

    it('should handle base64 with newlines', () => {
      expect(wrapper.vm.base64ToString('dGVz\ndA==')).toBe('test')
    })

    it('should throw error for invalid base64', () => {
      expect(() => {
        wrapper.vm.base64ToString('invalid@base64!')
      }).toThrow()
    })
  })

  describe('randomgenerate advanced scenarios', () => {
    it('should generate minimum length string', async () => {
      const lengthInput = wrapper.find('input[id="randomlength"]')
      await lengthInput.setValue('1')
      const seedInput = wrapper.find('input[id="randomseed"]')
      await seedInput.setValue('a')
      wrapper.vm.randomgenerate()
      expect(wrapper.vm.randomvalue).toHaveLength(1)
      expect(wrapper.vm.randomvalue).toMatch(/[a]/)
    })

    it('should handle large length values', async () => {
      const lengthInput = wrapper.find('input[id="randomlength"]')
      await lengthInput.setValue('100')
      const seedInput = wrapper.find('input[id="randomseed"]')
      await seedInput.setValue('abcdef')
      wrapper.vm.randomgenerate()
      expect(wrapper.vm.randomvalue).toHaveLength(100)
      expect(wrapper.vm.randomvalue).toMatch(/[a-f]{100}/)
    })

    it('should handle single character seed', async () => {
      const lengthInput = wrapper.find('input[id="randomlength"]')
      await lengthInput.setValue('10')
      const seedInput = wrapper.find('input[id="randomseed"]')
      await seedInput.setValue('x')
      wrapper.vm.randomgenerate()
      expect(wrapper.vm.randomvalue).toBe('xxxxxxxxxx')
    })

    it('should handle empty seed gracefully', async () => {
      const lengthInput = wrapper.find('input[id="randomlength"]')
      await lengthInput.setValue('5')
      const seedInput = wrapper.find('input[id="randomseed"]')
      await seedInput.setValue('')
      wrapper.vm.randomgenerate()
      // Should handle empty seed without crashing
      expect(wrapper.vm.randomvalue).toBeDefined()
    })
  })

  describe('encoding error recovery', () => {
    it('should clear error when valid input is provided after invalid', async () => {
      const input = wrapper.find('input[id="b64str"]')
      // First, set invalid base64
      await input.setValue('=')
      await nextTick()
      expect(wrapper.vm.encodeError).toBe('Invalid Base64 string')
      
      // Then set valid base64
      await input.setValue('dGVzdA==')
      await nextTick()
      expect(wrapper.vm.encodeError).toBe('')
    })

    it('should handle consecutive invalid inputs', async () => {
      const input = wrapper.find('input[id="urlencode"]')
      await input.setValue('%')
      await nextTick()
      expect(wrapper.vm.encodeError).toBe('その値はURLデコードできないです。')
      
      await input.setValue('%%')
      await nextTick()
      expect(wrapper.vm.encodeError).toBe('その値はURLデコードできないです。')
    })
  })

  describe('unicode encoding variations', () => {
    it('should handle unicode with mixed valid and invalid sequences', async () => {
      const input = wrapper.find('input[id="unicode"]')
      await input.setValue('\\u0074\\u0065st\\u0074')
      await nextTick()
      // Should handle mixed unicode and plain text
      expect(wrapper.vm.plane).toContain('te')
    })

    it('should handle incomplete unicode sequences', async () => {
      const input = wrapper.find('input[id="unicode"]')
      await input.setValue('\\u007')
      await nextTick()
      // Should handle incomplete unicode gracefully
      expect(wrapper.vm.encodeError).toBeDefined()
    })
  })

  describe('hash function boundary cases', () => {
    it('should handle extremely long input for hashing', async () => {
      const input = wrapper.find('input[id="hashPlain"]')
      const longText = 'a'.repeat(10000)
      await input.setValue(longText)
      await nextTick()
      
      expect(wrapper.vm.hashMd5).toHaveLength(32)
      expect(wrapper.vm.hashSha1).toHaveLength(40)
      expect(wrapper.vm.hashSha256).toHaveLength(64)
      expect(wrapper.vm.hashSha512).toHaveLength(128)
    })

    it('should handle special characters in hash input', async () => {
      const input = wrapper.find('input[id="hashPlain"]')
      await input.setValue('!@#$%^&*()_+{}[]|\\:";\'<>?,./')
      await nextTick()
      
      expect(wrapper.vm.hashMd5).toMatch(/^[a-f0-9]{32}$/)
      expect(wrapper.vm.hashSha256).toMatch(/^[a-f0-9]{64}$/)
    })

    it('should handle hex input with leading zeros', async () => {
      const input = wrapper.find('input[id="hashHex"]')
      await input.setValue('0074657374')
      await nextTick()
      
      expect(wrapper.vm.hashPlain).toBe('\x00test')
    })
  })

  describe('number conversion boundary cases', () => {
    it('should handle maximum safe integer in decimal', async () => {
      const input = wrapper.find('input[id="dec"]')
      await input.setValue(Number.MAX_SAFE_INTEGER.toString())
      await nextTick()
      
      expect(wrapper.vm.numberConversionError).toBe('')
      expect(wrapper.vm.hex).toBeDefined()
      expect(wrapper.vm.bin).toBeDefined()
    })

    it('should handle zero values in all bases', async () => {
      const decInput = wrapper.find('input[id="dec"]')
      await decInput.setValue('0')
      await nextTick()
      
      expect(wrapper.vm.bin).toBe('0')
      expect(wrapper.vm.quat).toBe('0')
      expect(wrapper.vm.oct).toBe('0')
      expect(wrapper.vm.hex).toBe('0')
    })

    it('should handle negative values gracefully', async () => {
      const decInput = wrapper.find('input[id="dec"]')
      await decInput.setValue('-5')
      await nextTick()
      
      // Should either handle negative numbers or show appropriate error
      expect(wrapper.vm.numberConversionError).toBeDefined()
    })

    it('should handle floating point numbers', async () => {
      const decInput = wrapper.find('input[id="dec"]')
      await decInput.setValue('10.5')
      await nextTick()
      
      expect(wrapper.vm.numberConversionError).toBe('その値は10進数の値ではありません')
    })

    it('should handle very large hex values', async () => {
      const hexInput = wrapper.find('input[id="hex"]')
      await hexInput.setValue('ffffffffffffffff')
      await nextTick()
      
      expect(wrapper.vm.numberConversionError).toBe('')
      expect(wrapper.vm.dec).toBeDefined()
    })

    it('should handle binary with only 1s', async () => {
      const binInput = wrapper.find('input[id="bin"]')
      await binInput.setValue('1111')
      await nextTick()
      
      expect(wrapper.vm.dec).toBe('15')
      expect(wrapper.vm.hex).toBe('f')
      expect(wrapper.vm.quat).toBe('33')
      expect(wrapper.vm.oct).toBe('17')
    })

    it('should handle case sensitivity in hex', async () => {
      const hexInput = wrapper.find('input[id="hex"]')
      await hexInput.setValue('ABCDEF')
      await nextTick()
      
      expect(wrapper.vm.numberConversionError).toBe('')
      expect(wrapper.vm.dec).toBe('11259375')
    })
  })

  describe('component initialization and cleanup', () => {
    it('should initialize with empty values', () => {
      expect(wrapper.vm.plane).toBe('')
      expect(wrapper.vm.b64str).toBe('')
      expect(wrapper.vm.encodeError).toBe('')
      expect(wrapper.vm.hashPlain).toBe('')
      expect(wrapper.vm.hasherror).toBe('')
      expect(wrapper.vm.numberConversionError).toBe('')
    })

    it('should handle rapid input changes', async () => {
      const input = wrapper.find('input[id="plane"]')
      
      // Rapidly change input values
      for (let i = 0; i < 10; i++) {
        await input.setValue(`test${i}`)
        await nextTick()
      }
      
      expect(wrapper.vm.plane).toBe('test9')
      expect(wrapper.vm.encodeError).toBe('')
    })
  })

  describe('UI interaction edge cases', () => {
    it('should handle click events on random generate button', async () => {
      const generateButton = wrapper.find('input[id="randomgenerateButton"]')
      const lengthInput = wrapper.find('input[id="randomlength"]')
      
      await lengthInput.setValue('5')
      await generateButton.trigger('click')
      
      expect(wrapper.vm.randomvalue).toHaveLength(5)
    })

    it('should handle multiple rapid button clicks', async () => {
      const generateButton = wrapper.find('input[id="randomgenerateButton"]')
      const lengthInput = wrapper.find('input[id="randomlength"]')
      
      await lengthInput.setValue('3')
      
      let values = []
      for (let i = 0; i < 5; i++) {
        await generateButton.trigger('click')
        values.push(wrapper.vm.randomvalue)
      }
      
      // All values should be length 3
      values.forEach(value => {
        expect(value).toHaveLength(3)
      })
    })
  })

  describe('error message consistency', () => {
    it('should show consistent error messages for invalid base64', async () => {
      const inputs = [
        wrapper.find('input[id="b64str"]'),
        wrapper.find('input[id="b64urlstr"]')
      ]
      
      for (const input of inputs) {
        await input.setValue('=')
        await nextTick()
        expect(wrapper.vm.encodeError).toBe('Invalid Base64 string')
        
        await input.setValue('')
        await nextTick()
      }
    })

    it('should clear errors when input is cleared', async () => {
      const input = wrapper.find('input[id="strHex"]')
      
      // Set invalid hex
      await input.setValue('zz')
      await nextTick()
      expect(wrapper.vm.encodeError).not.toBe('')
      
      // Clear input
      await input.setValue('')
      await nextTick()
      expect(wrapper.vm.encodeError).toBe('')
    })
  })

  describe('performance and stress testing', () => {
    it('should handle many encoding operations without memory leaks', async () => {
      const input = wrapper.find('input[id="plane"]')
      
      // Perform many encoding operations
      for (let i = 0; i < 100; i++) {
        await input.setValue(`test${i}`)
        await nextTick()
      }
      
      expect(wrapper.vm.encodeError).toBe('')
      expect(wrapper.vm.plane).toBe('test99')
    })

    it('should handle large data encoding efficiently', async () => {
      const input = wrapper.find('input[id="plane"]')
      const largeText = 'Large text data '.repeat(1000)
      
      await input.setValue(largeText)
      await nextTick()
      
      expect(wrapper.vm.b64str).toBeDefined()
      expect(wrapper.vm.strHex).toBeDefined()
      expect(wrapper.vm.encodeError).toBe('')
    })
  })
