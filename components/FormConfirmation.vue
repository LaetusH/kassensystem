<template>
  <div class="fixed inset-0 bg-gray-200 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-96 shadow-xl">
      <h2 class="text-xl font-bold mb-4 text-center">{{ headline }}</h2>
      <p class="text-center mb-6">
        <slot name="message"></slot>
      </p>
      <div class="flex justify-between">
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 text-white bg-cyan-600 hover:bg-cyan-700 rounded-md cursor-pointer"
        >
          Confirm
        </button>
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  headline: String
})
const emit = defineEmits(['confirm', 'cancel'])
</script>