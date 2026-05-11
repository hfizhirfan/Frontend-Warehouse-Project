<template>
  <div class="px-4 md:px-0 pb-20 md:pb-10">

    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg md:text-2xl font-bold">Riwayat Retur</h2>

      <NuxtLink
        to="/retur"
        class="flex items-center gap-2 bg-gray-200 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-300"
        >
        <span class="material-symbols-outlined text-sm md:text-base">
            arrow_back
        </span>
        Kembali
      </NuxtLink>
    </div>

    <!-- FILTER -->
    <div class="bg-white p-4 rounded-xl border mb-4 flex flex-col md:flex-row gap-3">

      <div class="relative">
        <input
          ref="dateRef"
          type="text"
          placeholder="Pilih tanggal..."
          class="border rounded-lg px-3 py-2 pr-10 text-xs md:text-sm w-full"
          readonly
        />

        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          calendar_today
        </span>
      </div>

      <input
        v-model="filter.search"
        placeholder="Cari waybill..."
        class="border rounded-lg px-3 py-2 text-xs md:text-sm w-full md:flex-1"
      />

      <button
        @click="fetchData"
        class="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm"
      >
        Filter
      </button>

    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl border overflow-x-auto">

      <table class="w-full text-xs md:text-sm min-w-[700px]">
        <thead class="bg-gray-50 text-gray-500 text-[10px] md:text-xs uppercase">
          <tr>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left">Tanggal</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left">Waybill</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left">Channel</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-left">Produk</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-center">Qty</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-center">Kondisi</th>
            <th class="px-2 md:px-3 py-2 md:py-3 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          <template v-if="loading">
            <tr
              v-for="n in 6"
              :key="'skeleton-' + n"
              class="border-t"
            >
              <td class="p-3"><div class="skeleton h-4 w-28 rounded"></div></td>
              <td class="p-3"><div class="skeleton h-4 w-24 rounded"></div></td>

              <td class="p-3">
                <div class="skeleton h-4 w-20 rounded mb-1"></div>
                <div class="skeleton h-3 w-16 rounded"></div>
              </td>

              <td class="p-3">
                <div class="skeleton h-4 w-32 rounded mb-1"></div>
                <div class="skeleton h-3 w-24 rounded"></div>
              </td>

              <td class="p-3 text-center">
                <div class="skeleton h-4 w-10 mx-auto rounded"></div>
              </td>

              <td class="p-3 text-center">
                <div class="skeleton h-5 w-16 mx-auto rounded-full"></div>
              </td>

              <td class="p-3 text-center">
                <div class="skeleton h-4 w-20 mx-auto rounded"></div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="item in data"
              :key="item.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-2 md:px-3 py-2 md:py-3 text-[10px] md:text-xs text-gray-500">
                {{ formatDate(item.created_at) }}
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 font-mono text-xs md:text-sm">
                {{ item.waybill }}
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-[10px] md:text-xs">
                {{ item.platform }} <br />
                <span class="text-gray-400">{{ item.ekspedisi }}</span>
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-xs md:text-sm">
                {{ item.product?.sku }} <br />
                <span class="text-xs text-gray-400">
                  {{ item.product?.name }}
                </span>
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-center font-bold text-xs md:text-sm">
                {{ item.qty }}
              </td>

              <td class="p-3 text-center">
                <span :class="item.condition === 'good' ? 'badge-green' : 'badge-red'">
                  {{ item.condition }}
                </span>
              </td>

              <td class="px-2 md:px-3 py-2 md:py-3 text-center text-[10px] md:text-xs text-gray-500">
                {{ item.status }}
              </td>
            </tr>

            <!-- EMPTY -->
            <tr v-if="data.length === 0">
              <td colspan="7" class="text-center p-6 text-gray-400">
                Tidak ada data
              </td>
            </tr>
          </template>

        </tbody>
      </table>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

// ================= STATE =================
const data = ref([])
const loading = ref(true)

const filter = ref({
  date: '',
  search: ''
})

// ================= DATEPICKER =================
const dateRef = ref(null)
let picker = null

// ================= FETCH =================
const fetchData = async () => {
  loading.value = true

  try {
    const params = {}

    if (filter.value.date) params.date = filter.value.date
    if (filter.value.search) params.search = filter.value.search

    const res = await $api('/returns', { params })

    data.value = Array.isArray(res)
      ? res
      : res.data || []

  } catch (e) {
    console.log('❌ FETCH ERROR:', e)
    data.value = []
  } finally {
    await new Promise(r => setTimeout(r, 300))
    loading.value = false
  }
}

// ================= FORMAT DATE =================
const formatDate = (date) => {
  return date ? new Date(date).toLocaleString('id-ID') : '-'
}

// ================= INIT =================
onMounted(async () => {
  await fetchData()

  // ✅ SSR SAFE
  if (process.client) {
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
      setup: (p) => {
        p.on('selected', (date) => {
          filter.value.date = date.format('YYYY-MM-DD')
        })
      }
    })
  }
})

// ================= CLEANUP =================
onBeforeUnmount(() => {
  if (picker) picker.destroy()
})
</script>

<style scoped>
.badge-green {
  @apply bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold;
}

.badge-red {
  @apply bg-red-100 text-red-600 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold;
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