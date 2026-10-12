import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageSchedule from './PageSchedule.vue'

describe('PageSchedule', () => {
  it('lists four events and no photo slot', () => {
    const wrapper = mount(PageSchedule, { props: { ...propsFor('schedule'), entered: true } })
    expect(wrapper.text()).toContain('10:30')
    expect(wrapper.text()).toContain('合影送客')
    expect(wrapper.text()).not.toContain('图片展示区')
  })
})
