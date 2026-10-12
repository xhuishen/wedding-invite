<script setup>
import { onMounted, ref, watch } from 'vue'
import { pageOrder, propsFor } from '@/data/invitation'
import { usePager } from '@/composables/usePager'
import PageDots from './PageDots.vue'
import { pageViews } from './pages/registry'

const pager = usePager(pageOrder.length)
const contentReady = ref(false)
const pageId = () => pageOrder[pager.index.value] ?? 'cover'

watch(pager.index, () => {
  contentReady.value = false
})

function markEntered() {
  contentReady.value = true
}

const root = ref(null)

function onTouchStart(event) {
  const touch = event.changedTouches[0]
  if (!touch) return
  pager.onTouchStart(touch.clientX, touch.clientY)
}

function onTouchEnd(event) {
  const touch = event.changedTouches[0]
  if (!touch) return
  pager.onTouchEnd(touch.clientX, touch.clientY)
}

function onWheel(event) {
  pager.onWheel(event.deltaY)
}

function onKeyDown(event) {
  pager.onKeyDown(event.key, () => event.preventDefault())
}

onMounted(() => {
  pager.lock()
  root.value?.focus()
})
</script>

<template>
  <div
    ref="root"
    tabindex="0"
    class="relative h-full w-full overflow-hidden bg-[#f6f1e8] outline-none"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @wheel.prevent="onWheel"
    @keydown="onKeyDown"
  >
    <Transition :name="pageId()" appear @after-enter="markEntered">
      <component
        :is="pageViews[pageId()]"
        :key="pageId()"
        class="absolute inset-0"
        :entered="contentReady"
        v-bind="propsFor(pageId())"
      />
    </Transition>
    <PageDots
      class="absolute bottom-5 left-0 right-0 z-10"
      :count="pageOrder.length"
      :current="pager.index.value"
      @select="pager.go"
    />
  </div>
</template>
