export function frameScale(viewportHeight) {
  return Math.max(0.82, Math.min(1, viewportHeight / 844))
}
