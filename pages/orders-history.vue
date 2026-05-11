<template>
  <div class="max-w-7xl mx-auto px-4 md:px-0 pb-20 md:pb-10">

    <!-- BREADCRUMB -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <NuxtLink to="/" class="hover:text-blue-600">Dashboard</NuxtLink>
      <span>/</span>
      <NuxtLink to="/orders" class="hover:text-blue-600">Order</NuxtLink>
      <span>/</span>
      <span class="text-gray-700 font-semibold">History</span>
    </div>

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-lg md:text-2xl font-bold">Order History</h2>
        <p class="text-xs md:text-sm text-gray-500">Semua riwayat order</p>
      </div>

      <NuxtLink
        to="/orders"
        class="inline-flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Kembali
      </NuxtLink>
    </div>

    <!-- FILTER -->
    <div class="bg-white border rounded-xl p-4 mb-6 grid md:grid-cols-4 gap-4">

      <!-- SEARCH -->
      <input v-model="filter.search" type="text" placeholder="Cari Order / Waybill / Customer" class="input" />

      <!-- PLATFORM -->
      <div ref="platformRef" class="relative">
        <div @click.stop="showPlatform = !showPlatform" class="dropdown-input">
          {{ filter.platform || 'Semua Platform' }}
          <span class="material-symbols-outlined">expand_more</span>
        </div>

        <div v-if="showPlatform" class="dropdown-menu">
          <div @click="selectPlatform('')" class="dropdown-item">
            Semua Platform
          </div>

          <div v-for="p in platformOptions" :key="p" @click="selectPlatform(p)" class="dropdown-item">
            {{ p }}
          </div>
        </div>
      </div>

      <!-- DATE FROM -->
      <div class="relative">
        <input ref="dateFromRef" type="text" placeholder="Dari tanggal..." class="input pr-10" readonly />
        <span class="material-symbols-outlined icon">calendar_today</span>
      </div>

      <!-- DATE TO -->
      <div class="relative">
        <input
          ref="dateToRef"
          type="text"
          placeholder="Sampai tanggal..."
          class="input pr-10"
          readonly
        />
        <span class="material-symbols-outlined icon">calendar_today</span>
      </div>
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">

        <table class="w-full text-xs md:text-sm min-w-[600px]">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left text-[10px] md:text-xs">Order</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left text-[10px] md:text-xs">Customer</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left text-[10px] md:text-xs">Platform</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left text-[10px] md:text-xs">Items</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left text-[10px] md:text-xs">Tanggal</th>
            </tr>
          </thead>

          <tbody class="divide-y">

            <template v-if="loading">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td class="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                  <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div class="h-3 bg-gray-100 rounded w-24"></div>
                </td>

                <td class="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                  <div class="h-4 bg-gray-200 rounded w-28"></div>
                </td>

                <td class="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                  <div class="h-4 bg-gray-200 rounded w-20"></div>
                </td>

                <td class="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                  <div class="space-y-2">
                    <div class="h-3 bg-gray-200 rounded w-24"></div>
                    <div class="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </td>

                <td class="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                  <div class="h-4 bg-gray-200 rounded w-24"></div>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="o in filteredOrders"
                :key="o.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4">
                  <div class="font-semibold text-sm md:text-base text-gray-800">
                    {{ o.order_number }}
                  </div>
                  <div class="text-[10px] md:text-xs text-gray-400">
                    {{ o.waybill_number || '-' }}
                  </div>
                </td>

                <td class="px-6 py-4 text-gray-700">
                  {{ o.customer_name || '-' }}
                </td>

                <td class="px-6 py-4">
                  <span class="badge">
                    {{ o.platform || 'Manual' }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div
                      v-for="item in o.items"
                      :key="item.id"
                      class="flex items-center text-xs md:text-sm gap-2 md:gap-3"
                    >
                      <span class="font-medium text-gray-700 text-xs md:text-sm w-24">
                        {{ item.product?.sku }}
                      </span>

                      <span class="qty-badge">
                        {{ item.quantity }}
                      </span>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 text-gray-500">
                  {{ formatDate(o.created_at) }}
                </td>
              </tr>

              <!-- EMPTY -->
              <tr v-if="!filteredOrders.length">
                <td colspan="5" class="text-center py-10 text-gray-400">
                  Tidak ada data ditemukan
                </td>
              </tr>
            </template>

          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

// =====================
// STATE
// =====================
const loading = ref(true)
const orders = ref([])

const filter = ref({
  search: '',
  platform: '',
  date_from: '',
  date_to: ''
})

// =====================
// DROPDOWN PLATFORM
// =====================
const showPlatform = ref(false)
const platformRef = ref(null)

const platformOptions = [
  'Shopee',
  'Tokopedia',
  'TikTok',
  'Manual'
]

const selectPlatform = (val) => {
  filter.value.platform = val || ''
  showPlatform.value = false
}

// =====================
// DATEPICKER
// =====================
const dateFromRef = ref(null)
const dateToRef = ref(null)

let pickerFrom = null
let pickerTo = null

// =====================
// FETCH ORDERS
// =====================
const fetchOrders = async () => {
  loading.value = true

  try {
    const res = await $api('/orders')

    orders.value = Array.isArray(res)
      ? res
      : res.data || []

  } catch (err) {
    console.log('❌ FETCH ORDERS ERROR:', err)
  } finally {
    loading.value = false
  }
}

// =====================
// CLICK OUTSIDE
// =====================
const handleClickOutside = (e) => {
  if (platformRef.value && !platformRef.value.contains(e.target)) {
    showPlatform.value = false
  }
}

// =====================
// INIT
// =====================
onMounted(async () => {
  await fetchOrders()

  document.addEventListener('click', handleClickOutside)

  // ✅ SSR SAFE DATEPICKER
  if (process.client) {
    const Litepicker = (await import('litepicker')).default
    await import('litepicker/dist/css/litepicker.css')

    pickerFrom = new Litepicker({
      element: dateFromRef.value,
      singleMode: true,
      format: 'YYYY-MM-DD',
      dropdowns: {
        minYear: 2020,
        maxYear: 2035,
        months: true,
        years: true
      },
      setup: (picker) => {
        picker.on('selected', (date) => {
          filter.value.date_from = date.format('YYYY-MM-DD')
        })
      }
    })

    pickerTo = new Litepicker({
      element: dateToRef.value,
      singleMode: true,
      format: 'YYYY-MM-DD',
      dropdowns: {
        minYear: 2020,
        maxYear: 2035,
        months: true,
        years: true
      },
      setup: (picker) => {
        picker.on('selected', (date) => {
          filter.value.date_to = date.format('YYYY-MM-DD')
        })
      }
    })
  }
})

// =====================
// CLEANUP
// =====================
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)

  if (pickerFrom) pickerFrom.destroy()
  if (pickerTo) pickerTo.destroy()
})

