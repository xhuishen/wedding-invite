import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PagePhoto from './PagePhoto.vue'

describe('PagePhoto', () => {
  it('frames the photo with a caption and a fly-in class', () => {
    const wrapper = mount(PagePhoto, { props: { ...propsFor('photo-1'), entered: true } })
    expect(wrapper.text()).toContain('图片展示区')
    expect(wrapper.text()).toContain('照片一')
    expect(wrapper.text()).toContain('此刻')
    expect(wrapper.text()).toContain('相视一笑')
    expect(wrapper.text()).toContain('把今天留给你们')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('.fly-left').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('婚礼流程')
  })
})
