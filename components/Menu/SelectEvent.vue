<template>
  <div class="mb-4 md:mb-6">
    <select
      v-model="selectedEvent"
      class="bg-white p-2 rounded-md w-40 md:w-52 outline outline-gray-200 shadow-lg"
    >
      <option disabled value="">Choose event</option>
      <option v-for="e in events" :key="e.id" :value="e.id">
        {{ e.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const events = ref<any[]>([])
const { selectedEvent } = useCheckout()

onMounted(async () => {
  const res = await $fetch('/api/events', { method: 'GET' })
  if (res.ok) {
    const allEvents = 'events' in res ? res.events as any[] : []
    events.value = allEvents.filter(i => i.is_active === 1 || i.is_active === true)
  }
})
</script>