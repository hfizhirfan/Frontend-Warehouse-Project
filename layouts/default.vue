<template>
  <div class="flex h-screen bg-[#F8F9FA] relative" style="font-family: 'Plus Jakarta Sans', sans-serif;">
    
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-gray-900/50 z-20 md:hidden transition-opacity backdrop-blur-sm"></div>

    <aside :class="['fixed md:relative z-50 w-64 h-full bg-[#1e1e2d] text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-xl', isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
      <div class="h-16 px-6 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-blue-500 tracking-wide">LOGO</h2>
        </div>
        <button @click="isSidebarOpen = false" class="md:hidden text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-lg">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
      
      <nav class="flex-1 px-4 py-6 space-y-4">

        <div v-for="group in menus" :key="group.group">

          <!-- TITLE -->
          <p class="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {{ group.group }}
          </p>

          <!-- ITEMS -->
          <NuxtLink
            v-for="menu in group.items"
            :key="menu.path"
            :to="menu.path"
            @click="isSidebarOpen = false"
            class="flex items-center px-3 py-3 md:py-2.5 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors group"
            active-class="bg-blue-600/10 text-blue-500 font-semibold"
          >
            <span class="material-symbols-outlined mr-3 text-lg group-hover:text-blue-500">
              {{ menu.icon }}
            </span>
            <span class="text-sm">{{ menu.name }}</span>
          </NuxtLink>

        </div>

      </nav>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
      <header class="flex justify-between items-center bg-white px-4 md:px-6 h-16 shadow-sm border-b border-gray-100 z-10 shrink-0">
        <div class="flex items-center">
          <button @click="isSidebarOpen = true" class="md:hidden mr-3 text-gray-500 hover:text-blue-600 transition-colors p-1">
            <span class="material-symbols-outlined text-2xl">menu</span>
          </button>
          <h1 class="text-lg font-bold text-gray-800 hidden lg:block">Overview Operasional</h1>
        </div>
        
        <div class="flex items-center space-x-2 md:space-x-6 w-full md:w-auto justify-end">
          

          <div class="h-6 w-px bg-gray-200 hidden md:block"></div>

          <div class="flex items-center space-x-2 md:space-x-3 shrink-0">
            <div class="text-right hidden md:block">
              <p class="text-sm font-bold text-gray-800 leading-tight">{{ currentUser?.name || 'Guest' }}</p>
              <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{{ currentUser?.role?.replace('_', ' ') || 'User' }}</p>
            </div>
            <div class="h-8 w-8 md:h-9 md:w-9 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-md ring-2 ring-white border border-gray-100 shrink-0">
              {{ currentUser?.name ? currentUser.name.substring(0,2).toUpperCase() : 'AU' }}
            </div>
            <button v-if="currentUser" @click="handleLogout" class="flex items-center justify-center text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 md:p-2 rounded-lg md:rounded-md transition-colors shrink-0" title="Logout">
              <span class="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative z-0 pointer-events-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const currentUser = useState('user', () => null)
const role = useState('role', () => 'guest')
const isSidebarOpen = ref(false)

// ================= MENU DINAMIS =================
const menus = computed(() => {
  switch (role.value) {

    case 'super_admin':
      return [
        { group: 'Menu Utama', items: [
          { name: 'Dashboard', path: '/', icon: 'dashboard' },
          { name: 'Inbound', path: '/inbound', icon: 'move_to_inbox' },
          { name: 'Outbound Scanner', path: '/outbound-scan', icon: 'qr_code_scanner' },
          { name: 'Order', path: '/orders', icon: 'receipt_long' },
        ]},
        { group: 'Operasional Lanjutan', items: [
          { name: 'Retur & Batal', path: '/retur', icon: 'assignment_return' },
          { name: 'Stock Opname', path: '/opname', icon: 'fact_check' },
        ]},
        { group: 'Pengaturan', items: [
          { name: 'Master Data', path: '/master-data', icon: 'database' },
          { name: 'Kategori & Brand', path: '/kategori-brand', icon: 'category' },
          { name: 'Warehouse Mapping', path: '/warehouse-mapping', icon: 'warehouse' },
          { name: 'Manajemen User', path: '/users', icon: 'group' },
        ]}
      ]

    case 'admin':
      return [
        { group: 'Menu Utama', items: [
          { name: 'Dashboard', path: '/', icon: 'dashboard' },
          { name: 'Inbound', path: '/inbound', icon: 'move_to_inbox' },
          { name: 'Outbound Scanner', path: '/outbound-scan', icon: 'qr_code_scanner' },
          { name: 'Order', path: '/orders', icon: 'receipt_long' },
        ]},
        { group: 'Operasional Lanjutan', items: [
          { name: 'Retur & Batal', path: '/retur', icon: 'assignment_return' },
          { name: 'Stock Opname', path: '/opname', icon: 'fact_check' },
        ]}
      ]

    default:
      return [
        { group: 'Menu', items: [
          { name: 'Dashboard', path: '/', icon: 'dashboard' },
        ]}
      ]
  }
})

// ================= INIT =================
onMounted(() => {
  const token = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')

  if (!token) return navigateTo('/login')

  if (savedUser) {
    const user = JSON.parse(savedUser)
    currentUser.value = user
    role.value = user.role
  }
})

// ================= LOGOUT =================
const handleLogout = () => {
  localStorage.clear()
  navigateTo('/login')
}
</script>