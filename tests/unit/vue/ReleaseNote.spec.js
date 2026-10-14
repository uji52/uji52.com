import { mount } from '@vue/test-utils'
import ReleaseNote from '@/components/ReleaseNote.vue'

describe('ReleaseNote.vue', () => {
  it('renders welcome message', () => {
    const wrapper = mount(ReleaseNote)
    expect(wrapper.text()).toContain('Release Note')
  })

  it('renders latest release with version 2.1.0 and FIDO note', () => {
    const wrapper = mount(ReleaseNote)
    expect(wrapper.text()).toContain('2.1.0')
    expect(wrapper.text()).toContain('FIDO')
  })
})
