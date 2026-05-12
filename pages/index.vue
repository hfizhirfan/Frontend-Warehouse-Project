<template>
  <div class="px-4 md:px-0 pb-20 md:pb-10 max-w-7xl mx-auto">

    <!-- HEADER -->
    <div class="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h2 class="text-xl md:text-3xl font-bold text-gray-900">Dashboard Stok</h2>
        <p class="text-xs md:text-sm text-gray-500 mt-1">
          Pantau ketersediaan barang dan pergerakan stok secara real-time.
        </p>
      </div>

    </div>

    <!-- LOADING -->
    <!-- ================= LOADING ================= -->
    <div v-if="loading">

      <!-- KPI SKELETON -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div v-for="n in 4" :key="n" class="card">
          <div class="flex justify-between">
            <div class="space-y-2 w-full">
              <div class="skeleton h-3 w-24"></div>
              <div class="skeleton h-8 w-20"></div>
              <div class="skeleton h-3 w-32"></div>
            </div>
            <div class="skeleton w-10 h-10 rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- TABLE SKELETON -->
      <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <div class="skeleton h-4 w-40"></div>
          <div class="skeleton h-6 w-28 rounded"></div>
        </div>

        <div class="p-4 space-y-3">
          <div v-for="n in 6" :key="n" class="grid grid-cols-5 gap-4">
            <div class="skeleton h-4"></div>
            <div class="skeleton h-4"></div>
            <div class="skeleton h-4"></div>
            <div class="skeleton h-4"></div>
            <div class="skeleton h-4"></div>
          </div>
        </div>
      </div>

    </div>

    <!-- ================= DATA ================= -->
    <div v-else>

      <!-- KPI -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        <div class="card">
          <div class="flex justify-between">
            <div>
              <p class="title">Total Stok Tersedia</p>
              <h3 class="value">{{ formatNumber(totalStok) }}</h3>
              <p class="sub"><span class="badge blue">Pcs</span> Semua gudang</p>
            </div>
            <div class="icon blue">
              <span class="material-symbols-outlined">inventory_2</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex justify-between">
            <div>
              <p class="title">Inbound Bulan Ini</p>
              <h3 class="value">{{ formatNumber(totalInbound) }}</h3>
              <p class="sub"><span class="badge green">Pcs</span> Total masuk</p>
            </div>
            <div class="icon green">
              <span class="material-symbols-outlined">south</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex justify-between">
            <div>
              <p class="title">Total SKU Aktif</p>
              <h3 class="value">{{ products.length }}</h3>
              <p class="sub"><span class="badge purple">Item</span> Tipe produk</p>
            </div>
            <div class="icon purple">
              <span class="material-symbols-outlined">category</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex justify-between">
            <div>
              <p class="title">Peringatan Stock</p>
              <h3 :class="lowStockCount > 0 ? 'text-red-600 value' : 'value'">
                {{ lowStockCount }}
              </h3>
              <p class="sub"><span class="badge red">SKU</span> Butuh restock</p>
            </div>
            <div class="icon red">
              <span class="material-symbols-outlined">warning</span>
            </div>
          </div>
        </div>

      </div>

      <!-- TABLE -->
      <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="font-bold">Rincian Inventori</h3>
          <span class="text-xs bg-green-50 text-green-700 px-3 py-1 rounded">
            Data terupdate
          </span>
        </div>
        <div class="md:hidden space-y-3 p-4 pb-16">
          <div 
            v-for="item in products" 
            :key="item.sku"
            class="border rounded-xl p-4 shadow-sm bg-white"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="text-sm font-semibold text-gray-800">
                  {{ item.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ item.brand }}
                </p>
              </div>

              <span
                :class="item.stock < 50
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'"
                class="px-2 py-1 rounded text-xs"
              >
                {{ item.stock < 50 ? 'Kritis' : 'Aman' }}
              </span>
            </div>

            <div class="flex justify-between text-sm mt-2">
              <div>
                <p class="text-gray-400 text-xs">SKU</p>
                <p class="font-mono">{{ item.sku }}</p>
              </div>

              <div class="text-right">
                <p class="text-gray-400 text-xs">Stok</p>
                <p 
                  class="font-bold"
                  :class="item.stock < 50 ? 'text-red-600' : ''"
                >
                  {{ formatNumber(item.stock) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden md:block overflow-auto max-h-[500px]">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th class="px-4 py-3 text-left">Brand</th>
                <th class="px-4 py-3 text-left">SKU</th>
                <th class="px-4 py-3 text-left">Produk</th>
                <th class="px-4 py-3 text-right">Stok</th>
                <th class="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in products" :key="item.sku" class="border-t">
                <td class="px-4 py-3">{{ item.brand }}</td>
                <td class="px-4 py-3 font-mono">{{ item.sku }}</td>
                <td class="px-4 py-3">{{ item.name }}</td>
                <td class="px-4 py-3 text-right font-bold"
                    :class="item.stock < 50 ? 'text-red-600' : ''">
                  {{ formatNumber(item.stock) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <span
                    :class="item.stock < 50
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'"
                    class="px-2 py-1 rounded text-xs"
                  >
                    {{ item.stock < 50 ? 'Kritis' : 'Aman' }}
                  </span>
                </td>
              </tr>

              <tr v-if="products.length === 0">
                <td colspan="5" class="text-center py-10 text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth',
  ssr: false // 🔥 penting: biar tidak jalan di server
})

const { $api } = useNuxtApp()

// STATE
const loading = ref(true)
const selectedRange = ref('7 Hari')
const ranges = ['Hari Ini', '7 Hari', '30 Hari']

const products = ref([])
const totalStok = ref(0)
const totalInbound = ref(0)
const lowStockCount = ref(0)

const fetchDashboard = async () => {
  const token = localStorage.getItem('token')

  const res = await $api('/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    }
  })

  products.value = res.products.map(p => ({
    brand: p.brand?.name || '-',
    sku: p.sku,
    name: p.name,
    stock: Number(p.stock) || 0
  }))

  totalStok.value = Number(res.total_stock) || 0
  lowStockCount.value = Number(res.low_stock) || 0
  totalInbound.value = Number(res.total_inbound) || 0
}

// INIT
onMounted(async () => {
  try {
    // ⏳ Delay kecil biar Nuxt & localStorage siap
    await new Promise(resolve => setTimeout(resolve, 50))

    const token = localStorage.getItem('token')

    // 🔐 Kalau tidak ada token → login
    if (!token) {
      return navigateTo('/login')
    }

    await fetchDashboard()

  } catch (err) {
    console.log('❌ DASHBOARD ERROR:', err)

    // kalau token invalid / expired
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigateTo('/login')

  } finally {
    loading.value = false
  }
})

// FORMAT NUMBER
const formatNumber = (val) => {
  return new Intl.NumberFormat('id-ID').format(val || 0)
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-2xl p-5 shadow-sm border border-gray-100;
}
.title {
  @apply text-xs text-gray-500 mb-1;
}
.value {
  @apply text-3xl font-bold text-gray-900;
}
.sub {
  @apply text-xs text-gray-400 mt-2 flex items-center gap-2;
}
.badge {
  @apply px-2 py-0.5 rounded text-[10px] font-medium;
}
.badge.blue { @apply bg-blue-100 text-blue-600 }
.badge.green { @apply bg-green-100 text-green-600 }
.badge.purple { @apply bg-purple-100 text-purple-600 }
.badge.red { @apply bg-red-100 text-red-600 }

.icon {
  @apply w-10 h-10 flex items-center justify-center rounded-xl;
}
.icon.blue { @apply bg-blue-100 text-blue-600 }
.icon.green { @apply bg-green-100 text-green-600 }
.icon.purple { @apply bg-purple-100 text-purple-600 }
.icon.red { @apply bg-red-100 text-red-600 }

@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f3f4f6 25%,
    #e5e7eb 37%,
    #f3f4f6 63%
  );
  background-size: 400px 100%;
  animation: shimmer 1.2s infinite linear;
  border-radius: 6px;
}
</style>