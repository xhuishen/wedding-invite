import { ref } from 'vue'

export function usePager(pageCount = 10, lockMs = 700) {
  const index = ref(0)
  const direction = ref('forward')
  const isLocked = ref(false)
  let lockTimer = null
  let startX = 0
  let startY = 0

  function lock() {
    isLocked.value = true
    if (lockTimer) clearTimeout(lockTimer)
    lockTimer = setTimeout(() => {
      isLocked.value = false
    }, lockMs)
  }

  function go(target) {
    if (isLocked.value) return
    const nextIndex = Math.min(pageCount - 1, Math.max(0, target))
    if (nextIndex === index.value) return
    direction.value = nextIndex > index.value ? 'forward' : 'back'
    index.value = nextIndex
    lock()
  }

  function next() {
    go(index.value + 1)
  }

  function prev() {
    go(index.value - 1)
  }

  function onTouchStart(x, y) {
    startX = x
    startY = y
  }

  function onTouchEnd(x, y) {
    const dx = x - startX
    const dy = y - startY
    if (Math.abs(dy) <= 48 || Math.abs(dy) <= Math.abs(dx)) return
    if (dy < 0) next()
    else prev()
  }

  function onWheel(deltaY) {
    if (deltaY > 40) next()
    else if (deltaY < -40) prev()
  }

  function onKeyDown(key, preventDefault) {
    const forward = key === 'ArrowDown' || key === 'PageDown' || key === ' '
    const backward = key === 'ArrowUp' || key === 'PageUp'
    if (!forward && !backward) return
    preventDefault()
    if (forward) next()
    else prev()
  }

  return { index, direction, isLocked, next, prev, go, lock, onTouchStart, onTouchEnd, onWheel, onKeyDown }
}
