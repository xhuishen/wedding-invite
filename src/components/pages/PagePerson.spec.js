import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PagePerson from './PagePerson.vue'

describe('PagePerson', () => {
  it('places the groom photo before the copy', () => {
    const wrapper = mount(PagePerson, {
      props: { ...propsFor('groom'), entered: true },
    })
    expect(wrapper.text()).toContain('新郎')
    expect(wrapper.text()).toContain('把日子过成想一起走的路')
    expect(wrapper.classes()).toContain('flex-row')
  })

  it('mirrors the bride layout', () => {
    const wrapper = mount(PagePerson, {
      props: { ...propsFor('bride'), entered: true },
    })
    expect(wrapper.text()).toContain('新娘')
    expect(wrapper.classes()).toContain('flex-row-reverse')
  })
})
