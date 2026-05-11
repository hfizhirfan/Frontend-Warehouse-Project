<template>
  <div class="px-4 md:px-0 pb-20 md:pb-10 relative">

    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6">

      <div class="flex items-center">
        <span class="material-symbols-outlined text-2xl md:text-3xl text-gray-400 mr-3">
          assignment_return
        </span>
        <h2 class="text-lg md:text-2xl font-bold text-gray-800">
          Manajemen Retur & Batal
        </h2>
      </div>

      <NuxtLink
        to="/retur-history"
        class="flex items-center gap-2 bg-gray-800 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-black transition"
      >
        <span class="material-symbols-outlined text-base">history</span>
        Riwayat Retur
      </NuxtLink>

    </div>

    <div class="flex flex-col lg:flex-row gap-6">

      <!-- ================= FORM ================= -->
      <div class="w-full lg:w-1/3">
        <div class="bg-white rounded-xl shadow-sm border p-6">

          <h3 class="font-semibold text-sm md:text-base mb-4 border-b pb-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-red-500">
              edit_document
            </span>
            Form Retur
          </h3>

          <form @submit.prevent="submitReturn" class="space-y-4">

            <!-- WAYBILL -->
            <div>
              <label class="label">Waybill</label>
              <input
                ref="inputRef"
                v-model="form.waybill"
                @input="form.waybill = form.waybill.toUpperCase()"
                @change="fetchByWaybill"
                class="input font-mono uppercase"
                placeholder="Scan / Input Resi"
              />
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="text-[10px] md:text-xs text-gray-400">
              🔄 Mengambil data...
            </div>

            <!-- PRODUK -->
            <div>
              <label class="label">Produk</label>
              <select
                v-model="form.product_id"
                @change="onSelectProduct"
                class="input"
                :disabled="!orderItems.length"
              >
                <option value="">Pilih Produk</option>

                <option
                  v-for="item in orderItems"
                  :key="item.id"
                  :value="item.product_id"
                >
                  {{ item.product?.sku }} - {{ item.product?.name }}
                  ({{ item.quantity }} pcs)
                </option>

              </select>
            </div>

            <!-- QTY -->
            <div>
              <label class="label">Qty</label>
              <input
                type="number"
                v-model.number="form.qty"
                min="1"
                class="input text-center"
              />
            </div>

            <!-- PLATFORM + EKSPEDISI -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="label">Ekspedisi</label>
                <input
                  v-model="form.ekspedisi"
                  class="input bg-gray-100"
                  readonly
                />
              </div>

              <div>
                <label class="label">Platform</label>
                <input
                  v-model="form.platform"
                  class="input bg-gray-100"
                  readonly
                />
              </div>
            </div>

            <!-- KONDISI -->
            <div>
              <label class="label">Kondisi</label>
              <select v-model="form.condition" class="input">
                <option value="good">🟢 Good</option>
                <option value="defect">🔴 Defect</option>
                <option value="lost">⚫ Lost</option>
              </select>
            </div>

            <!-- BUTTON -->
            <button class="btn-danger">
              Proses Retur
            </button>

          </form>
        </div>
      </div>

      <!-- ================= TABLE ================= -->
      <div class="w-full lg:w-2/3">
        <div class="bg-white rounded-xl border overflow-hidden">

          <div class="px-6 py-4 border-b bg-gray-50 font-bold">
            Riwayat Retur Hari Ini
          </div>

          <table class="w-full text-xs md:text-sm">
            <thead class="bg-gray-50 text-gray-500 text-[10px] md:text-xs uppercase">
              <tr>
                <th class="p-3 text-left">Waybill</th>
                <th class="p-3 text-left">Channel</th>
                <th class="p-3 text-left">Produk</th>
                <th class="p-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="loadingTable" v-for="n in 5" :key="n" class="border-t animate-pulse">
                <td class="p-2 md:p-3 text-xs md:text-sm">
                  <div class="h-4 w-24 bg-gray-200 rounded"></div>
                </td>

                <td class="p-2 md:p-3 text-xs md:text-sm">
                  <div class="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                  <div class="h-3 w-16 bg-gray-100 rounded"></div>
                </td>

                <td class="p-2 md:p-3 text-xs md:text-sm">
                  <div class="h-4 w-28 bg-gray-200 rounded mb-1"></div>
                  <div class="h-3 w-20 bg-gray-100 rounded"></div>
                </td>

                <td class="p-2 md:p-3 text-xs md:text-sm text-center">
                  <div class="h-5 w-16 bg-gray-200 rounded-full mx-auto"></div>
                </td>
              </tr>

              <!-- DATA -->
              <tr
                v-for="item in returns"
                :key="item.id"
                class="border-t hover:bg-gray-50"
              >
                <td class="p-2 md:p-3 font-mono text-xs md:text-sm">
                  {{ item.waybill }}
                </td>

                <td class="p-2 md:p-3 text-[10px] md:text-xs  ">
                  {{ item.platform }} <br />
                  <span class="text-gray-400">{{ item.ekspedisi }}</span>
                </td>

                <td class="p-2 md:p-3 text-xs md:text-sm">
                  {{ item.product?.sku }} <br />
                  <span class="text-xs text-gray-400">
                    {{ item.qty }} pcs
                  </span>
                </td>

                <td class="p-3 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span
                      :class="item.condition === 'good'
                        ? 'badge-green'
                        : 'badge-red'"
                    >
                      {{ item.condition }}
                    </span>

                    <span class="text-xs text-gray-400">
                      {{ item.status }}
                    </span>
                  </div>
                </td>
              </tr>

              <!-- EMPTY -->
              <tr v-if="!loadingTable && returns.length === 0">
                <td colspan="4" class="text-center p-6 text-gray-400">
                  Belum ada data
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
import { ref, onMounted, nextTick } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

