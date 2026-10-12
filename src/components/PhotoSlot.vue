<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  photo: {
    type: Object,
    required: true,
  },
})

const failed = ref(false)

watch(
  () => props.photo.src,
  () => {
    failed.value = false
  },
)

const showImage = computed(() => Boolean(props.photo.src) && !failed.value)
const ratioClass = computed(() => {
  if (props.photo.ratio === 'landscape') return 'aspect-[4/3]'
  if (props.photo.ratio === 'square') return 'aspect-square'
  return 'aspect-[3/4]'
})
</script>

<template>
  <div
    class="relative overflow-hidden border border-[#d9cbb6] bg-[#efe6d8]"
    :class="ratioClass"
  >
    <img
      v-if="showImage"
      :src="photo.src"
      :alt="photo.label"
      class="h-full w-full object-cover"
      @error="failed = true"
    />
    <div
      v-else
      class="flex h-full flex-col items-center justify-center gap-1 px-2 text-center text-sm text-[#7a7168]"
    >
      <span>图片展示区</span>
      <span class="text-xs">{{ photo.label }}</span>
    </div>
  </div>
</template>
