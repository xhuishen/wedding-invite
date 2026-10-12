<script setup>
defineProps({
  entered: Boolean,
  ceremonyDisplay: String,
  venueName: String,
  hallName: String,
  address: String,
  dressCode: String,
})
</script>

<template>
  <section class="flex h-full flex-col justify-center gap-6 px-10" :class="{ 'is-in': entered }">
    <h2 class="text-center text-sm tracking-[0.4em] text-[#a68456]">婚礼信息</h2>
    <p class="rise d1"><span class="mr-4 text-[#a68456]">时间</span>{{ ceremonyDisplay }}</p>
    <p class="rise d2"><span class="mr-4 text-[#a68456]">地点</span>{{ venueName }} · {{ hallName }}</p>
    <p class="rise d3 text-sm text-[#7a7168]">{{ address }}</p>
    <p class="rise d4"><span class="mr-4 text-[#a68456]">着装</span>{{ dressCode }}</p>
  </section>
</template>
