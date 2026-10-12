import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageGallery from './PageGallery.vue'

describe('PageGallery', () => {
  it('renders six portrait placeholders', () => {
    const wrapper = mount(PageGallery, { props: { ...propsFor('gallery'), entered: true } })
    expect(wrapper.text()).toContain('照片一')
    expect(wrapper.text()).toContain('照片六')
    expect(wrapper.findAll('.aspect-\\[3\\/4\\]')).toHaveLength(6)
  })
})
