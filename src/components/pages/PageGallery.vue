<script setup>
import PhotoSlot from '@/components/PhotoSlot.vue'

defineProps({
  entered: Boolean,
  photos: Array,
})
</script>

<template>
  <section class="flex h-full flex-col justify-center px-6" :class="{ 'is-in': entered }">
    <h2 class="mb-4 text-center text-sm tracking-[0.4em] text-[#a68456]">相册</h2>
    <div class="grid grid-cols-2 gap-3">
      <PhotoSlot
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="pop"
        :class="`d${index + 1}`"
        :photo="photo"
      />
    </div>
  </section>
</template>
