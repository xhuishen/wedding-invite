<script setup>
import PhotoSlot from '@/components/PhotoSlot.vue'

defineProps({
  entered: Boolean,
  role: String,
  name: String,
  line: String,
  photo: {
    type: Object,
    required: true,
  },
  side: String,
})
</script>

<template>
  <section
    class="flex h-full items-center gap-6 px-8"
    :class="[side === 'left' ? 'flex-row' : 'flex-row-reverse', { 'is-in': entered }]"
  >
    <PhotoSlot class="fade-late w-40 shrink-0" :photo="photo" />
    <div>
      <p class="rise d1 text-sm tracking-[0.3em] text-[#a68456]">{{ role }}</p>
      <h2 class="rise d2 mt-3 text-3xl">{{ name }}</h2>
      <p class="rise d3 mt-4 text-sm leading-6 text-[#7a7168]">{{ line }}</p>
    </div>
  </section>
</template>
