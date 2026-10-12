import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Pager from './Pager.vue'

describe('Pager', () => {
  it('renders the cover and ten dots', () => {
    const wrapper = mount(Pager)
    expect(wrapper.text()).toContain('林知夏')
    expect(wrapper.text()).toContain('向上滑动，开启邀请函')
    expect(wrapper.findAll('button')).toHaveLength(10)
  })
})
