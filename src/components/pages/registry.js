import { defineComponent, h } from 'vue'

function stub(pageId) {
  return defineComponent({
    name: `Stub${pageId}`,
    inheritAttrs: false,
    props: { entered: { type: Boolean, default: false } },
    setup() {
      return () => h('section', { 'data-page': pageId, class: 'absolute inset-0' }, pageId)
    },
  })
}

export const pageViews = {
  cover: stub('cover'),
  invite: stub('invite'),
  groom: stub('groom'),
  bride: stub('bride'),
  story: stub('story'),
  schedule: stub('schedule'),
  gallery: stub('gallery'),
  info: stub('info'),
  countdown: stub('countdown'),
  map: stub('map'),
}
