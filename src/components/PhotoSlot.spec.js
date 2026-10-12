import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PhotoSlot from './PhotoSlot.vue'

describe('PhotoSlot', () => {
  it('shows the placeholder label when there is no src', () => {
    const wrapper = mount(PhotoSlot, {
      props: { photo: { id: 'cover', label: '封面照片', ratio: 'portrait' } },
    })
    expect(wrapper.text()).toContain('图片展示区')
    expect(wrapper.text()).toContain('封面照片')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.classes().join(' ')).toContain('aspect-[3/4]')
  })

  it('falls back to the placeholder when the image errors', async () => {
    const wrapper = mount(PhotoSlot, {
      props: { photo: { id: 'cover', label: '封面照片', ratio: 'portrait', src: '/photos/cover.webp' } },
    })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('图片展示区')
  })
})
