import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { withSetup } from '@/test/withSetup'
import { usePager } from './usePager'

describe('usePager', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function setup() {
    return withSetup(() => usePager()).result
  }

  it('moves forward and back inside 0..9', () => {
    const pager = setup()
    pager.next()
    expect(pager.index.value).toBe(1)
    expect(pager.direction.value).toBe('forward')
    vi.advanceTimersByTime(700)
    pager.prev()
    expect(pager.index.value).toBe(0)
    expect(pager.direction.value).toBe('back')
  })

  it('does not move past either end', () => {
    const pager = setup()
    pager.prev()
    expect(pager.index.value).toBe(0)
    pager.go(9)
    vi.advanceTimersByTime(700)
    pager.next()
    expect(pager.index.value).toBe(9)
  })

  it('ignores input while locked', () => {
    const pager = setup()
    pager.next()
    pager.go(5)
    expect(pager.index.value).toBe(1)
    vi.advanceTimersByTime(700)
    pager.go(5)
    expect(pager.index.value).toBe(5)
    expect(pager.direction.value).toBe('forward')
  })

  it('swipes to the next page only for a clear upward move', () => {
    const pager = setup()
    pager.onTouchStart(0, 100)
    pager.onTouchEnd(0, 52)
    expect(pager.index.value).toBe(0)
    pager.onTouchStart(0, 100)
    pager.onTouchEnd(80, 40)
    expect(pager.index.value).toBe(0)
    pager.onTouchStart(0, 100)
    pager.onTouchEnd(0, 40)
    expect(pager.index.value).toBe(1)
  })

  it('swipes down to the previous page', () => {
    const pager = setup()
    pager.next()
    vi.advanceTimersByTime(700)
    pager.onTouchStart(0, 0)
    pager.onTouchEnd(0, 60)
    expect(pager.index.value).toBe(0)
    expect(pager.direction.value).toBe('back')
  })

  it('uses wheel delta past 40', () => {
    const pager = setup()
    pager.onWheel(40)
    expect(pager.index.value).toBe(0)
    pager.onWheel(41)
    expect(pager.index.value).toBe(1)
  })

  it('prevents default for paging keys and ignores other keys', () => {
    const pager = setup()
    const preventDefault = vi.fn()
    pager.onKeyDown('a', preventDefault)
    expect(preventDefault).not.toHaveBeenCalled()
    pager.onKeyDown(' ', preventDefault)
    expect(preventDefault).toHaveBeenCalledOnce()
    expect(pager.index.value).toBe(1)
  })
})
