<template>
  <div class="px-4 md:px-0 pb-20 md:pb-10 max-w-7xl mx-auto">

    <!-- BREADCRUMB -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <NuxtLink to="/" class="hover:text-blue-600">Dashboard</NuxtLink>
      <span>/</span>
      <NuxtLink to="/outbound-scan" class="hover:text-blue-600">Scan Outbound</NuxtLink>
      <span>/</span>
      <span class="text-gray-700 font-semibold">History</span>
    </div>

    <!-- HEADER -->
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-lg md:text-2xl font-bold">Riwayat Lengkap Outbound</h2>

      <NuxtLink 
        to="/outbound-scan" 
        class="inline-flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </NuxtLink>
    </div>

    <!-- FILTER -->
    <div class="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">

      <!-- DATE -->
      <div class="relative flex items-center">
        <input ref="dateRef" type="text" placeholder="Pilih tanggal..." class="input pr-10" readonly />

        <span class="material-symbols-outlined icon">
          calendar_today
        </span>
      </div>

      <!-- BRAND -->
      <div v-if="isSuperAdmin" ref="brandRef" class="relative">
        <div @click.stop="showBrand = !showBrand" class="dropdown-input">
          {{ filterBrand || 'Semua Brand' }}
          <span class="material-symbols-outlined">expand_more</span>
        </div>

        <div v-if="showBrand" class="dropdown-menu">
          <div @click="selectBrand('')" class="dropdown-item">
            Semua Brand
          </div>

          <div v-for="item in brandOptions" :key="item" @click="selectBrand(item)" class="dropdown-item">
            {{ item }}
          </div>
        </div>
      </div>

      <!-- PLATFORM -->
      <div ref="platformRef" class="relative">
        <div @click.stop="showPlatform = !showPlatform" class="dropdown-input">
          {{ filterPlatform || 'Semua Platform' }}
          <span class="material-symbols-outlined">expand_more</span>
        </div>

        <div v-if="showPlatform" class="dropdown-menu">
          <div @click="selectPlatform('')" class="dropdown-item">
            Semua Platform
          </div>

          <div v-for="item in platformOptions" :key="item" @click="selectPlatform(item)"class="dropdown-item">
            {{ item }}
          </div>
        </div>
      </div>

      <!-- COURIER -->
      <div ref="courierRef" class="relative">
        <div @click.stop="showCourier = !showCourier" class="dropdown-input">
          {{ filterCourier || 'Semua Ekspedisi' }}
          <span class="material-symbols-outlined">expand_more</span>
        </div>

        <div v-if="showCourier" class="dropdown-menu">
          <div @click="selectCourier('')" class="dropdown-item">
            Semua Ekspedisi
          </div>

          <div v-for="item in courierOptions" :key="item" @click="selectCourier(item)" class="dropdown-item">
            {{ item }}
          </div>
        </div>
      </div>

      <!-- RESET -->
      <button @click="resetFilter" class="bg-gray-100 hover:bg-gray-200 text-[10px] md:text-xs rounded-md px-2 md:px-3 py-1.5 h-[40px] md:h-[44px]">
        Reset
      </button>

    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl border overflow-x-auto">
      <table class="w-full text-xs md:text-sm min-w-[700px]">
        <thead class="bg-gray-50 text-gray-500">
          <tr>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left text-[10px] md:text-xs">Tanggal</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left text-[10px] md:text-xs">Waybill</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left text-[10px] md:text-xs">Brand</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left text-[10px] md:text-xs">Platform</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left text-[10px] md:text-xs">SKU</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left text-[10px] md:text-xs">Qty</th>
          </tr>
        </thead>

        <tbody>
          <template v-if="loading">
            <tr v-for="i in 6" :key="i" class="animate-pulse border-t">
              <td class="px-2 md:px-3 py-2 md:py-3 text-[11px] md:text-sm">
                <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div class="h-3 bg-gray-100 rounded w-16"></div>
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-[11px] md:text-sm">
                <div class="h-4 bg-gray-200 rounded w-32"></div>
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-[11px] md:text-sm">
                <div class="h-4 bg-gray-200 rounded w-24"></div>
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-[11px] md:text-sm">
                <div class="h-4 bg-gray-200 rounded w-28"></div>
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-[11px] md:text-sm">
                <div class="h-4 bg-gray-200 rounded w-20"></div>
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-[11px] md:text-sm text-center">
                <div class="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
              </td>
            </tr>
          </template>

          <!-- ================= DATA ================= -->
          <template v-else>
            <tr
              v-for="item in filteredHistory"
              :key="item.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="p-3">
                {{ item.date }} <br />
                <span class="text-xs text-gray-400">{{ item.time }}</span>
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 font-mono text-[10px] md:text-sm">{{ item.receipt }}</td>

              <td class="p-3">{{ item.brand }}</td>

              <td class="p-3">
                {{ item.platform }} / {{ item.ekspedisi }}
              </td>

              <td class="p-3">
                {{ item.sku }}
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-center text-red-500 font-bold text-xs md:text-sm">
                -{{ item.qty }}
              </td>
            </tr>

            <!-- EMPTY -->
            <tr v-if="filteredHistory.length === 0">
              <td colspan="6" class="text-center p-6 text-gray-400">
                Tidak ada data
              </td>
            </tr>
          </template>

        </tbody>
      </table>
    </div>

    <!-- FOOTER -->
    <div class="mt-4 text-xs md:text-sm text-gray-500">
      Menampilkan {{ filteredHistory.length }} data
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { nextTick } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

