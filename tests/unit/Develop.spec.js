import { mount } from '@vue/test-utils'
import Develop from '@/components/Develop.vue'

describe('Develop.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Develop)
  })

  afterEach(() => {
    wrapper.unmount()
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