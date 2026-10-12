<script setup>
import { computed } from 'vue'
import { getCountdown } from '@/composables/useCountdown'

const props = defineProps({
  entered: Boolean,
  ceremonyIso: String,
  note: String,
  invalidLabel: String,
  now: {
    type: Date,
    required: false,
  },
})

const state = computed(() =>
  getCountdown(props.ceremonyIso, props.now ?? new Date(), props.invalidLabel),
)
</script>

<template>
  <section class="flex h-full flex-col items-center justify-center px-8 text-center" :class="{ 'is-in': entered }">
    <p class="rise d1 text-sm tracking-[0.4em] text-[#a68456]">倒计时</p>
    <p class="rise d2 mt-6 text-5xl">
      {{ state.label }}
      <span v-if="state.kind === 'days'" class="ml-2 text-base text-[#7a7168]">天</span>
    </p>
    <p class="rise d3 mt-6 text-sm text-[#7a7168]">{{ note }}</p>
  </section>
</template>