// =====================
// FILTER LOGIC
// =====================
const filteredOrders = computed(() => {
  return orders.value.filter(o => {

    const keyword = filter.value.search.toLowerCase()

    const matchSearch =
      !keyword ||
      o.order_number?.toLowerCase().includes(keyword) ||
      o.waybill_number?.toLowerCase().includes(keyword) ||
      o.customer_name?.toLowerCase().includes(keyword)

    const matchPlatform =
      !filter.value.platform ||
      o.platform === filter.value.platform

    const orderDate = new Date(o.created_at)
    const from = filter.value.date_from ? new Date(filter.value.date_from) : null
    const to = filter.value.date_to ? new Date(filter.value.date_to) : null

    const matchDate =
      (!from || orderDate >= from) &&
      (!to || orderDate <= to)

    return matchSearch && matchPlatform && matchDate
  })
})

// =====================
// FORMAT DATE
// =====================
const formatDate = (d) => {
  return d ? new Date(d).toLocaleDateString('id-ID') : '-'
}
</script>

<style scoped>
.input {
  @apply border rounded-lg px-3 py-2 text-xs md:text-sm outline-none;
}

.badge {
  @apply bg-blue-100 text-blue-600 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold;
}
.qty-badge {
  @apply bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold;
}

.dropdown-input {
  @apply w-full border rounded-xl px-3 md:px-4 py-2 text-xs md:text-sm bg-white flex justify-between items-center cursor-pointer shadow-sm;
}

.dropdown-menu {
  @apply absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-lg border max-h-60 overflow-auto;
}

.dropdown-item {
  @apply px-4 py-3 cursor-pointer hover:bg-gray-100 transition;
}

.icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none;
}
</style>