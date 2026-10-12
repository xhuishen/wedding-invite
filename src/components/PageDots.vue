<script setup>
defineProps({
  count: { type: Number, required: true },
  current: { type: Number, required: true },
})
const emit = defineEmits(['select'])
</script>

<template>
  <div class="flex justify-center gap-2">
    <button
      v-for="dot in count"
      :key="dot"
      type="button"
      class="h-1.5 w-1.5 rounded-full"
      :class="dot - 1 === current ? 'bg-[#a68456]' : 'bg-[#d9cbb6]'"
      :aria-label="`第 ${dot} 页`"
      :aria-current="dot - 1 === current ? 'true' : undefined"
      @click="emit('select', dot - 1)"
    />
  </div>
</template>
