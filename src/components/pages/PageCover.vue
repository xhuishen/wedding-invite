<script setup>
import PhotoSlot from '@/components/PhotoSlot.vue'

defineProps({
  entered: Boolean,
  brideName: String,
  groomName: String,
  dateLabel: String,
  photo: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section
    class="flex h-full flex-col items-center justify-between px-8 py-14 text-center"
    :class="{ 'is-in': entered }"
  >
    <p class="text-xs tracking-[0.45em] text-[#a68456]">WEDDING</p>
    <div>
      <h1 class="text-4xl leading-tight">
        <span class="rise d1 block">{{ brideName }}</span>
        <span class="rise d2 my-2 block text-2xl text-[#a68456]">&</span>
        <span class="rise d3 block">{{ groomName }}</span>
      </h1>
      <p class="rise d4 mt-5 tracking-[0.28em] text-[#7a7168]">{{ dateLabel }}</p>
    </div>
    <PhotoSlot class="fade-late w-44" :photo="photo" />
    <p class="text-sm text-[#7a7168]">向上滑动，开启邀请函</p>
  </section>
</template>
