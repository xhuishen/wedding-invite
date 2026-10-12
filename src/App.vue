<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Pager from '@/components/Pager.vue'
import { frameScale } from '@/utils/frameScale'

const viewportHeight = ref(844)
const scale = computed(() => frameScale(viewportHeight.value))

function readHeight() {
  viewportHeight.value = window.innerHeight
}

onMounted(() => {
  readHeight()
  window.addEventListener('resize', readHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', readHeight)
})
</script>

<template>
  <div class="flex h-dvh items-start justify-center bg-[#e7e1d6]">
    <div
      class="h-dvh w-full max-w-[430px] overflow-hidden"
      :style="{ transform: `scale(${scale})`, transformOrigin: 'top center' }"
    >
      <Pager />
    </div>
  </div>
</template>
