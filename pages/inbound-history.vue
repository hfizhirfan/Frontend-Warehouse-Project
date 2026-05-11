<template>
  <div class="max-w-7xl mx-auto px-4 md:px-0 pb-20 md:pb-10">
    <!-- BREADCRUMB -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <NuxtLink to="/" class="hover:text-blue-600">Dashboard</NuxtLink>
      <span>/</span>
      <NuxtLink to="/inbound" class="hover:text-blue-600">Inbound</NuxtLink>
      <span>/</span>
      <span class="text-gray-700 font-semibold">History</span>
    </div>
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
      <div>
        <h2 class="text-2xl font-bold">Semua Inbound</h2>
        <p class="text-sm text-gray-500">Monitoring seluruh barang masuk</p>
      </div>

      <div class="flex items-center gap-2">

        <!-- RESET -->
        <button 
          @click="resetFilter"
          class="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Reset Filter
        </button>

        <!-- KEMBALI -->
        <NuxtLink
          to="/inbound"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg 
                bg-gray-100 text-gray-700 text-sm font-semibold 
                hover:bg-gray-200 transition"
        >
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          Kembali
        </NuxtLink>

      </div>
    </div>

    <!-- FILTER -->
    <div class="bg-white p-4 md:p-5 rounded-2xl border mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

      <!-- BRAND -->
      <div>
        <div class="flex items-center gap-2 mb-2 text-gray-600">
          <span class="material-symbols-outlined text-sm">store</span>
          <label class="text-sm font-medium">Filter Brand</label>
        </div>

        <div ref="brandRef" class="relative">
          <div @click.stop="toggleBrand" class="dropdown-input">
            {{ selectedBrandName || 'Semua Brand' }}
            <span class="material-symbols-outlined">expand_more</span>
          </div>

          <div v-if="showBrand" class="dropdown-menu">
            <div @click="selectBrand(null)" class="dropdown-item">
              Semua Brand
            </div>

            <div 
              v-for="b in brands" 
              :key="b.id"
              @click="selectBrand(b)"
              class="dropdown-item"
            >
              {{ b.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- SKU -->
      <div>
        <div class="flex items-center gap-2 mb-2 text-gray-600">
          <span class="material-symbols-outlined text-sm">inventory_2</span>
          <label class="text-sm font-medium">Filter Produk (SKU)</label>
        </div>

        <div ref="productRef" class="relative">
          <div 
            @click.stop="toggleProduct"
            class="dropdown-input"
            :class="!filter.brand_id && 'opacity-50 cursor-not-allowed'"
          >
            {{ selectedProductName || 'Semua SKU' }}
            <span class="material-symbols-outlined">expand_more</span>
          </div>

          <div v-if="showProduct" class="dropdown-menu">
            <div @click="selectProduct(null)" class="dropdown-item">
              Semua SKU
            </div>

            <div 
              v-for="p in filteredProducts" 
              :key="p.id"
              @click="selectProduct(p)"
              class="dropdown-item"
            >
              <div class="font-semibold">{{ p.sku }}</div>
              <div class="text-xs text-gray-400 line-clamp-1">{{ p.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- DATE FROM -->
      <div>
        <div class="flex items-center gap-2 mb-2 text-gray-600">
          <span class="material-symbols-outlined text-sm">calendar_month</span>
          <label class="text-sm font-medium">Dari Tanggal</label>
        </div>

        <div class="relative">
          <input 
            ref="startDateRef"
            type="text"
            placeholder="Pilih tanggal..."
            class="input pr-10"
            readonly
          />
          <span class="material-symbols-outlined icon">calendar_today</span>
        </div>
      </div>

      <!-- DATE TO -->
      <div>
        <div class="flex items-center gap-2 mb-2 text-gray-600">
          <span class="material-symbols-outlined text-sm">event</span>
          <label class="text-sm font-medium">Sampai Tanggal</label>
        </div>

        <div class="relative">
          <input 
            ref="endDateRef"
            type="text"
            placeholder="Pilih tanggal..."
            class="input pr-10"
            readonly
          />
          <span class="material-symbols-outlined icon">calendar_today</span>
        </div>
      </div>

    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-2xl border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs md:text-sm min-w-[750px]">

          <!-- HEADER -->
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left">Tanggal</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left">Brand</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left">SKU</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left">Invoice</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-right">Qty</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left">Supplier</th>
            </tr>
          </thead>

          <tbody class="divide-y">

            <!-- 🔥 SKELETON -->
            <tr v-if="loading">
              <td colspan="6" class="p-0">
                <div class="p-6 space-y-4">

                  <div 
                    v-for="n in 8" 
                    :key="n" 
                    class="grid grid-cols-6 gap-4 items-center"
                  >
                    <div class="skeleton h-4 w-24"></div> <!-- tanggal -->
                    <div class="skeleton h-4 w-28"></div> <!-- brand -->
                    <div class="space-y-1">
                      <div class="skeleton h-4 w-32"></div> <!-- sku -->
                      <div class="skeleton h-3 w-40"></div> <!-- nama -->
                    </div>
                    <div class="skeleton h-4 w-28"></div> <!-- invoice -->
                    <div class="flex justify-end">
                      <div class="skeleton h-6 w-12 rounded-full"></div> <!-- qty badge -->
                    </div>
                    <div class="skeleton h-4 w-28"></div> <!-- supplier -->
                  </div>

                </div>
              </td>
            </tr>

            <!-- ✅ DATA -->
            <tr 
              v-for="item in filteredInbound" 
              :key="item.id" 
              class="hover:bg-gray-50 transition"
            >
              <td class="px-3 md:px-6 py-2 md:py-4 text-gray-600">
                {{ formatDate(item.created_at) }}
              </td>

              <td class="px-3 md:px-6 py-2 md:py-4">
                {{ item.product?.brand?.name || '-' }}
              </td>

              <td class="px-3 md:px-6 py-2 md:py-4">
                <div class="font-semibold text-gray-800">
                  {{ item.product?.sku || '-' }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ item.product?.name || '' }}
                </div>
              </td>

              <td class="px-3 md:px-6 py-2 md:py-4 font-mono text-gray-800">
                {{ item.reference_number || '-' }}
              </td>

              <td class="px-3 md:px-6 py-2 md:py-4 text-right">
                <span class="bg-green-100 text-green-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold">
                  +{{ item.quantity }}
                </span>
              </td>

              <td class="px-3 md:px-6 py-2 md:py-4 text-gray-700">
                {{ item.supplier || '-' }}
              </td>
            </tr>

            <!-- EMPTY -->
            <tr v-if="!loading && !filteredInbound.length">
              <td colspan="6" class="text-center py-10 text-gray-400">
                <div class="flex flex-col items-center gap-2">
                  <span class="material-symbols-outlined text-3xl">inventory_2</span>
                  <span>Tidak ada data inbound</span>
                </div>
              </td>
            </tr>

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

const brands = ref([])
const products = ref([])
const transactions = ref([])

// =====================
// DATEPICKER
// =====================
const startDateRef = ref(null)
const endDateRef = ref(null)

let startPicker = null
let endPicker = null

// =====================
// DROPDOWN STATE
// =====================
const showBrand = ref(false)
const showProduct = ref(false)

const brandRef = ref(null)
const productRef = ref(null)

// =====================
// FETCH DATA
// =====================
const fetchData = async () => {
  loading.value = true

  try {
    const [b, p, t] = await Promise.all([
      $api('/brands'),
      $api('/products'),
      $api('/transactions')
    ])

    brands.value = Array.isArray(b) ? b : b.data || []
    products.value = Array.isArray(p) ? p : p.data || []
    transactions.value = Array.isArray(t) ? t : t.data || []

  } catch (err) {
    console.log('❌ FETCH ERROR:', err)
  } finally {
    loading.value = false
  }
}

// =====================
// FILTER STATE
// =====================
const filter = ref({
  brand_id: '',
  product_id: '',
  start_date: '',
  end_date: ''
})

// =====================
// RESET FILTER
// =====================
const resetFilter = () => {
  filter.value = {
    brand_id: '',
    product_id: '',
    start_date: '',
    end_date: ''
  }

  if (startPicker) startPicker.clearSelection()
  if (endPicker) endPicker.clearSelection()
}

// =====================
// DROPDOWN - BRAND
// =====================
const toggleBrand = () => {
  showBrand.value = !showBrand.value
}

const selectBrand = (b) => {
  filter.value.brand_id = b?.id || ''
  filter.value.product_id = ''
  showBrand.value = false
}

const selectedBrandName = computed(() => {
  return brands.value.find(b => b.id == filter.value.brand_id)?.name
})

// =====================
// DROPDOWN - PRODUCT
// =====================
const toggleProduct = () => {
  if (!filter.value.brand_id) return
  showProduct.value = !showProduct.value
}

const selectProduct = (p) => {
  filter.value.product_id = p?.id || ''
  showProduct.value = false
}

const selectedProductName = computed(() => {
  const p = products.value.find(p => p.id == filter.value.product_id)
  return p ? `${p.sku} - ${p.name}` : ''
})

// =====================
// FILTER PRODUCT
// =====================
const filteredProducts = computed(() => {
  if (!filter.value.brand_id) return products.value
  return products.value.filter(p => p.brand_id == filter.value.brand_id)
})

// =====================
// FILTER INBOUND
// =====================
const filteredInbound = computed(() => {
  return transactions.value
    .filter(t => t.type === 'inbound')
    .filter(t => {

      if (filter.value.brand_id && t.product?.brand_id != filter.value.brand_id) return false
      if (filter.value.product_id && t.product_id != filter.value.product_id) return false

      if (filter.value.start_date) {
        if (new Date(t.created_at) < new Date(filter.value.start_date)) return false
      }

      if (filter.value.end_date) {
        if (new Date(t.created_at) > new Date(filter.value.end_date)) return false
      }

      return true
    })
})

// =====================
// FORMAT DATE
// =====================
const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID')
}

// =====================
// CLICK OUTSIDE
// =====================
const handleClickOutside = (e) => {
  if (brandRef.value && !brandRef.value.contains(e.target)) {
    showBrand.value = false
  }

  if (productRef.value && !productRef.value.contains(e.target)) {
    showProduct.value = false
  }
}

// =====================
// INIT
// =====================
onMounted(async () => {
  await fetchData()

  document.addEventListener('click', handleClickOutside)

  // ✅ SSR SAFE DATEPICKER
  if (process.client) {
    const Litepicker = (await import('litepicker')).default
    await import('litepicker/dist/css/litepicker.css')

    startPicker = new Litepicker({
      element: startDateRef.value,
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
          filter.value.start_date = date.format('YYYY-MM-DD')
        })
      }
    })

    endPicker = new Litepicker({
      element: endDateRef.value,
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
          filter.value.end_date = date.format('YYYY-MM-DD')
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

  if (startPicker) startPicker.destroy()
  if (endPicker) endPicker.destroy()
})
</script>

<style scoped>
.input {
  @apply w-full border rounded-lg px-3 py-2 pr-10 text-sm 
  focus:ring-2 focus:ring-blue-500 outline-none appearance-none;
}

.input {
  @apply w-full border rounded-xl px-4 py-3 text-sm;
}

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

.icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none;
}

.dropdown-input {
  @apply w-full border rounded-xl px-4 py-2 bg-white flex justify-between items-center cursor-pointer shadow-sm;
}

.dropdown-menu {
  @apply absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-lg border max-h-60 overflow-auto;
}

.dropdown-item {
  @apply px-4 py-3 cursor-pointer hover:bg-gray-100 transition;
}
</style>