<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Pager from '@/components/Pager.vue'
import { frameScale } from '@/utils/frameScale'

const viewportHeight = ref(window.innerHeight)
const windowWidth = ref(window.innerWidth)
const scale = computed(() => frameScale(viewportHeight.value))

function readViewport() {
  viewportHeight.value = window.innerHeight
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  readViewport()
  window.addEventListener('resize', readViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', readViewport)
})
</script>

<template>
  <div class="flex h-dvh items-start justify-center bg-[#e7e1d6]">
    <div
      class="overflow-hidden"
      :style="{
        height: `${viewportHeight / scale}px`,
        width: `${Math.min(windowWidth, 430) / scale}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }"
    >
      <Pager />
    </div>
  </div>
</template>
