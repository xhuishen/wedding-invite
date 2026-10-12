import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Pager from './Pager.vue'

describe('Pager', () => {
  it('renders the cover stub and ten dots', () => {
    const wrapper = mount(Pager)
    expect(wrapper.find('[data-page="cover"]').exists()).toBe(true)
    expect(wrapper.findAll('button')).toHaveLength(10)
  })
})
