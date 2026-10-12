function shanghaiDayNumber(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const year = Number(parts.find((part) => part.type === 'year')?.value)
  const month = Number(parts.find((part) => part.type === 'month')?.value)
  const day = Number(parts.find((part) => part.type === 'day')?.value)
  if (!year || !month || !day) return null
  return Math.round(Date.UTC(year, month - 1, day) / 86400000)
}

export function getCountdown(ceremonyIso, now, invalidLabel) {
  const ceremony = new Date(ceremonyIso)
  if (Number.isNaN(ceremony.getTime())) return { kind: 'invalid', label: invalidLabel }
  const today = shanghaiDayNumber(now)
  const target = shanghaiDayNumber(ceremony)
  if (today === null || target === null) return { kind: 'invalid', label: invalidLabel }
  const days = target - today
  if (days > 0) return { kind: 'days', label: String(days) }
  if (days === 0) return { kind: 'today', label: '就是今天' }
  return { kind: 'past', label: '婚礼已经开始' }
}
