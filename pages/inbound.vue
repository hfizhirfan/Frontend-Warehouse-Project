<template>
  <div class="px-4 md:px-0 pb-20 md:pb-10 max-w-7xl mx-auto">

    <!-- HEADER -->
    <div class="mb-6 flex items-center">
      <div class="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mr-3">
        <span class="material-symbols-outlined">move_to_inbox</span>
      </div>
      <div>
        <h2 class="text-xl font-bold">Penerimaan Barang (Inbound)</h2>
        <p class="text-sm text-gray-500">Terhubung ke sistem ledger</p>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">

      <!-- FORM -->
      <div class="w-full lg:w-1/3">
        <div class="bg-white rounded-2xl shadow-sm border p-6">
          <h3 class="font-bold mb-4">Form Input</h3>

          <form @submit.prevent="submitInbound" class="space-y-4">

            <!-- BRAND -->
            <div ref="brandRef" class="relative">
              <div @click.stop="toggleBrand" class="dropdown-input">
                {{ selectedBrandName || 'Klik untuk pilih Brand...' }}
                <span class="material-symbols-outlined">expand_more</span>
              </div>

              <div v-if="showBrand" class="dropdown-menu">
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

            <!-- PRODUCT -->
            <div ref="productRef" class="relative">
              <div 
                @click.stop="toggleProduct"
                class="dropdown-input"
                :class="!form.brand_id && 'opacity-50 cursor-not-allowed'"
              >
                {{ selectedProductName || 'Klik untuk pilih Produk...' }}
                <span class="material-symbols-outlined">expand_more</span>
              </div>

              <div v-if="showProduct" class="dropdown-menu">
                <div v-for="p in filteredProducts" :key="p.id" @click="selectProduct(p)" class="dropdown-item">
                  <div class="font-semibold">{{ p.sku }}</div>
                  <div class="text-xs text-gray-400">{{ p.name }}</div>
                </div>
              </div>
            </div>

            <!-- QTY -->
            <input type="number" v-model.number="form.quantity" class="input" placeholder="Qty" :disabled="isGuest"/>

            <!-- TANGGAL -->
            <div class="relative">
              <input ref="dateInput" type="text" placeholder="Pilih tanggal..." class="input pr-10" readonly />

              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                calendar_today
              </span>
            </div>

            <!-- INVOICE -->
            <input type="text" v-model="form.invoice_number" class="input" placeholder="Invoice Number" :disabled="isGuest"/>

            <!-- SUPPLIER -->
            <input type="text" v-model="form.supplier" class="input" placeholder="Supplier" :disabled="isGuest" />

            <!-- REMARK -->
            <input type="text" v-model="form.remark" class="input" placeholder="Remark" :disabled="isGuest"/>

            <!-- BUTTON -->
            <button v-if="!isGuest" type="submit" :disabled="loading" class="btn-primary">
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>

            <!-- INFO GUEST -->
            <p v-if="isGuest" class="text-xs text-red-500 text-center">
              Anda hanya memiliki akses lihat (read-only)
            </p>

          </form>
        </div>
      </div>

      <!-- HISTORY -->
      <div class="w-full lg:w-2/3">
        <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <!-- HEADER -->
          <div class="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 class="font-bold text-gray-800">Riwayat Inbound</h3>

            <NuxtLink 
              to="/inbound-history"
              class="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all group"
            >
              Lihat Semua
              <span class="material-symbols-outlined text-sm group-hover:translate-x-1">
                arrow_forward
              </span>
            </NuxtLink>
          </div>

          <!-- 🔥 SKELETON -->
          <div v-if="loadingPage" class="p-6 space-y-4">
            <div v-for="n in 6" :key="n" class="grid grid-cols-5 gap-4">
              <div class="skeleton h-4"></div>
              <div class="skeleton h-4"></div>
              <div class="skeleton h-4"></div>
              <div class="skeleton h-4"></div>
              <div class="skeleton h-4"></div>
            </div>
          </div>
          
          <div v-else class="overflow-x-auto">

            <table class="w-full text-xs md:text-sm min-w-[650px]">
              
              <!-- HEADER -->
              <thead class="bg-gray-50 text-gray-500 text-[10px] md:text-xs uppercase">
                <tr>
                  <th class="px-3 md:px-6 py-2 md:py-3 text-left">Tanggal</th>
                  <th class="px-3 md:px-6 py-2 md:py-3 text-left">Invoice</th>
                  <th class="px-3 md:px-6 py-2 md:py-3 text-left">Produk</th>
                  <th class="px-3 md:px-6 py-2 md:py-3 text-right">Qty</th>
                  <th class="px-3 md:px-6 py-2 md:py-3 text-left">Supplier</th>
                </tr>
              </thead>

              <!-- BODY -->
              <tbody>
                <tr 
                  v-for="item in inboundHistory.slice(0, 8)" 
                  :key="item.id"
                  class="border-t hover:bg-gray-50 transition"
                >
                  <!-- TANGGAL -->
                  <td class="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    {{ formatDate(item.transaction_date || item.created_at) }}
                  </td>

                  <!-- INVOICE -->
                  <td class="px-3 md:px-6 py-2 md:py-4 font-mono text-[10px] md:text-xs">
                    {{ item.reference_number || '-' }}
                  </td>

                  <!-- PRODUK -->
                  <td class="px-3 md:px-6 py-2 md:py-4">
                    <div class="font-semibold text-gray-800">
                      {{ item.product?.sku || '-' }}
                    </div>
                    <div class="text-[10px] md:text-xs text-gray-400 line-clamp-1">
                      {{ item.product?.name || '' }}
                    </div>
                  </td>

                  <!-- QTY -->
                  <td class="px-3 md:px-6 py-2 md:py-4 text-right">
                    <span class="bg-green-100 text-green-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold">
                      +{{ item.quantity }}
                    </span>
                  </td>

                  <!-- SUPPLIER -->
                  <td class="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-[10px] md:text-sm">
                    {{ item.supplier || '-' }}
                  </td>
                </tr>

                <!-- EMPTY -->
                <tr v-if="!inboundHistory.length">
                  <td colspan="5" class="text-center py-8 text-gray-400 text-xs">
                    Belum ada data inbound
                  </td>
                </tr>
              </tbody>

            </table>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Swal from 'sweetalert2'

