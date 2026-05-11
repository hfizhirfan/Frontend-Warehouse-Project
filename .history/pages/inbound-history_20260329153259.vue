<template>
  <div class="pb-10 max-w-7xl mx-auto">
    
    <nav class="flex items-center text-[11px] md:text-sm font-medium text-gray-500 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <NuxtLink to="/" class="hover:text-blue-600 flex items-center transition-colors group">
        <span class="material-symbols-outlined text-[16px] md:text-[18px] mr-1 md:mr-1.5 group-hover:text-blue-600 transition-colors">home</span>
        Dashboard
      </NuxtLink>
      <span class="material-symbols-outlined text-[14px] md:text-[18px] text-gray-400 mx-1 md:mx-1.5">chevron_right</span>
      <NuxtLink to="/inbound" class="hover:text-blue-600 transition-colors">
        Inbound
      </NuxtLink>
      <span class="material-symbols-outlined text-[14px] md:text-[18px] text-gray-400 mx-1 md:mx-1.5">chevron_right</span>
      <span class="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border border-blue-100 shadow-sm">
        Riwayat Lengkap
      </span>
    </nav>
    
    <div class="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center">
        <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center mr-3 md:mr-4 shrink-0">
          <span class="material-symbols-outlined text-xl md:text-2xl">history</span>
        </div>
        <div>
          <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">Riwayat Lengkap Inbound</h2>
          <p class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Semua data penerimaan barang masuk.</p>
        </div>
      </div>
      
      <NuxtLink to="/inbound" class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 md:py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
        <span class="material-symbols-outlined text-[16px] md:text-[18px] mr-2">arrow_back</span>
        Kembali ke Inbound
      </NuxtLink>
    </div>
    
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
      <div class="relative w-full">
        <span class="material-symbols-outlined absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg md:text-xl">search</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari SKU, Nama Produk, atau Supplier..." 
          class="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50 hover:bg-white text-gray-800 font-medium"
        >
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto w-full pb-2">
        <table class="w-full text-left min-w-[800px] md:min-w-[900px]">
          <thead class="bg-gray-50/50 text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">
            <tr>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 font-semibold">Tanggal & Waktu</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 font-semibold">Resi / Dokumen</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 font-semibold">Brand</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 font-semibold">Detail Produk</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 font-semibold text-right">Kuantitas</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 font-semibold">Supplier</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            <tr v-for="(item, index) in filteredHistory" :key="index" class="hover:bg-gray-50/80 transition-colors">
              <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                <div class="font-bold text-gray-800 text-xs md:text-sm">{{ item.date }}</div>
                <div class="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5">{{ item.time }}</div>
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 font-mono text-gray-600 text-[10px] md:text-xs">{{ item.receipt }}</td>
              <td class="px-4 py-3 md:px-6 md:py-4">
                <span class="font-medium text-gray-800 bg-gray-100 px-2 py-1 md:px-2.5 md:py-1 rounded-md text-[9px] md:text-[11px] border border-gray-200">{{ item.brand }}</span>
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 min-w-[150px]">
                <div class="font-bold text-gray-800 text-xs md:text-sm">{{ item.sku }}</div>
                <div class="text-[10px] md:text-xs text-gray-500 mt-0.5">{{ item.name }}</div>
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-right">
                <span class="font-bold text-green-600 bg-green-50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border border-green-100 text-xs md:text-sm">+{{ item.qty.toLocaleString('id-ID') }}</span>
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-gray-600 font-medium text-xs md:text-sm">{{ item.supplier }}</td>
              <td class="px-4 py-3 md:px-6 md:py-4 flex justify-center">
                <span v-if="item.status === 'Selesai'" class="inline-flex items-center justify-center bg-green-50 text-green-700 px-2 py-1 md:px-2.5 md:py-1 rounded-md text-[10px] md:text-xs font-bold w-full max-w-[90px] md:max-w-[110px] border border-green-100">
                  <span class="material-symbols-outlined text-[12px] md:text-[14px] mr-1">check_circle</span> Selesai
                </span>
                <span v-else class="inline-flex items-center justify-center bg-yellow-50 text-yellow-700 px-2 py-1 md:px-2.5 md:py-1 rounded-md text-[10px] md:text-xs font-bold w-full max-w-[90px] md:max-w-[110px] border border-yellow-200">
                  <span class="material-symbols-outlined text-[12px] md:text-[14px] mr-1">pending</span> Pending
                </span>
              </td>
            </tr>

            <tr v-if="filteredHistory.length === 0">
              <td colspan="7" class="px-4 py-12 md:px-6 md:py-16 text-center text-gray-400">
                <span class="material-symbols-outlined text-4xl md:text-5xl block mb-2 md:mb-3 opacity-20">search_off</span>
                <span class="font-medium text-sm">Tidak ada riwayat inbound yang sesuai.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="px-4 py-3 md:px-6 md:py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
        <span class="font-medium">Menampilkan {{ filteredHistory.length }} data</span>
        <div class="flex gap-2 w-full sm:w-auto justify-center">
          <button class="flex-1 sm:flex-none px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors" disabled>Prev</button>
          <button class="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold shadow-sm">1</button>
          <button class="flex-1 sm:flex-none px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors" disabled>Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentUser = useState('user')
