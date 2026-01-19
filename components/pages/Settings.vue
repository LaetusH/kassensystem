<template>
  <Page headline1="Settings" @open-menu="$emit('openMenu')">
    <template #cards>
      <div class="flex gap-3 col-span-12">
        <button
          @click="exportCSV"
          class="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-md cursor-pointer"
        >
          Export CSV
        </button>

        <button
          @click="addEvents"
          class="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-md cursor-pointer"
        >
          Change DB schema to support Events
        </button>

        <button
          @click="showForm = true"
          class="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-md cursor-pointer"
        >
          Logout
        </button>
      </div>
    </template>
  </Page>

  <FormConfirmation v-if="showForm" headline="Logout" @cancel="showForm = false" @confirm="confirm">
    <template #message>
      <p>Do you really want to log out?</p>
    </template>
  </FormConfirmation>
</template>
<script setup lang="ts">
const { setPage } = usePage()
const { logout } = useAuth()

const emit = defineEmits<{
  (e: 'openMenu'): void
}>()

const showForm = ref(false)

function confirm() {
  setPage('Checkout')
  logout()
}

async function exportCSV() {
  const res = await fetch('/api/export/csv')

  if (!res.ok) return

  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `kassensystem-export-${new Date().toISOString().slice(0,10)}.csv`
  a.click()

  window.URL.revokeObjectURL(url)
}

async function addEvents() {
  const res = await $fetch('/api/changeSchema/addEvents')
  console.log(res)
}
</script>