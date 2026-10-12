import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { invitation, propsFor } from '@/data/invitation'
import PageMap from './PageMap.vue'

describe('PageMap', () => {
  it('links to amap and the system map for the current device', () => {
    const wrapper = mount(PageMap, {
      props: {
        ...propsFor('map'),
        entered: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 14)',
      },
    })
    const links = wrapper.findAll('a')
    expect(links[0]?.attributes('href')).toBe(invitation.amapUrl)
    expect(links[1]?.attributes('href')).toBe(invitation.geoUrl)
    expect(links[0]?.attributes('target')).toBe('_blank')
    expect(links[0]?.attributes('rel')).toBe('noopener noreferrer')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toContain('上海市虹口区黄浦路199号')
  })
})
