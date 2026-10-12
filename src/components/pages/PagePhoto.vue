<script setup>
import PhotoSlot from '@/components/PhotoSlot.vue'

defineProps({
  entered: Boolean,
  photo: Object,
})
</script>

<template>
  <section class="flex h-full flex-col px-7 pb-16 pt-12" :class="{ 'is-in': entered }">
    <div class="rise d1 mb-4 flex items-center justify-center gap-2 text-[#a68456]">
      <svg
        v-if="photo.icon === 'ring'"
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
        aria-hidden="true"
      >
        <circle cx="8" cy="14" r="3.5" />
        <circle cx="16" cy="14" r="3.5" />
      </svg>
      <svg
        v-else-if="photo.icon === 'heart'"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
        aria-hidden="true"
      >
        <path d="M12 19s-6-3.6-6-8a3.4 3.4 0 0 1 6-2 3.4 3.4 0 0 1 6 2c0 4.4-6 8-6 8z" />
      </svg>
      <svg
        v-else-if="photo.icon === 'bloom'"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="12" cy="6.2" r="2.1" />
        <circle cx="12" cy="17.8" r="2.1" />
        <circle cx="6.2" cy="12" r="2.1" />
        <circle cx="17.8" cy="12" r="2.1" />
      </svg>
      <svg
        v-else
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
        aria-hidden="true"
      >
        <path d="M12 3.5 13.8 8.1l5 .4-3.8 3.2 1.2 4.8L12 14.2 7.8 16.5l1.2-4.8-3.8-3.2 5-.4L12 3.5z" />
      </svg>
      <span class="text-xs tracking-[0.42em]">{{ photo.kicker }}</span>
    </div>

    <div class="relative min-h-0 flex-1" :class="photo.motion">
      <span class="pointer-events-none absolute -left-2 -top-2 h-5 w-5 border-l border-t border-[#a68456]" />
      <span class="pointer-events-none absolute -right-2 -top-2 h-5 w-5 border-r border-t border-[#a68456]" />
      <span class="pointer-events-none absolute -bottom-2 -left-2 h-5 w-5 border-b border-l border-[#a68456]" />
      <span class="pointer-events-none absolute -bottom-2 -right-2 h-5 w-5 border-b border-r border-[#a68456]" />
      <PhotoSlot fill :photo="photo" />
    </div>

    <div class="rise d4 mt-6 text-center">
      <h2 class="text-2xl tracking-[0.18em]">{{ photo.title }}</h2>
      <p class="mt-2 text-sm tracking-widest text-[#7a7168]">
        <span class="mr-2 text-[#a68456]" aria-hidden="true">✦</span>{{ photo.line }}
      </p>
    </div>
  </section>
</template>
