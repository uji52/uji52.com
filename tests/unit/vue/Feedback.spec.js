import { mount } from '@vue/test-utils'
import Feedback from '@/components/Feedback.vue'

describe('Feedback.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Feedback, {})
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders Feedback page', async () => {
    expect(wrapper.text()).toContain('機能要望等')
  })
})
