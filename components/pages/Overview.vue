<template>
  <div v-if="loading" class="text-gray-500">
      Loading…
    </div>
  <Page v-else headline1="Overview" @open-menu="$emit('openMenu')">
    <template #header>
      <MenuSelectEvent />
    </template>

    <template #cards>
    <div class="col-span-12 bg-white p-4 rounded-xl shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Regular Sales</h2>

      <ul>
        <li
          v-for="i in data.regular.items"
          :key="i.id"
          class="flex justify-between border-b py-1"
        >
          <span>{{ i.name }} × {{ i.quantity }}</span>
          <span>{{ i.revenue }} €</span>
        </li>
      </ul>

      <div class="text-right font-bold mt-3">
        Total: {{ data.regular.totalRevenue }} €
      </div>
    </div>

    <div class="col-span-12 bg-white p-4 rounded-xl shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Fachschaft (Given out)</h2>

      <ul>
        <li
          v-for="i in data.fachschaft.items"
          :key="i.id"
          class="flex justify-between border-b py-1"
        >
          <span>{{ i.name }}</span>
          <span>{{ i.quantity }} pcs</span>
        </li>
      </ul>
    </div>

    <div class="col-span-12 bg-white p-4 rounded-xl shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Fachschaft Payments</h2>

      <div class="flex justify-between">
        <span>Paid members</span>
        <span>{{ data.payments.count }}</span>
      </div>

      <div class="flex justify-between font-bold">
        <span>Revenue</span>
        <span>{{ data.payments.revenue }} €</span>
      </div>
    </div>

    <div class="col-span-12 bg-white p-4 rounded-xl shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Last Hour</h2>

      <div class="flex justify-between">
        <span>Revenue</span>
        <span>
          {{ data.lastHour.revenue }} €
          <span
            :class="data.lastHour.diffRevenue >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            ({{ data.lastHour.diffRevenue >= 0 ? '+' : '' }}{{ data.lastHour.diffRevenue }} €)
          </span>
        </span>
      </div>

      <div class="flex justify-between">
        <span>Items sold</span>
        <span>
          {{ data.lastHour.quantity }}
          <span
            :class="data.lastHour.diffQuantity >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            ({{ data.lastHour.diffQuantity >= 0 ? '+' : '' }}{{ data.lastHour.diffQuantity }})
          </span>
        </span>
      </div>
    </div>
    </template>
  </Page>
</template>

<script setup lang="ts">
const { selectedEvent } = useCheckout()

const data = ref<any | null>(null)
const loading = ref(true)

async function loadOverview() {
  const res = await $fetch(`/api/overview?eventId=${selectedEvent.value}`, { method: 'GET' })
  if (res.ok) data.value = res
  loading.value = false
}

watch(selectedEvent, () => {
  loadOverview()
})

onMounted(loadOverview)
</script>