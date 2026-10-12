import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageCover from './PageCover.vue'

describe('PageCover', () => {
  it('shows the names, date, hint, and photo placeholder', () => {
    const wrapper = mount(PageCover, {
      props: { ...propsFor('cover'), entered: true },
    })
    expect(wrapper.text()).toContain('林知夏')
    expect(wrapper.text()).toContain('陈予安')
    expect(wrapper.text()).toContain('2026.10.18')
    expect(wrapper.text()).toContain('向上滑动，开启邀请函')
    expect(wrapper.text()).toContain('封面照片')
    expect(wrapper.text()).toContain('图片展示区')
  })
})
