export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    public: {
      apiBase: 'https://aa14-2400-9800-9b2-5623-7868-912c-7b31-a15e.ngrok-free.app/api'
    }
  },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },

    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
        }
      ]
    }
  }
})