<script setup>
import PhotoSlot from '@/components/PhotoSlot.vue'

defineProps({
  entered: Boolean,
  lines: {
    type: Array,
    required: true,
  },
  photo: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section
    class="flex h-full flex-col justify-center gap-8 px-8"
    :class="{ 'is-in': entered }"
  >
    <PhotoSlot class="fade-late" :photo="photo" />
    <div class="text-center text-xl leading-10">
      <p v-for="(line, index) in lines" :key="line" class="rise" :class="`d${index + 1}`">
        {{ line }}
      </p>
    </div>
  </section>
</template>
