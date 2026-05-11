<template>
  <div class="px-4 md:px-0 pb-20 md:pb-10 relative">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
      <div class="flex items-center">
        <span class="material-symbols-outlined text-xl md:text-3xl text-gray-400 mr-2 md:mr-3">fact_check</span>
        <h2 class="text-base md:text-2xl font-bold text-gray-800">
          Stock Opname & Penyesuaian
        </h2>
      </div>

      <div class="bg-blue-50 text-blue-700 border border-blue-100 px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold flex items-center w-fit">
        <span class="material-symbols-outlined text-lg mr-2">calendar_today</span>
        Periode: {{ today }}
      </div>
    </div>

    <!-- CARD -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">

      <!-- ACTION -->
      <div class="p-4 bg-gray-50 border-b flex justify-between items-center">

        <!-- LEFT SIDE -->
        <div>
          <!-- SUPER ADMIN -->
          <div v-if="isSuperAdmin" ref="dropdownRef" class="relative w-52">
            <button
              @click="open = !open"
              class="w-full border rounded-lg px-3 py-2 text-xs md:text-sm font-semibold bg-white flex justify-between items-center hover:border-blue-400"
            >
              <span>{{ filter || 'Semua Brand' }}</span>
              <span class="material-symbols-outlined text-gray-400 text-sm">
                expand_more
              </span>
            </button>

            <div v-if="open" class="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
              <div @click="selectBrand('')" class="px-3 py-2 text-xs md:text-sm hover:bg-blue-50 cursor-pointer">
                Semua Brand
              </div>

              <div
                v-for="b in brands"
                :key="b"
                @click="selectBrand(b)"
                class="px-3 py-2 text-xs md:text-sm hover:bg-blue-50 cursor-pointer"
              >
                {{ b }}
              </div>
            </div>
          </div>

          <!-- ADMIN (placeholder biar layout tetap) -->
          <div v-else class="w-52"></div>
        </div>

        <!-- RIGHT SIDE (BUTTON) -->
        <button 
          @click="submitOpname"
          :disabled="loading"
          class="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
        >
          <span class="material-symbols-outlined text-sm">sync</span>
          {{ loading ? 'Menyimpan...' : 'Update Stok' }}
        </button>

      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">
        <table class="w-full text-xs md:text-sm min-w-[700px]">

          <thead class="bg-gray-50 text-[10px] md:text-xs uppercase text-gray-500">
            <tr>
              <th class="px-2 md:px-3 py-2 md:py-3 text-left">SKU</th>
              <th class="px-2 md:px-3 py-2 md:py-3 text-center">Stok Sistem</th>
              <th class="px-2 md:px-3 py-2 md:py-3 text-center">Stok Fisik</th>
              <th class="px-2 md:px-3 py-2 md:py-3 text-center">Selisih</th>
              <th class="px-2 md:px-3 py-2 md:py-3 text-left">Remark</th>
            </tr>
          </thead>

          <tbody>

            <!-- SKELETON -->
            <template v-if="loading">
              <tr v-for="n in 6" :key="'skeleton-'+n" class="border-t">
                <td class="px-2 md:px-3 py-2 md:py-3">
                  <div class="skeleton h-4 w-32 rounded"></div>
                  <div class="skeleton h-3 w-24 rounded mt-1"></div>
                </td>

                <td class="px-2 md:px-3 py-2 md:py-3 text-center">
                  <div class="skeleton h-4 w-10 mx-auto"></div>
                </td>

                <td class="px-2 md:px-3 py-2 md:py-3 text-center">
                  <div class="skeleton h-8 w-20 mx-auto rounded"></div>
                </td>

                <td class="px-2 md:px-3 py-2 md:py-3 text-center">
                  <div class="skeleton h-4 w-12 mx-auto"></div>
                </td>

                <td class="px-2 md:px-3 py-2 md:py-3">
                  <div class="skeleton h-4 w-full rounded"></div>
                </td>
              </tr>
            </template>

            <!-- DATA -->
            <template v-else>
              <tr 
                v-for="item in filteredData" 
                :key="item.sku" 
                class="border-t"
                :class="{
                  'bg-green-50': item.fisik > item.sistem,
                  'bg-red-50': item.fisik < item.sistem
                }"
              >
                <td class="px-2 md:px-3 py-2 md:py-3">
                  <div class="font-mono font-bold text-xs md:text-sm">{{ item.sku }}</div>
                  <div class="text-[10px] md:text-xs text-gray-400">{{ item.name }}</div>
                </td>

                <td class="px-2 md:px-3 py-2 md:py-3 text-center font-bold text-xs md:text-sm">
                  {{ item.sistem }}
                </td>

                <td class="px-2 md:px-3 py-2 md:py-3 text-center">
                  <input 
                    type="number"
                    min="0"
                    v-model.number="item.fisik"
                    class="w-20 md:w-24 border rounded text-center text-xs md:text-sm py-1"
                  />
                </td>

                <td class="px-2 md:px-3 py-2 md:py-3 text-center font-bold text-xs md:text-sm">
                  <span v-if="item.fisik - item.sistem > 0" class="text-green-600">
                    +{{ item.fisik - item.sistem }}
                  </span>

                  <span v-else-if="item.fisik - item.sistem < 0" class="text-red-600">
                    {{ item.fisik - item.sistem }}
                  </span>

                  <span v-else class="text-gray-400">0</span>
                </td>

                <td class="px-2 md:px-3 py-2 md:py-3">
                  <input 
                    v-model="item.remark"
                    placeholder="Catatan..."
                    class="border rounded px-2 py-1 w-full text-[10px] md:text-xs"
                  />
                </td>
              </tr>

              <!-- EMPTY -->
              <tr v-if="filteredData.length === 0">
                <td colspan="5" class="text-center p-6 text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            </template>

          </tbody>
        </table>
      </div>

      <!-- FOOTER TOTAL -->
      <div class="px-3 md:px-4 py-3 border-t bg-gray-50 flex justify-between text-xs md:text-sm font-bold">
        <div>Total Selisih:</div>
        <div 
          :class="{
            'text-green-600': totalSelisih > 0,
            'text-red-600': totalSelisih < 0
          }"
        >
          {{ totalSelisih > 0 ? '+' : '' }}{{ totalSelisih }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

// ================= STATE =================
const opnameData = ref([])
const filter = ref('')
const loading = ref(true)

const user = ref(null)

const open = ref(false)
const dropdownRef = ref(null)

// ================= ROLE =================
const isSuperAdmin = computed(() => {
  return user.value?.role === 'super_admin'
})

// ================= DATE =================
const today = new Date().toISOString().slice(0, 10)

// ================= FETCH =================
const fetchOpname = async () => {
  loading.value = true

  try {
    const res = await $api('/opname')

    const data = Array.isArray(res)
      ? res
      : res.data || []

    opnameData.value = data.map(item => ({
      sku: item.sku,
      name: item.name,
      sistem: item.stock,
      fisik: item.stock,
      brand: item.brand || 'Tanpa Brand',
      brand_id: item.brand_id,
      remark: ''
    }))

  } catch (e) {
    console.log('❌ FETCH ERROR:', e)

    Swal.fire({
      icon: 'error',
      title: 'Gagal load data',
      text: 'Tidak bisa mengambil data opname'
    })

    opnameData.value = []
  } finally {
    await new Promise(r => setTimeout(r, 300))
    loading.value = false
  }
}

// ================= BRAND =================
const brands = computed(() => {
  return [...new Set(
    opnameData.value.map(i => i.brand).filter(Boolean)
  )]
})

// ================= FILTER =================
const filteredData = computed(() => {
  if (isSuperAdmin.value) {
    if (!filter.value) return opnameData.value
    return opnameData.value.filter(i => i.brand === filter.value)
  }

  return opnameData.value.filter(
    i => i.brand_id === user.value?.brand_id
  )
})

// ================= TOTAL =================
const totalSelisih = computed(() => {
  return filteredData.value.reduce(
    (sum, i) => sum + (i.fisik - i.sistem),
    0
  )
})

// ================= DROPDOWN =================
const selectBrand = (val) => {
  if (!isSuperAdmin.value) return
  filter.value = val
  open.value = false
}

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    open.value = false
  }
}