if (!currentUser.value) {
  navigateTo('/login')
}

const searchQuery = ref('')
const globalSelectedBrand = useState('selectedBrand')

const allHistory = [
  { date: '27 Mar 2026', time: '08:30 WIB', receipt: 'INB-20260327-01', brand: 'CA SKIN GLOW', sku: 'CASM001', name: 'White Truffle Serum Mist', qty: 500, supplier: 'PT Makmur Skincare', status: 'Selesai' },
  { date: '27 Mar 2026', time: '10:15 WIB', receipt: 'INB-20260327-02', brand: 'Packaging Packing', sku: 'POLY02', name: 'Polymailer 30 x 30', qty: 1000, supplier: 'Supplier Plastik PT', status: 'Selesai' },
  { date: '26 Mar 2026', time: '14:20 WIB', receipt: 'INB-20260326-01', brand: 'Brand X', sku: 'BRX-001', name: 'Facial Wash Extra', qty: 50, supplier: 'Pabrik Kosmetik Indah', status: 'Selesai' },
  { date: '25 Mar 2026', time: '09:00 WIB', receipt: 'INB-20260325-01', brand: 'CA SKIN GLOW', sku: 'CAM001', name: 'Cooper Moisturizer 10 gr', qty: 200, supplier: 'PT Makmur Skincare', status: 'Selesai' },
  { date: '25 Mar 2026', time: '09:05 WIB', receipt: 'INB-20260325-02', brand: 'CA SKIN GLOW', sku: 'CAS001', name: 'Cooper Peptide Luxe Serum', qty: 150, supplier: 'PT Makmur Skincare', status: 'QC Pending' },
  { date: '20 Mar 2026', time: '11:30 WIB', receipt: 'INB-20260320-01', brand: 'Packaging Packing', sku: 'POLY01', name: 'Polymailer 17 x 30', qty: 500, supplier: 'Supplier Plastik PT', status: 'Selesai' },
]

const filteredHistory = computed(() => {
  if (!currentUser.value) return []

  let result = allHistory

  if (currentUser.value.role !== 'super_admin') {
    result = result.filter(item => item.brand === currentUser.value.assigned_brand)
  } else {
    if (globalSelectedBrand.value && globalSelectedBrand.value !== 'Semua Brand') {
      result = result.filter(item => item.brand === globalSelectedBrand.value)
    }
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.sku.toLowerCase().includes(query) || 
      item.name.toLowerCase().includes(query) ||
      item.supplier.toLowerCase().includes(query) ||
      item.receipt.toLowerCase().includes(query)
    )
  }

  return result
})
</script>