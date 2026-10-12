import { describe, expect, it } from 'vitest'
import { frameScale } from './frameScale'

describe('frameScale', () => {
  it('caps the scale between 0.82 and 1', () => {
    expect(frameScale(844)).toBe(1)
    expect(frameScale(900)).toBe(1)
    expect(frameScale(760)).toBeCloseTo(760 / 844)
    expect(frameScale(400)).toBe(0.82)
  })
})
