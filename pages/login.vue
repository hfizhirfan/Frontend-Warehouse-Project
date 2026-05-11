<template>
  <div class="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-8 px-4 relative overflow-hidden">

    <!-- HEADER -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold">Login WMS</h2>
      <p class="text-sm text-gray-500">Warehouse Management System</p>
    </div>

    <!-- FORM -->
    <div class="bg-white p-6 rounded-2xl shadow border max-w-md mx-auto w-full">

      <form @submit.prevent="handleLogin" class="space-y-4">

        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="input"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="input"
          required
        />

        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary"
        >
          {{ loading ? 'Loading...' : 'Login' }}
        </button>

      </form>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: false })

const { $api } = useNuxtApp()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await $api('/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    console.log('✅ LOGIN SUCCESS:', res)

    // 🔥 SIMPAN TOKEN
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))

    // 🔥 REDIRECT
    navigateTo('/')

  } catch (err) {
    console.log('❌ LOGIN ERROR:', err)
    errorMessage.value = err?.data?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input {
  @apply w-full border p-2 rounded-lg;
}

.btn-primary {
  @apply w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700;
}
</style>