// ================= SUBMIT =================
const submitOpname = async () => {

  const changedItems = filteredData.value.filter(
    item => item.fisik !== item.sistem
  )

  // ❌ tidak ada perubahan
  if (changedItems.length === 0) {
    return Swal.fire({
      icon: 'info',
      title: 'Tidak ada perubahan',
      text: 'Tidak ada stok yang berubah'
    })
  }

  // ❌ validasi
  for (const item of changedItems) {
    if (item.fisik < 0 || item.fisik === null) {
      return Swal.fire({
        icon: 'warning',
        title: 'Stok tidak valid',
        text: `Cek SKU: ${item.sku}`
      })
    }
  }

  // 🔥 CONFIRM
  const confirm = await Swal.fire({
    title: 'Simpan perubahan?',
    text: 'Stok akan diperbarui',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, simpan',
    cancelButtonText: 'Batal'
  })

  if (!confirm.isConfirmed) return

  loading.value = true

  try {
    await $api('/opname', {
      method: 'POST',
      body: {
        date: today,
        items: changedItems.map(item => ({
          sku: item.sku,
          system_stock: item.sistem,
          physical_stock: item.fisik,
          selisih: item.fisik - item.sistem,
          remark: item.remark || ''
        }))
      }
    })

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Opname berhasil disimpan',
      timer: 1500,
      showConfirmButton: false
    })

    await fetchOpname()

  } catch (e) {
    console.log('❌ SUBMIT ERROR:', e)

    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: e?.data?.message || 'Gagal menyimpan opname'
    })
  } finally {
    loading.value = false
  }
}

// ================= INIT =================
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem('user') || '{}')

  await fetchOpname()

  if (isSuperAdmin.value) {
    filter.value = brands.value[0] || ''
  } else {
    const userBrand = opnameData.value.find(
      i => i.brand_id === user.value?.brand_id
    )

    filter.value = userBrand?.brand || ''
  }

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
input {
  outline: none;
}

@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f3f3f3 25%,
    #e5e7eb 37%,
    #f3f3f3 63%
  );
  background-size: 400px 100%;
  animation: shimmer 1.2s infinite linear;
}
</style>