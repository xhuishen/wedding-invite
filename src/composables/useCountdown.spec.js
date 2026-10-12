import { describe, expect, it } from 'vitest'
import { getCountdown } from './useCountdown'

const iso = '2026-10-18T11:18:00+08:00'
const invalidLabel = '2026年10月18日 11:18'

describe('getCountdown', () => {
  it('counts calendar days in Asia/Shanghai', () => {
    const result = getCountdown(iso, new Date('2026-10-12T16:00:00+08:00'), invalidLabel)
    expect(result).toEqual({ kind: 'days', label: '6' })
  })

  it('treats the ceremony date as today even before 11:18', () => {
    const result = getCountdown(iso, new Date('2026-10-18T00:30:00+08:00'), invalidLabel)
    expect(result).toEqual({ kind: 'today', label: '就是今天' })
  })

  it('marks the next Shanghai date as past', () => {
    const result = getCountdown(iso, new Date('2026-10-19T00:10:00+08:00'), invalidLabel)
    expect(result).toEqual({ kind: 'past', label: '婚礼已经开始' })
  })

  it('returns the invalid label when the iso cannot be parsed', () => {
    const result = getCountdown('not-a-date', new Date('2026-10-12T16:00:00+08:00'), invalidLabel)
    expect(result).toEqual({ kind: 'invalid', label: invalidLabel })
  })
})
