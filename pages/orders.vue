<template>
  <div class="w-full px-4 md:px-0 pb-20 md:pb-10 space-y-5">

    <!-- HEADER -->
    <div>
      <h2 class="text-lg md:text-2xl font-bold text-gray-800">Input Order</h2>
      <p class="text-xs md:text-sm text-gray-500">Buat order baru dan kelola pengiriman</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">

      <!-- FORM -->
      <form @submit.prevent="submitOrder" class="card space-y-5">

        <!-- RESI -->
        <div>
          <label class="label">No. Resi</label>
          <input 
            v-model="form.waybill_number" 
            class="input font-mono uppercase text-sm md:text-base" 
            placeholder="WB-001"
          />
        </div>

        <!-- CUSTOMER -->
        <div>
          <label class="label">Customer</label>
          <input 
            v-model="form.customer_name" 
            class="input" 
            placeholder="Nama Customer" 
          />
        </div>

        <!-- PLATFORM -->
        <div>
          <label class="label">Platform</label>
          <div class="relative">
            <select v-model="form.platform" class="input">
              <option value="">Pilih Platform</option>
              <option v-for="p in platformOptions" :key="p" :value="p">
                {{ p }}
              </option>
            </select>
            <span class="dropdown-icon material-symbols-outlined">expand_more</span>
          </div>
        </div>

        <!-- STORE -->
        <div>
          <label class="label">Nama Toko</label>
          <input 
            v-model="form.store" 
            class="input" 
            placeholder="Nama Toko" 
          />
        </div>

        <!-- EKSPEDISI -->
        <div>
          <label class="label">Ekspedisi</label>
          <div class="relative">
            <select v-model="form.courier" class="input">
              <option value="">Pilih Ekspedisi</option>
              <option v-for="c in courierOptions" :key="c" :value="c">
                {{ c }}
              </option>
            </select>
            <span class="dropdown-icon material-symbols-outlined">expand_more</span>
          </div>
        </div>

        <!-- ITEMS -->
        <div>
          <label class="label">Daftar Produk</label>

          <div class="space-y-2 mt-2">
            <div 
              v-for="(item, i) in form.items" 
              :key="i" 
              class="flex gap-2"
            >
              <div class="relative w-full">
                <select v-model="item.product_id" class="input">
                  <option value="">Pilih Produk</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">
                    {{ p.sku }} - {{ p.name }}
                  </option>
                </select>
                <span class="dropdown-icon material-symbols-outlined">expand_more</span>
              </div>

              <input 
                type="number" 
                v-model.number="item.quantity"
                min="1"
                class="input w-24 text-center" 
              />

              <button 
                type="button"
                @click="removeItem(i)"
                class="text-red-500 px-2"
              >
                ✕
              </button>
            </div>

            <button 
              type="button" 
              @click="addItem"
              class="flex items-center gap-2 text-blue-600 text-xs md:text-sm font-semibold mt-2 hover:text-blue-700 transition"
            >
              <span class="material-symbols-outlined text-base">add_circle</span>
              Tambah Item
            </button>
          </div>
        </div>

        <!-- BUTTON -->
        <button class="btn-primary" :disabled="loading">
          {{ loading ? 'Menyimpan...' : 'Simpan Order' }}
        </button>

      </form>

      <!-- HISTORY -->
      <div class="card">

        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-sm md:text-base text-gray-800">Riwayat Order</h3>

          <NuxtLink 
            to="/orders-history"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-all group"
          >
            Lihat Semua
            <span class="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <!-- LOADING -->
          <div v-if="loadingData" class="space-y-3 animate-pulse">
            <div v-for="i in 3" :key="i" class="p-3 border rounded-xl">
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-3 bg-gray-100 rounded w-1/3"></div>
            </div>
          </div>

          <!-- DATA -->
          <template v-else>
            <div 
              v-for="o in recentOrders" 
              :key="o.id"
              class="p-3 border rounded-xl hover:bg-gray-50 transition"
            >
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-semibold text-gray-800">
                    {{ o.order_number }}
                  </div>
                  <div class="text-[10px] md:text-xs text-gray-400">
                    {{ o.waybill_number }}
                  </div>
                </div>

                <span class="badge">
                  {{ o.status || 'pending' }}
                </span>
              </div>

              <div class="text-xs md:text-sm text-gray-600 mt-1">
                {{ o.customer_name }}
              </div>
            </div>

            <!-- EMPTY -->
            <div v-if="!recentOrders.length" class="text-center text-gray-400 py-6">
              Belum ada order
            </div>
          </template>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

// ================= STATE =================
const loading = ref(false)
const loadingData = ref(true)

