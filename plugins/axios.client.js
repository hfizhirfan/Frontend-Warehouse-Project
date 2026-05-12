export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: 'https://562e-140-213-40-142.ngrok-free.app/api',

    onRequest({ options }) {
      const token = localStorage.getItem('token')

      console.log('🚀 TOKEN:', token)

      options.headers = {
        ...(options.headers || {}),
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true' // ✨ TAMBAHKAN BARIS INI
      }

      if (token) {
        options.headers.Authorization = `Bearer ${token}`
      }
    },

    onResponse({ response }) {
      console.log('✅ RESPONSE:', response._data)
    },

    onResponseError({ response }) {
      console.log('❌ ERROR:', response?._data)

      if (response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')

        if (process.client) {
          window.location.href = '/login'
        }
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})