const { $api } = useNuxtApp()

// USER
const user = process.client
  ? JSON.parse(localStorage.getItem('user') || '{}')
  : {}

const isGuest = user.role === 'guest'

// STATE
const loading = ref(false)
const loadingPage = ref(true)

const brands = ref([])
const products = ref([])
const transactions = ref([])

// ================= DATEPICKER =================
const dateInput = ref(null)
let picker = null

// ================= FETCH =================
const fetchData = async () => {
  loadingPage.value = true

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
    Swal.fire({
      icon: 'error',
      title: 'Gagal load data'
    })
  } finally {
    loadingPage.value = false
  }
}

// ================= FORM =================
const form = ref({
  brand_id: '',
  product_id: '',
  quantity: null,
  invoice_number: '',
  supplier: '',
  remark: '',
  transaction_date: ''
})

// ================= DROPDOWN =================
const showBrand = ref(false)
const showProduct = ref(false)

const brandRef = ref(null)
const productRef = ref(null)

// BRAND
const toggleBrand = () => {
  showBrand.value = !showBrand.value
}

const selectBrand = (b) => {
  form.value.brand_id = b.id
  form.value.product_id = ''
  showBrand.value = false
}

const selectedBrandName = computed(() => {
  return brands.value.find(b => b.id == form.value.brand_id)?.name
})

// PRODUCT
const toggleProduct = () => {
  if (!form.value.brand_id) return
  showProduct.value = !showProduct.value
}

const selectProduct = (p) => {
  form.value.product_id = p.id
  showProduct.value = false
}

const selectedProductName = computed(() => {
  const p = products.value.find(p => p.id == form.value.product_id)
  return p ? `${p.sku} - ${p.name}` : ''
})

// FILTER
const filteredProducts = computed(() => {
  return products.value.filter(p => p.brand_id == form.value.brand_id)
})

const inboundHistory = computed(() => {
  return transactions.value.filter(t => t.type === 'inbound')
})

// ================= CLICK OUTSIDE =================
const handleClickOutside = (e) => {
  if (brandRef.value && !brandRef.value.contains(e.target)) {
    showBrand.value = false
  }
  if (productRef.value && !productRef.value.contains(e.target)) {
    showProduct.value = false
  }
}

// ================= INIT =================
onMounted(async () => {
  fetchData()

  // ✅ FIX SSR: hanya jalan di client
  if (process.client) {
    const Litepicker = (await import('litepicker')).default
    await import('litepicker/dist/css/litepicker.css')

    picker = new Litepicker({
      element: dateInput.value,
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
          form.value.transaction_date = date.format('YYYY-MM-DD')
        })
      }
    })
  }

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)

  if (picker) {
    picker.destroy()
  }
})

// ================= FORMAT =================
const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID')
}

// ================= SUBMIT =================
const submitInbound = async () => {
  if (!form.value.product_id || !form.value.quantity) {
    Swal.fire({
      icon: 'warning',
      title: 'Data belum lengkap',
      text: 'Pilih produk dan isi qty dulu'
    })
    return
  }

  loading.value = true

  try {
    await $api('/transactions/inbound', {
      method: 'POST',
      body: {
        product_id: form.value.product_id,
        qty: form.value.quantity,
        reference_type: 'invoice',
        reference_number: form.value.invoice_number,
        supplier: form.value.supplier,
        remark: form.value.remark,
        transaction_date: form.value.transaction_date
      }
    })

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Data inbound berhasil disimpan',
      timer: 1500,
      showConfirmButton: false
    })

    form.value = {
      brand_id: form.value.brand_id,
      product_id: '',
      quantity: null,
      invoice_number: '',
      supplier: '',
      remark: '',
      transaction_date: ''
    }

    // reset calendar UI
    if (picker) picker.clearSelection()

    await fetchData()

  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: e?.data?.message || 'Gagal menyimpan data'
    })
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.input {
  @apply w-full border p-3 rounded-xl text-sm;
}

.btn-primary {
   @apply w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition;
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

.dropdown-input {
  @apply w-full border rounded-xl px-4 py-3 bg-white flex justify-between items-center cursor-pointer shadow-sm;
}

.dropdown-menu {
  @apply absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-lg border max-h-60 overflow-auto;
}

.dropdown-item {
  @apply px-4 py-3 cursor-pointer hover:bg-gray-100 transition;
}


.litepicker {
  border-radius: 16px !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
  border: none !important;
  font-family: inherit;
}

.litepicker .container__months {
  border-radius: 16px;
}

.litepicker .day-item.is-today {
  color: #2563eb;
}

.litepicker .day-item.is-selected {
  background: #2563eb;
  color: white;
  border-radius: 8px;
}
</style>