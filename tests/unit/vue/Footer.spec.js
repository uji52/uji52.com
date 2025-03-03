import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Footer from '@/components/Footer.vue'
import packageJson from '@/../package.json'

describe('Footer.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(Footer)
    await nextTick()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('displays correct version', () => {
    const versionText = wrapper.find('.text-body-secondary')
    expect(versionText.text()).toBe(`version: ${packageJson.version}`)
  })

  it('displays copyright text', () => {
    const copyright = wrapper.findAll('.text-body-secondary').at(1)
    expect(copyright.text()).toBe('© 2020 uji52')
  })

  it('has social media links', () => {
    const socialLinks = {
      github: 'https://github.com/uji52',
      twitter: 'https://x.com/uji52',
      instagram: 'https://www.instagram.com/uji52/',
      facebook: 'https://www.facebook.com/uji52/'
    }

    Object.entries(socialLinks).forEach(([platform, url]) => {
      const link = wrapper.find(`a[href="${url}"]`)
      expect(link.exists()).toBe(true)

      const icon = link.find(`use[xlink:href="#${platform}"]`)
      expect(icon.exists()).toBe(true)
    })
  })

  it('renders social media icons with correct dimensions', () => {
    const icons = wrapper.findAll('.bi')
    icons.forEach(icon => {
      expect(icon.attributes('width')).toBe('24')
      expect(icon.attributes('height')).toBe('24')
    })
  })

  it('contains all required social media icons', () => {
    const requiredIcons = ['github', 'twitter', 'instagram', 'facebook']
    const symbols = wrapper.findAll('symbol')

    requiredIcons.forEach(iconId => {
      const symbol = symbols.find(s => s.attributes('id') === iconId)
      expect(symbol.exists()).toBe(true)
      expect(symbol.attributes('viewBox')).toBe('0 0 16 16')
    })
  })
})
