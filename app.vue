<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
    }
  ]
})

const currentUser = useState('user', () => null)

onMounted(() => {
  const savedUser = localStorage.getItem('user')

  if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
  }
})
</script>