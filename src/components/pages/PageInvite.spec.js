import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageInvite from './PageInvite.vue'

describe('PageInvite', () => {
  it('shows the four invitation lines and the landscape slot', () => {
    const wrapper = mount(PageInvite, {
      props: { ...propsFor('invite'), entered: true },
    })
    expect(wrapper.text()).toContain('谨订于')
    expect(wrapper.text()).toContain('恭备薄酌')
    expect(wrapper.text()).toContain('邀请函配图')
  })
})
