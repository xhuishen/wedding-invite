import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageInfo from './PageInfo.vue'

describe('PageInfo', () => {
  it('shows time and place without dress code or a photo slot', () => {
    const wrapper = mount(PageInfo, { props: { ...propsFor('info'), entered: true } })
    expect(wrapper.text()).toContain('2026年10月18日 11:18')
    expect(wrapper.text()).toContain('上海外滩茂悦大酒店')
    expect(wrapper.text()).toContain('浦江厅')
    expect(wrapper.text()).not.toContain('着装')
    expect(wrapper.text()).not.toContain('图片展示区')
  })
})
