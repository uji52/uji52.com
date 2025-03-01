import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Develop from '@/components/Develop.vue'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

describe('Develop.vue', () => {
  let wrapper

  beforeEach(async() => {
    wrapper = mount(Develop)
    await nextTick()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // functions
  it('base64 encode (plain => base64hex)', () => {
    expect(wrapper.vm.stringToHex('test')).toBe('74657374')
  })

  it('base64 dencode (base64hex => string)', () => {
    expect(wrapper.vm.hexToString('74657374')).toBe('test')
  })

  it('base64 encode (plain => base64str)', () => {
    expect(wrapper.vm.stringToBase64('test')).toBe('dGVzdA==')
  })

  it('base64 decode (base64str => plain)', () => {
    expect(wrapper.vm.base64ToString('dGVzdA==')).toBe('test')
    expect(wrapper.vm.base64ToString('dGVzdA')).toBe('test')
  })

  it('random generator', async() => {
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

    const input = wrapper.find('input[id="b64plane"]')
    await input.setValue('test')

    expect(wrapper.vm.b64hex).toBe('74657374')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')

    // DOM の更新も確認
    const hexInput = wrapper.find('input[id="b64hex"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')

    expect(hexInput.element.value).toBe('74657374')
    expect(strInput.element.value).toBe('dGVzdA==')
    expect(urlstrInput.element.value).toBe('dGVzdA')
  })

  it('base64 hex', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')

    const input = wrapper.find('input[id="b64hex"]')
    await input.setValue('74657374')

    expect(wrapper.vm.b64plane).toBe('test')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="b64plane"]')
    const strInput = wrapper.find('input[id="b64str"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')

    expect(planeInput.element.value).toBe('test')
    expect(strInput.element.value).toBe('dGVzdA==')
    expect(urlstrInput.element.value).toBe('dGVzdA')
  })

  it('base64 str', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')

    const input = wrapper.find('input[id="b64str"]')
    await input.setValue('dGVzdA==')

    expect(wrapper.vm.b64plane).toBe('test')
    expect(wrapper.vm.b64hex).toBe('74657374')
    expect(wrapper.vm.b64urlstr).toBe('dGVzdA')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="b64plane"]')
    const hexInput = wrapper.find('input[id="b64hex"]')
    const urlstrInput = wrapper.find('input[id="b64urlstr"]')

    expect(planeInput.element.value).toBe('test')
    expect(hexInput.element.value).toBe('74657374')
    expect(urlstrInput.element.value).toBe('dGVzdA')
  })

  it('base64 urlstr', async () => {
    expect(wrapper.vm.b64plane).toBe('')
    expect(wrapper.vm.b64hex).toBe('')
    expect(wrapper.vm.b64str).toBe('')
    expect(wrapper.vm.b64urlstr).toBe('')

    const input = wrapper.find('input[id="b64urlstr"]')
    await input.setValue('dGVzdA')

    expect(wrapper.vm.b64plane).toBe('test')
    expect(wrapper.vm.b64hex).toBe('74657374')
    expect(wrapper.vm.b64str).toBe('dGVzdA==')

    // DOM の更新も確認
    const planeInput = wrapper.find('input[id="b64plane"]')
    const hexInput = wrapper.find('input[id="b64hex"]')
    const strInput = wrapper.find('input[id="b64str"]')

    expect(planeInput.element.value).toBe('test')
    expect(hexInput.element.value).toBe('74657374')
    expect(strInput.element.value).toBe('dGVzdA==')
  })

  it('url encode', async () => {
    expect(wrapper.vm.urldecode).toBe('')
    expect(wrapper.vm.urlencode).toBe('')

    const input = wrapper.find('input[id="urldecode"]')
    await input.setValue('hoge fuga')

    expect(wrapper.vm.urlencode).toBe('hoge%20fuga')

    // DOM の更新も確認
    const urlencodeInput = wrapper.find('input[id="urlencode"]')

    expect(urlencodeInput.element.value).toBe('hoge%20fuga')
  })

  it('url decode', async () => {
    expect(wrapper.vm.urldecode).toBe('')
    expect(wrapper.vm.urlencode).toBe('')

    const input = wrapper.find('input[id="urlencode"]')
    await input.setValue('hoge%20fuga')

    expect(wrapper.vm.urldecode).toBe('hoge fuga')

    // DOM の更新も確認
    const urldecodeInput = wrapper.find('input[id="urldecode"]')

    expect(urldecodeInput.element.value).toBe('hoge fuga')
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
