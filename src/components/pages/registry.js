import { defineComponent, h } from 'vue'
import PageCover from './PageCover.vue'
import PageGallery from './PageGallery.vue'
import PageInvite from './PageInvite.vue'
import PagePerson from './PagePerson.vue'
import PageSchedule from './PageSchedule.vue'
import PageStory from './PageStory.vue'

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
  cover: PageCover,
  invite: PageInvite,
  groom: PagePerson,
  bride: PagePerson,
  story: PageStory,
  schedule: PageSchedule,
  gallery: PageGallery,
  info: stub('info'),
  countdown: stub('countdown'),
  map: stub('map'),
}