// =====================
// USER
// =====================
const user = ref(null)

const isSuperAdmin = computed(() => {
  return user.value?.role === 'super_admin'
})

// =====================
// STATE
// =====================
const loading = ref(true)
const allOutboundHistory = ref([])

const brandOptions = ref([])
const platformOptions = ref([])
const courierOptions = ref([])

// =====================
// FILTER
// =====================
const filterDate = ref('')
const filterBrand = ref('')
const filterPlatform = ref('')
const filterCourier = ref('')

// =====================
// DATEPICKER
// =====================
const dateRef = ref(null)
let picker = null

// =====================
// DROPDOWN STATE
// =====================
const showBrand = ref(false)
const showPlatform = ref(false)
const showCourier = ref(false)

const brandRef = ref(null)
const platformRef = ref(null)
const courierRef = ref(null)

// =====================
// FETCH DATA
// =====================
const fetchData = async () => {
  loading.value = true

  try {
    const res = await $api('/transactions')

    const data = res?.data?.data ?? res?.data ?? res ?? []

    const mapped = data
      .filter(item => item.type === 'outbound')
      .map(item => ({
        id: item.id,
        raw_date: item.transaction_date ?? item.created_at,
        date: new Date(item.transaction_date ?? item.created_at).toLocaleDateString('id-ID'),
        time: new Date(item.transaction_date ?? item.created_at).toLocaleTimeString('id-ID'),
        receipt: item.order?.waybill_number || item.reference_number,
        brand: item.product?.brand?.name || '-',
        ekspedisi: item.order?.courier || item.courier || '-',
        platform: item.order?.platform || item.platform || '-',
        sku: item.product?.sku || '-',
        qty: item.quantity
      }))

    allOutboundHistory.value = mapped

    brandOptions.value = [...new Set(mapped.map(i => i.brand).filter(i => i && i !== '-'))]
    platformOptions.value = [...new Set(mapped.map(i => i.platform).filter(i => i && i !== '-'))]
    courierOptions.value = [...new Set(mapped.map(i => i.ekspedisi).filter(i => i && i !== '-'))]

  } catch (err) {
    console.log('❌ FETCH ERROR:', err)
  } finally {
    loading.value = false
  }
}

// =====================
// DROPDOWN ACTIONS
// =====================
const selectBrand = (val) => {
  filterBrand.value = val || ''
  showBrand.value = false
}

const selectPlatform = (val) => {
  filterPlatform.value = val || ''
  showPlatform.value = false
}

const selectCourier = (val) => {
  filterCourier.value = val || ''
  showCourier.value = false
}

// =====================
// CLICK OUTSIDE
// =====================
const handleClickOutside = (e) => {
  if (brandRef.value && !brandRef.value.contains(e.target)) {
    showBrand.value = false
  }
  if (platformRef.value && !platformRef.value.contains(e.target)) {
    showPlatform.value = false
  }
  if (courierRef.value && !courierRef.value.contains(e.target)) {
    showCourier.value = false
  }
}

// =====================
// FILTER LOGIC
// =====================
const filteredHistory = computed(() => {
  let result = allOutboundHistory.value

  if (filterDate.value) {
    result = result.filter(item => {
      const d = new Date(item.raw_date).toISOString().split('T')[0]
      return d === filterDate.value
    })
  }

  if (isSuperAdmin.value && filterBrand.value) {
    result = result.filter(item => item.brand === filterBrand.value)
  }

  if (!isSuperAdmin.value) {
    result = result.filter(item => item.brand === user.value?.brand?.name)
  }

  if (filterPlatform.value) {
    result = result.filter(item => item.platform === filterPlatform.value)
  }

  if (filterCourier.value) {
    result = result.filter(item => item.ekspedisi.includes(filterCourier.value))
  }

  return result
})

// =====================
// RESET
// =====================
const resetFilter = () => {
  filterDate.value = ''
  filterBrand.value = ''
  filterPlatform.value = ''
  filterCourier.value = ''

  if (picker) picker.clearSelection()

  if (!isSuperAdmin.value) {
    filterBrand.value = user.value?.brand?.name || ''
  }
}

// =====================
// INIT
// =====================
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem('user') || '{}')

  await fetchData()
  await nextTick() // 🔥 WAJIB

  document.addEventListener('click', handleClickOutside)
  // SSR SAFE DATEPICKER
  if (process.client) {

     await nextTick()

    if (!dateRef.value) return
    
    const Litepicker = (await import('litepicker')).default
    await import('litepicker/dist/css/litepicker.css')

    picker = new Litepicker({
      element: dateRef.value,
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
          filterDate.value = date.format('YYYY-MM-DD')
        })
      }
    })
  }

  if (!isSuperAdmin.value) {
    filterBrand.value = user.value?.brand?.name || ''
  }
})

// =====================
// CLEANUP
// =====================
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (picker) picker.destroy()
})
</script>

<style scoped>
.input {
  @apply w-full border rounded-xl px-3 py-2 text-xs md:text-sm outline-none;
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