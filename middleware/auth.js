export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user.role

  // ❌ belum login
  if (!token && to.path !== '/login') {
    return navigateTo('/login')
  }

  // ✅ sudah login
  if (token && to.path === '/login') {
    return navigateTo('/')
  }

  // ================= ROLE PROTECTION =================

  const superAdminOnly = [
    '/master-data',
    '/kategori-brand',
    '/warehouse-mapping',
    '/users'
  ]

  if (superAdminOnly.includes(to.path) && role !== 'super_admin') {
    return navigateTo('/')
  }

  if (role === 'guest') {
    const blockedForGuest = [
      '/inbound',
      '/outbound-scan',
      '/orders',
      '/retur',
      '/opname'
    ]

    if (blockedForGuest.includes(to.path)) {
      return navigateTo('/')
    }
  }
})