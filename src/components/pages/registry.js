import PageCountdown from './PageCountdown.vue'
import PageCover from './PageCover.vue'
import PageInfo from './PageInfo.vue'
import PageInvite from './PageInvite.vue'
import PageMap from './PageMap.vue'
import PagePhoto from './PagePhoto.vue'

export const pageViews = {
  cover: PageCover,
  invite: PageInvite,
  'photo-1': PagePhoto,
  'photo-2': PagePhoto,
  'photo-3': PagePhoto,
  'photo-4': PagePhoto,
  info: PageInfo,
  countdown: PageCountdown,
  map: PageMap,
}
