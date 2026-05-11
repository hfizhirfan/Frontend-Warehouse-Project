<template>
  <div class="pb-10 relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
      <div class="flex items-center">
        <span class="material-symbols-outlined text-2xl md:text-3xl text-gray-400 mr-2 md:mr-3">fact_check</span>
        <h2 class="text-lg md:text-2xl font-bold text-gray-800">Stock Opname & Penyesuaian</h2>
      </div>
      <div class="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center w-fit">
        <span class="material-symbols-outlined text-lg mr-2">calendar_today</span> Periode: Maret 2026
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-3 md:p-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
        <select class="w-full sm:w-auto border border-gray-300 rounded-lg p-2 text-xs md:text-sm outline-none font-bold text-gray-700">
          <option>Filter: CA SKIN GLOW</option>
          <option>Filter: Packaging Packing</option>
        </select>
        <button class="w-full sm:w-auto bg-blue-600 text-white text-xs md:text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
          <span class="material-symbols-outlined text-base mr-1.5">sync</span> Update Stok Sistem
        </button>
      </div>

      <div class="overflow-x-auto w-full">
        <table class="w-full text-left min-w-[700px]">
          <thead class="bg-white text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">
            <tr>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">SKU & Nama Produk</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b text-center">Stok Sistem (App)</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b text-center bg-blue-50/30">Hitung Fisik (Gudang)</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b text-center">Selisih</th>
            </tr>
          </thead>
          <tbody class="text-xs md:text-sm divide-y divide-gray-100">
            <tr v-for="item in opnameData" :key="item.sku" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 md:px-6 md:py-4">
                <p class="font-mono font-bold text-gray-700">{{ item.sku }}</p>
                <p class="text-gray-500 text-xs">{{ item.name }}</p>
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-center font-bold text-gray-600 text-base">
                {{ item.sistem }}
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-center bg-blue-50/30">
                <input type="number" v-model="item.fisik" class="w-20 md:w-24 border border-gray-300 rounded-lg p-1.5 md:p-2 text-center text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-center">
                <span v-if="item.fisik - item.sistem > 0" class="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-xs">
                  +{{ item.fisik - item.sistem }} (Lebih)
                </span>
                <span v-else-if="item.fisik - item.sistem < 0" class="bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs">
                  {{ item.fisik - item.sistem }} (Hilang)
                </span>
                <span v-else class="text-gray-400 font-bold text-xs">
                  <span class="material-symbols-outlined text-sm align-middle">check_circle</span> Cocok
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Data Dummy Interaktif
const opnameData = ref([
  { sku: 'CAM001', name: 'Cooper Moisturizer 10 gr', sistem: 500, fisik: 500 },
  { sku: 'CAS001', name: 'Cooper Peptide Luxe Serum', sistem: 800, fisik: 798 }, // Contoh hilang 2
  { sku: 'CASM001', name: 'White Truffle Serum Mist', sistem: 15, fisik: 16 }   // Contoh lebih 1
])
</script>