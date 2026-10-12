<script setup>
defineProps({
  entered: Boolean,
  items: Array,
})
</script>

<template>
  <section class="flex h-full flex-col justify-center px-10" :class="{ 'is-in': entered }">
    <h2 class="text-center text-sm tracking-[0.4em] text-[#a68456]">婚礼流程</h2>
    <ol class="mt-8">
      <li
        v-for="(item, index) in items"
        :key="item.time"
        class="rise flex items-baseline gap-6 border-b border-[#d9cbb6] py-4"
        :class="`d${index + 1}`"
      >
        <span class="w-16 text-[#a68456]">{{ item.time }}</span>
        <span class="text-xl">{{ item.title }}</span>
      </li>
    </ol>
  </section>
</template>
