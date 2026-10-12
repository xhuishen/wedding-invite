import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageCountdown from './PageCountdown.vue'

describe('PageCountdown', () => {
  it('shows the day count and the note', () => {
    const wrapper = mount(PageCountdown, {
      props: {
        ...propsFor('countdown'),
        entered: true,
        now: new Date('2026-10-12T16:00:00+08:00'),
      },
    })
    expect(wrapper.text()).toContain('6')
    expect(wrapper.text()).toContain('天')
    expect(wrapper.text()).toContain('愿你出席，见证这个日子')
  })

  it('shows the invalid label without a day unit', () => {
    const wrapper = mount(PageCountdown, {
      props: {
        ...propsFor('countdown'),
        ceremonyIso: 'not-a-date',
        entered: true,
        now: new Date('2026-10-12T16:00:00+08:00'),
      },
    })
    expect(wrapper.text()).toContain('2026年10月18日 11:18')
    expect(wrapper.text()).not.toContain('天')
  })
})
