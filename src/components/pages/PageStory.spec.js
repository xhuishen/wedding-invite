import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageStory from './PageStory.vue'

describe('PageStory', () => {
  it('shows three beats and their photo labels', () => {
    const wrapper = mount(PageStory, { props: { ...propsFor('story'), entered: true } })
    expect(wrapper.text()).toContain('一场朋友的晚饭')
    expect(wrapper.text()).toContain('在江边说好以后')
    expect(wrapper.text()).toContain('请你来吃这顿饭')
    expect(wrapper.text()).toContain('初见')
    expect(wrapper.findAll('.aspect-square')).toHaveLength(3)
  })
})
