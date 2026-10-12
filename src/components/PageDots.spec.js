import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageDots from './PageDots.vue'

describe('PageDots', () => {
  it('marks the current page and emits the clicked index', async () => {
    const wrapper = mount(PageDots, { props: { count: 10, current: 2 } })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(10)
    expect(buttons[2]?.attributes('aria-current')).toBe('true')
    await buttons[4]?.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([4])
  })
})
