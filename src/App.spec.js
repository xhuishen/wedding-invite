import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.vue'
import { invitation } from './data/invitation'

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens on the cover and reaches the map from the last dot', async () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('林知夏')
    expect(wrapper.text()).toContain('向上滑动，开启邀请函')
    vi.advanceTimersByTime(700)
    const dots = wrapper.findAll('button')
    expect(dots).toHaveLength(9)
    await dots[8]?.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('上海外滩茂悦大酒店')
    expect(wrapper.find('a').attributes('href')).toBe(invitation.amapUrl)
  })
})