const products = ref([])
const orders = ref([])
const mappings = ref([])

// ================= FETCH =================
const fetchData = async () => {
  loadingData.value = true

  try {
    const [p, o, m] = await Promise.all([
      $api('/products'),
      $api('/orders'),
      $api('/warehouse-mappings')
    ])

    products.value = Array.isArray(p) ? p : p.data || []
    orders.value = Array.isArray(o) ? o : o.data || []
    mappings.value = Array.isArray(m) ? m : m.data || []

  } catch (err) {
    console.log('❌ FETCH ERROR:', err)

    Swal.fire({
      icon: 'error',
      title: 'Gagal load data',
      text: 'Tidak bisa mengambil data dari server'
    })

  } finally {
    loadingData.value = false
  }
}

onMounted(fetchData)

// ================= OPTIONS =================
const platformOptions = computed(() => {
  return [...new Set(
    mappings.value.map(m => m.platform).filter(Boolean)
  )]
})

const courierOptions = computed(() => {
  return [...new Set(
    mappings.value.map(m => m.logistics_provider).filter(Boolean)
  )]
})

// ================= RECENT =================
const recentOrders = computed(() => {
  return [...orders.value]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
})

// ================= FORM =================
const form = ref({
  waybill_number: '',
  customer_name: '',
  platform: '',
  store: '',
  courier: '',
  items: [{ product_id: '', quantity: 1 }]
})

// ================= AUTO DETECT =================
watch(() => form.value.waybill_number, (val) => {
  if (!val) return

  const found = mappings.value.find(m =>
    val.toUpperCase().startsWith(m.prefix_code)
  )

  if (found) {
    form.value.platform = found.platform
    form.value.courier = found.logistics_provider
  }
})

// ================= ITEM =================
const addItem = () => {
  form.value.items.push({ product_id: '', quantity: 1 })
}

const removeItem = (i) => {
  form.value.items.splice(i, 1)
}

// ================= SUBMIT =================
const submitOrder = async () => {

  // VALIDASI
  if (!form.value.waybill_number) {
    return Swal.fire({
      icon: 'warning',
      title: 'Resi kosong',
      text: 'No. Resi wajib diisi'
    })
  }

  if (!form.value.items.length || !form.value.items[0].product_id) {
    return Swal.fire({
      icon: 'warning',
      title: 'Produk kosong',
      text: 'Minimal 1 produk harus dipilih'
    })
  }

  for (const item of form.value.items) {
    if (!item.product_id || item.quantity < 1) {
      return Swal.fire({
        icon: 'warning',
        title: 'Data tidak valid',
        text: 'Pastikan produk dan qty sudah benar'
      })
    }
  }

  // CEK DUPLIKAT
  const exists = orders.value.find(o =>
    o.waybill_number === form.value.waybill_number
  )

  if (exists) {
    return Swal.fire({
      icon: 'error',
      title: 'Duplikat',
      text: 'Waybill sudah terdaftar'
    })
  }

  // CONFIRM
  const confirm = await Swal.fire({
    title: 'Simpan order?',
    text: 'Data order akan dibuat',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, simpan',
    cancelButtonText: 'Batal'
  })

  if (!confirm.isConfirmed) return

  loading.value = true

  try {
    await $api('/orders', {
      method: 'POST',
      body: form.value
    })

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Order berhasil dibuat',
      timer: 1500,
      showConfirmButton: false
    })

    // reset
    form.value = {
      waybill_number: '',
      customer_name: '',
      platform: '',
      store: '',
      courier: '',
      items: [{ product_id: '', quantity: 1 }]
    }

    await fetchData()

  } catch (e) {
    console.log('❌ SUBMIT ERROR:', e)

    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: e?.data?.message || 'Gagal menyimpan order'
    })
  } finally {
    loading.value = false
  }
}

// ================= AUTO FOCUS =================
onMounted(() => {
  document.querySelector('input')?.focus()
})
</script>

<style scoped>
.card {
  @apply bg-white p-6 rounded-2xl border shadow-sm;
}

.input {
  @apply w-full border rounded-lg px-3 py-2 text-xs md:text-sm outline-none appearance-none pr-10 bg-white;
}

.dropdown-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs md:text-sm;
}

.btn-primary {
  @apply w-full bg-blue-600 text-white py-3 rounded-xl text-sm md:text-base font-semibold 
         hover:bg-blue-700 transition shadow-sm;
}

.badge {
  @apply bg-blue-50 text-blue-600 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold;
}
.label {
  @apply text-xs md:text-sm font-medium text-gray-600;
}


</style>
