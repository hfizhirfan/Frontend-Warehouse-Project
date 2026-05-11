<template>
  <div class="pb-10">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <div class="flex items-center">
        <span class="material-symbols-outlined text-3xl text-gray-400 mr-3">database</span>
        <h2 class="text-xl md:text-2xl font-bold text-gray-800">Manajemen Master Data</h2>
      </div>
      <button class="bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm">
        <span class="material-symbols-outlined mr-2">add</span> Tambah Data Baru
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div class="flex border-b border-gray-100">
        <button 
          @click="activeTab = 'produk'" 
          :class="activeTab === 'produk' ? 'border-b-2 border-blue-600 text-blue-600 font-bold bg-blue-50/50' : 'text-gray-500 font-medium hover:bg-gray-50'"
          class="flex-1 py-4 px-6 flex items-center justify-center transition-all outline-none"
        >
          <span class="material-symbols-outlined mr-2">inventory</span> Master Produk
        </button>
        <button 
          @click="activeTab = 'logistik'" 
          :class="activeTab === 'logistik' ? 'border-b-2 border-blue-600 text-blue-600 font-bold bg-blue-50/50' : 'text-gray-500 font-medium hover:bg-gray-50'"
          class="flex-1 py-4 px-6 flex items-center justify-center transition-all outline-none"
        >
          <span class="material-symbols-outlined mr-2">local_shipping</span> Master Logistik
        </button>
      </div>

      <div class="p-4 bg-gray-50 border-b border-gray-100 flex items-center">
        <div class="relative w-full max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
          <input type="text" placeholder="Cari SKU, Nama, atau Brand..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
      </div>

      <div v-if="activeTab === 'produk'" class="overflow-x-auto w-full">
        <table class="w-full text-left min-w-[800px]">
          <thead class="bg-white text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 border-b">SKU</th>
              <th class="px-6 py-4 border-b">Nama Produk</th>
              <th class="px-6 py-4 border-b">Kategori</th>
              <th class="px-6 py-4 border-b">Brand Pemilik</th>
              <th class="px-6 py-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            <tr v-for="item in masterProducts" :key="item.sku" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 font-mono font-bold text-gray-700">{{ item.sku }}</td>
              <td class="px-6 py-4 font-medium">{{ item.name }}</td>
              <td class="px-6 py-4">
                <span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">{{ item.category }}</span>
              </td>
              <td class="px-6 py-4">{{ item.brand }}</td>
              <td class="px-6 py-4 text-center">
                <button class="text-blue-500 hover:text-blue-700 mx-1" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button>
                <button class="text-red-500 hover:text-red-700 mx-1" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="activeTab === 'logistik'" class="overflow-x-auto w-full">
        <table class="w-full text-left min-w-[800px]">
          <thead class="bg-white text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 border-b">Kode Internal</th>
              <th class="px-6 py-4 border-b">Ekspedisi (3PL)</th>
              <th class="px-6 py-4 border-b">Platform Penjualan</th>
              <th class="px-6 py-4 border-b text-center">Status</th>
              <th class="px-6 py-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            <tr v-for="item in masterLogistics" :key="item.code" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 font-mono font-bold text-gray-700">{{ item.code }}</td>
              <td class="px-6 py-4 font-medium text-red-600">{{ item.ekspedisi }}</td>
              <td class="px-6 py-4 font-medium">{{ item.platform }}</td>
              <td class="px-6 py-4 text-center">
                <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Aktif</span>
              </td>
              <td class="px-6 py-4 text-center">
                <button class="text-blue-500 hover:text-blue-700 mx-1" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button>
                <button class="text-red-500 hover:text-red-700 mx-1" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button>
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

// Default tab yang terbuka pertama kali
const activeTab = ref('produk')

// Data Dummy dari "Master_Product.csv"
const masterProducts = [
  { sku: 'CAM001', name: 'Cooper Moisturizer 10 gr', category: 'Skincare', brand: 'CA SKIN GLOW' },
  { sku: 'CAS001', name: 'Cooper Peptide Luxe Serum', category: 'Skincare', brand: 'CA SKIN GLOW' },
  { sku: 'CASM001', name: 'White Truffle Serum Mist 60 mL', category: 'Skincare', brand: 'CA SKIN GLOW' },
  { sku: 'POLY01', name: 'Polymailer 17 x 30', category: 'Packing', brand: 'Packaging Packing' },
  { sku: 'POLY02', name: 'Polymailer 30 x 30', category: 'Packing', brand: 'Packaging Packing' }
]

// Data Dummy dari "Master Warehouse.csv"
const masterLogistics = [
  { code: 'JX', ekspedisi: 'J&T', platform: 'Tiktok' },
  { code: 'JP', ekspedisi: 'J&T', platform: 'Shopee' },
  { code: 'TK', ekspedisi: 'J&T', platform: 'Tokopedia' },
  { code: 'SP', ekspedisi: 'SPX', platform: 'Shopee' },
  { code: 'LX', ekspedisi: 'LEX ID', platform: 'Lazada' }
]
</script>