// ================= STATE =================
const orderItems = ref([])
const returns = ref([])
const loading = ref(false)
const loadingTable = ref(true)
const inputRef = ref(null)

const form = ref({
  waybill: '',
  product_id: '',
  qty: 1,
  max_qty: 1,
  ekspedisi: 'J&T',
  platform: '',
  condition: 'good'
})

// ================= HELPER =================
const getStatus = (condition) => {
  if (condition === 'good') return 'restocked'
  if (condition === 'defect') return 'damaged'
  return 'lost'
}

// ================= FETCH WAYBILL =================
const fetchByWaybill = async () => {
  if (!form.value.waybill) return

  loading.value = true

  try {
    const res = await $api(`/orders/waybill/${form.value.waybill}`)

    orderItems.value = res.items || []
    form.value.platform = res.platform
    form.value.ekspedisi = res.courier || 'J&T'

  } catch (e) {
    orderItems.value = []
    form.value.product_id = ''
    form.value.qty = 1

    Swal.fire({
      icon: 'error',
      title: 'Resi tidak ditemukan',
      text: 'Pastikan nomor resi benar'
    })
  } finally {
    loading.value = false
  }
}

// ================= SELECT PRODUCT =================
const onSelectProduct = () => {
  const selected = orderItems.value.find(
    i => i.product_id == form.value.product_id
  )

  if (selected) {
    form.value.qty = selected.quantity
    form.value.max_qty = selected.quantity
  }
}

// ================= FETCH RETURNS =================
const fetchReturns = async () => {
  loadingTable.value = true

  try {
    const res = await $api('/returns/today')

    returns.value = Array.isArray(res)
      ? res
      : res.data || []

  } catch (err) {
    console.log('❌ FETCH RETURNS ERROR:', err)

    Swal.fire({
      icon: 'error',
      title: 'Gagal load data retur'
    })
  } finally {
    await new Promise(r => setTimeout(r, 300))
    loadingTable.value = false
  }
}

// ================= SUBMIT =================
const submitReturn = async () => {

  // VALIDASI
  if (!form.value.product_id) {
    return Swal.fire({
      icon: 'warning',
      title: 'Produk belum dipilih'
    })
  }

  if (form.value.qty > form.value.max_qty) {
    return Swal.fire({
      icon: 'warning',
      title: 'Qty tidak valid',
      text: 'Qty melebihi jumlah order'
    })
  }

  const exists = returns.value.find(
    r =>
      r.waybill === form.value.waybill &&
      r.product_id == form.value.product_id
  )

  if (exists) {
    return Swal.fire({
      icon: 'error',
      title: 'Duplikat retur',
      text: 'Produk ini sudah pernah diretur'
    })
  }

  // CONFIRM
  const confirm = await Swal.fire({
    title: 'Proses retur?',
    text: 'Data akan disimpan',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, proses',
    cancelButtonText: 'Batal'
  })

  if (!confirm.isConfirmed) return

  loading.value = true

  try {
    await $api('/returns', {
      method: 'POST',
      body: {
        ...form.value,
        status: getStatus(form.value.condition)
      }
    })

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Retur berhasil diproses',
      timer: 1500,
      showConfirmButton: false
    })

    // RESET
    form.value = {
      waybill: '',
      product_id: '',
      qty: 1,
      max_qty: 1,
      ekspedisi: 'J&T',
      platform: '',
      condition: 'good'
    }

    orderItems.value = []

    await fetchReturns()

    await nextTick()
    inputRef.value?.focus()

  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: e?.data?.message || 'Gagal proses retur'
    })
  } finally {
    loading.value = false
  }
}

// ================= INIT =================
onMounted(async () => {
  await fetchReturns()
  nextTick(() => inputRef.value?.focus())
})
</script>

<style scoped>
.input {
  @apply w-full border rounded-lg px-3 py-2 text-xs md:text-sm;
}

.label {
  @apply text-xs md:text-sm font-medium text-gray-600 mb-1 block;
}

.btn-danger {
 @apply w-full bg-red-600 text-white py-2.5 text-xs md:text-sm rounded-lg font-semibold hover:bg-red-700;
}

.badge-green {
  @apply bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold;
}

.badge-red {
  @apply bg-red-100 text-red-600 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold;
}
</style>