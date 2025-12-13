<template>
  <div class="p-6">
    <div class="flex flex-row justify-between">
      <h1 class="text-2xl font-bold mb-4">{{ headline1 }}</h1>
      <slot name="header"></slot>
    </div>

    <div
      v-if="$slots.cards"
      class="grid grid-cols-12 gap-6"
    >
      <slot name="cards"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    headline1: String,
  })
</script>