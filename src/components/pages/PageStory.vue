<script setup>
import PhotoSlot from '@/components/PhotoSlot.vue'

defineProps({
  entered: Boolean,
  beats: Array,
})
</script>

<template>
  <section class="flex h-full flex-col justify-center gap-5 px-8" :class="{ 'is-in': entered }">
    <h2 class="text-center text-sm tracking-[0.4em] text-[#a68456]">我们的故事</h2>
    <article v-for="(beat, index) in beats" :key="beat.photo.id" class="rise flex items-center gap-4" :class="`d${index + 1}`">
      <PhotoSlot class="w-16 shrink-0" :photo="beat.photo" />
      <div>
        <p class="text-xs tracking-[0.2em] text-[#a68456]">{{ beat.date }} {{ beat.title }}</p>
        <p class="mt-1 text-sm text-[#7a7168]">{{ beat.text }}</p>
      </div>
    </article>
  </section>
</template>
