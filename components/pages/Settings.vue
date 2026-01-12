<template>
	<div class="flex gap-3">
		<button
			@click="exportCSV"
			class="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-md cursor-pointer"
		>
			Export CSV
		</button>

		<button
			@click="showForm = true"
			class="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-md cursor-pointer"
		>
			Logout
		</button>
	</div>

  <FormConfirmation v-if="showForm" headline="Logout" @cancel="showForm = false" @confirm="confirm">
    <template #message>
      <p>Do you really want to log out?</p>
    </template>
  </FormConfirmation>
</template>
<script setup lang="ts">
const { setPage } = usePage()
const { user, logout, fetchSession } = useAuth()

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
  
async function cancel() {
  await fetchSession()
  if (!user.value) { 
    setPage('Login')
  } else {
    setPage('Checkout')
  }
}
</script>