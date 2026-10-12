import { createApp, defineComponent, h } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp(defineComponent({
    setup() {
      result = composable()
      return () => h('div')
    },
  }))
  app.mount(document.createElement('div'))
  return { result, app }
}
