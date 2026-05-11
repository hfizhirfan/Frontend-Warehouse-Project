<template>
  <div class="flex h-screen bg-[#F8F9FA] relative" style="font-family: 'Plus Jakarta Sans', sans-serif;">
    
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-gray-900/50 z-20 md:hidden transition-opacity backdrop-blur-sm"></div>

    <aside :class="['fixed md:relative z-30 w-64 h-full bg-[#1e1e2d] text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-xl', isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
      <div class="h-16 px-6 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-blue-500 tracking-wide">LOGO</h2>
        </div>
        <button @click="isSidebarOpen = false" class="md:hidden text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-lg">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
      
      <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto pb-20">
        <p class="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu Utama</p>
        <NuxtLink to="/" @click="isSidebarOpen = false" class="flex items-center px-3 py-3 md:py-2.5 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors group" active-class="bg-blue-600/10 text-blue-500 font-semibold">
          <span class="material-symbols-outlined mr-3 text-lg group-hover:text-blue-500 transition-colors">dashboard</span> 
          <span class="text-sm">Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/inbound" @click="isSidebarOpen = false" class="flex items-center px-3 py-3 md:py-2.5 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors group" active-class="bg-blue-600/10 text-blue-500 font-semibold">
          <span class="material-symbols-outlined mr-3 text-lg group-hover:text-blue-500 transition-colors">move_to_inbox</span> 
          <span class="text-sm">Inbound</span>
        </NuxtLink>
        <NuxtLink to="/outbound" @click="isSidebarOpen = false" class="flex items-center px-3 py-3 md:py-2.5 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors group" active-class="bg-blue-600/10 text-blue-500 font-semibold">
          <span class="material-symbols-outlined mr-3 text-lg group-hover:text-blue-500 transition-colors">qr_code_scanner</span> 
          <span class="text-sm">Outbound Scanner</span>
        </NuxtLink>

        <div class="my-4 border-t border-gray-800/50"></div>
        <p class="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Operasional Lanjutan</p>
        
        <NuxtLink to="/konversi" @click="isSidebarOpen = false" class="flex items-center px-3 py-3 md:py-2.5 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors group" active-class="bg-blue-600/10 text-blue-500 font-semibold">
          <span class="material-symbols-outlined mr-3 text-lg group-hover:text-blue-500 transition-colors">layers</span> 
          <span class="text-sm">Rakitan / Bundling</span>
        </NuxtLink>
        <NuxtLink to="/retur" @click="isSidebarOpen = false" class="flex items-center px-3 py-3 md:py-2.5 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors group" active-class="bg-blue-600/10 text-blue-500 font-semibold">
          <span class="material-symbols-outlined mr-3 text-lg group-hover:text-blue-500 transition-colors">assignment_return</span> 
          <span class="text-sm">Retur & Batal</span>
        </NuxtLink>
        <NuxtLink to="/opname" @click="isSidebarOpen = false" class="flex items-center px-3 py-3 md:py-2.5 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors group" active-class="bg-blue-600/10 text-blue-500 font-semibold">
          <span class="material-symbols-outlined mr-3 text-lg group-hover:text-blue-500 transition-colors">fact_check</span> 
          <span class="text-sm">Stock Opname</span>
        </NuxtLink>

        <div class="my-4 border-t border-gray-800/50"></div>
        <p class="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pengaturan</p>

        <NuxtLink to="/master-data" @click="isSidebarOpen = false" class="flex items-center px-3 py-3 md:py-2.5 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors group" active-class="bg-blue-600/10 text-blue-500 font-semibold">
          <span class="material-symbols-outlined mr-3 text-lg group-hover:text-blue-500 transition-colors">database</span> 
          <span class="text-sm">Master Data</span>
        </NuxtLink>

        <a href="#" class="flex items-center px-3 py-3 md:py-2.5 text-gray-500 hover:bg-gray-800/20 hover:text-gray-400 rounded-lg transition-colors cursor-not-allowed group" title="Dalam tahap pengembangan backend">
          <span class="material-symbols-outlined mr-3 text-lg">monitoring</span> 
          <span class="text-sm">Laporan & Analitik</span>
        </a>
        
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
          
          <div v-if="currentUser?.role === 'super_admin'" class="flex items-center bg-gray-50 border border-gray-200 px-2 md:px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-1 md:flex-none max-w-[140px] sm:max-w-xs">
            <span class="material-symbols-outlined text-gray-400 text-[16px] md:text-sm mr-1 md:mr-2 hidden sm:block">filter_alt</span>
            <select v-model="selectedBrand" class="bg-transparent text-xs md:text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer w-full truncate">
              <option v-for="brand in uniqueBrands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </div>
          <div v-else-if="currentUser" class="bg-blue-50 text-blue-700 font-bold px-2.5 md:px-3 py-1.5 rounded-lg border border-blue-100 text-[11px] md:text-sm truncate max-w-[120px] sm:max-w-xs">
            {{ currentUser.assigned_brand }}
          </div>

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

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0' }
  ]
})

const currentUser = useState('user')
const selectedBrand = useState('selectedBrand', () => 'Semua Brand')
const uniqueBrands = useState('uniqueBrands', () => ['Semua Brand', 'CA SKIN GLOW', 'Packaging Packing', 'Brand X']) 

const isSidebarOpen = ref(false)

const handleLogout = () => {
  currentUser.value = null
  navigateTo('/login')
}
</script>