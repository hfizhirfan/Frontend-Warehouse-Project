export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: 'http://127.0.0.1:8000/api',

    onRequest({ options }) {
      const token = localStorage.getItem('token')

      console.log('🚀 TOKEN:', token)

      options.headers = {
        ...(options.headers || {}),
        Accept: 'application/json'
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