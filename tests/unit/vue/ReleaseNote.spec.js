import { mount } from '@vue/test-utils'
import ReleaseNote from '@/components/ReleaseNote.vue'

describe('ReleaseNote.vue', () => {
  it('renders welcome message', () => {
    const wrapper = mount(ReleaseNote)
    expect(wrapper.text()).toContain('Release Note')
  })
})