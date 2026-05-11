export const useAuth = () => {
  const role = useState('role', () => {
    if (process.client) {
      return localStorage.getItem('role')
    }
    return null
  })

  const isSuperAdmin = computed(() => role.value === 'super_admin')
  const isAdmin = computed(() => role.value === 'admin')
  const isGuest = computed(() => role.value === 'guest')

  return {
    role,
    isSuperAdmin,
    isAdmin,
    isGuest
  }
}