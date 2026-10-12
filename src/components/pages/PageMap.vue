<script setup>
import { computed } from 'vue'
import { systemMapUrl } from '@/data/invitation'

const props = defineProps({
  entered: Boolean,
  venueName: String,
  hallName: String,
  address: String,
  amapUrl: String,
  appleMapUrl: String,
  geoUrl: String,
  userAgent: {
    type: String,
    required: false,
  },
})

const systemHref = computed(() => systemMapUrl(props.userAgent ?? navigator.userAgent))
</script>

<template>
  <section class="flex h-full flex-col justify-end px-6 pb-16" :class="{ 'is-in': entered }">
    <svg viewBox="0 0 320 180" class="h-40 w-full text-[#d9cbb6]" aria-hidden="true">
      <rect x="8" y="8" width="304" height="164" fill="#efe6d8" stroke="currentColor" />
      <path d="M20 130 C80 90 120 150 180 100 S260 70 300 90" fill="none" stroke="currentColor" />
      <circle cx="168" cy="78" r="8" fill="#a68456" />
    </svg>
    <div class="rise d2 mt-6 border border-[#d9cbb6] bg-[#f6f1e8] p-5">
      <h2 class="text-xl">{{ venueName }}</h2>
      <p class="mt-2 text-sm text-[#7a7168]">{{ hallName }}</p>
      <p class="mt-1 text-sm text-[#7a7168]">{{ address }}</p>
      <div class="mt-4 flex gap-3 text-sm">
        <a
          class="border border-[#a68456] px-3 py-2 text-[#a68456]"
          :href="amapUrl"
          target="_blank"
          rel="noopener noreferrer"
          >高德导航</a
        >
        <a
          class="border border-[#a68456] px-3 py-2 text-[#a68456]"
          :href="systemHref"
          target="_blank"
          rel="noopener noreferrer"
          >系统地图</a
        >
      </div>
    </div>
  </section>
</template>
