<template>
  <div class="pb-10 relative">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3 md:gap-4">
      <div class="flex items-center">
        <span class="material-symbols-outlined text-2xl md:text-3xl text-gray-400 mr-2 md:mr-3">database</span>
        <h2 class="text-lg md:text-2xl font-bold text-gray-800">Manajemen Master Data</h2>
      </div>
      <button @click="isModalOpen = true" class="bg-blue-600 text-white text-sm md:text-base font-bold py-2 px-3 md:py-2.5 md:px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm w-full sm:w-auto">
        <span class="material-symbols-outlined text-lg md:text-xl mr-1.5 md:mr-2">add</span> Tambah Data Baru
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 relative z-0">
      <div class="flex border-b border-gray-100">
        <button 
          @click="activeTab = 'produk'" 
          :class="activeTab === 'produk' ? 'border-b-2 border-blue-600 text-blue-600 font-bold bg-blue-50/50' : 'text-gray-500 font-medium hover:bg-gray-50'"
          class="flex-1 py-3 px-2 md:py-4 md:px-6 flex items-center justify-center transition-all outline-none text-xs md:text-base"
        >
          <span class="material-symbols-outlined text-base md:text-xl mr-1.5 md:mr-2">inventory</span> Master Produk
        </button>
        <button 
          @click="activeTab = 'logistik'" 
          :class="activeTab === 'logistik' ? 'border-b-2 border-blue-600 text-blue-600 font-bold bg-blue-50/50' : 'text-gray-500 font-medium hover:bg-gray-50'"
          class="flex-1 py-3 px-2 md:py-4 md:px-6 flex items-center justify-center transition-all outline-none text-xs md:text-base"
        >
          <span class="material-symbols-outlined text-base md:text-xl mr-1.5 md:mr-2">local_shipping</span> Master Logistik
        </button>
      </div>

      <div class="p-3 md:p-4 bg-gray-50 border-b border-gray-100 flex items-center">
        <div class="relative w-full max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg md:text-xl">search</span>
          <input type="text" placeholder="Cari SKU, Nama, atau Brand..." class="w-full pl-9 pr-3 md:pl-10 md:pr-4 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
      </div>

      <div v-if="activeTab === 'produk'" class="overflow-x-auto w-full">
        <table class="w-full text-left min-w-[700px] md:min-w-[800px]">
          <thead class="bg-white text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">
            <tr>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">SKU</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">Nama Produk</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">Kategori</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">Brand Pemilik</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-xs md:text-sm divide-y divide-gray-100">
            <tr v-for="item in masterProducts" :key="item.sku" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 md:px-6 md:py-4 font-mono font-bold text-gray-700">{{ item.sku }}</td>
              <td class="px-4 py-3 md:px-6 md:py-4 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3 md:px-6 md:py-4">
                <span class="bg-purple-100 text-purple-700 px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-semibold">{{ item.category }}</span>
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4">{{ item.brand }}</td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-center">
                <button class="text-blue-500 hover:text-blue-700 mx-1" title="Edit"><span class="material-symbols-outlined text-sm md:text-base">edit</span></button>
                <button class="text-red-500 hover:text-red-700 mx-1" title="Hapus"><span class="material-symbols-outlined text-sm md:text-base">delete</span></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="activeTab === 'logistik'" class="overflow-x-auto w-full">
        <table class="w-full text-left min-w-[700px] md:min-w-[800px]">
          <thead class="bg-white text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">
            <tr>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">Kode Internal</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">Ekspedisi (3PL)</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">Platform Penjualan</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b text-center">Status</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-xs md:text-sm divide-y divide-gray-100">
            <tr v-for="item in masterLogistics" :key="item.code" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 md:px-6 md:py-4 font-mono font-bold text-gray-700">{{ item.code }}</td>
              <td class="px-4 py-3 md:px-6 md:py-4 font-medium text-red-600">{{ item.ekspedisi }}</td>
              <td class="px-4 py-3 md:px-6 md:py-4 font-medium">{{ item.platform }}</td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-center">
                <span class="bg-green-100 text-green-700 px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-bold">Aktif</span>
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-center">
                <button class="text-blue-500 hover:text-blue-700 mx-1" title="Edit"><span class="material-symbols-outlined text-sm md:text-base">edit</span></button>
                <button class="text-red-500 hover:text-red-700 mx-1" title="Hapus"><span class="material-symbols-outlined text-sm md:text-base">delete</span></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div @click="isModalOpen = false" class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"></div>
      
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md z-10 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        <div class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
          <h3 class="font-bold text-gray-800 flex items-center text-sm md:text-base">
            <span class="material-symbols-outlined mr-2 text-blue-600 text-lg md:text-xl">add_circle</span>
            Tambah {{ activeTab === 'produk' ? 'Master Produk' : 'Master Logistik' }}
          </h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-red-500 transition-colors p-1">
            <span class="material-symbols-outlined text-xl md:text-2xl">close</span>
          </button>
        </div>

        <div class="p-4 md:p-6 overflow-y-auto">
          
          <form v-if="activeTab === 'produk'" class="space-y-3 md:space-y-4">
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">SKU Internal</label>
              <input type="text" class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase" placeholder="Contoh: CAS002">
            </div>
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Produk Lengkap</label>
              <input type="text" class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Acne Serum 20ml">
            </div>
            <div class="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kategori</label>
                <select class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option>Skincare</option>
                  <option>Packing</option>
                  <option>Merchandise</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Satuan (UoM)</label>
                <select class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option>Pieces</option>
                  <option>Ikat</option>
                  <option>Box</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pilih Brand Pemilik</label>
              <select class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="" disabled selected>-- Pilih Brand --</option>
                <option>CA SKIN GLOW</option>
                <option>Packaging Packing</option>
                <option>Brand X</option>
              </select>
            </div>
          </form>

          <form v-if="activeTab === 'logistik'" class="space-y-3 md:space-y-4">
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kode Internal</label>
              <input type="text" class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase" placeholder="Contoh: JX">
            </div>
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Ekspedisi (3PL)</label>
              <input type="text" class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: J&T, Sicepat, Shopee Express">
            </div>
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Platform Penjualan</label>
              <select class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="" disabled selected>-- Pilih Platform --</option>
                <option>Tiktok</option>
                <option>Shopee</option>
                <option>Tokopedia</option>
                <option>Lazada</option>
                <option>Mengantar (Manual)</option>
              </select>
            </div>
          </form>

        </div>

        <div class="px-4 py-3 md:px-6 md:py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-2 md:space-x-3 shrink-0">
          <button @click="isModalOpen = false" class="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button @click="simpanData" class="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm">
            <span class="material-symbols-outlined text-sm mr-1.5 md:mr-2">save</span> Simpan
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('produk')
const isModalOpen = ref(false)

const simpanData = () => {
  isModalOpen.value = false
}

const masterProducts = [
  { sku: 'CAM001', name: 'Cooper Moisturizer 10 gr', category: 'Skincare', brand: 'CA SKIN GLOW' },
  { sku: 'CAS001', name: 'Cooper Peptide Luxe Serum', category: 'Skincare', brand: 'CA SKIN GLOW' },
  { sku: 'CASM001', name: 'White Truffle Serum Mist 60 mL', category: 'Skincare', brand: 'CA SKIN GLOW' },
  { sku: 'POLY01', name: 'Polymailer 17 x 30', category: 'Packing', brand: 'Packaging Packing' },
  { sku: 'POLY02', name: 'Polymailer 30 x 30', category: 'Packing', brand: 'Packaging Packing' }
]

const masterLogistics = [
  { code: 'JX', ekspedisi: 'J&T', platform: 'Tiktok' },
  { code: 'JP', ekspedisi: 'J&T', platform: 'Shopee' },
  { code: 'TK', ekspedisi: 'J&T', platform: 'Tokopedia' },
  { code: 'SP', ekspedisi: 'SPX', platform: 'Shopee' },
  { code: 'LX', ekspedisi: 'LEX ID', platform: 'Lazada' }
]
</script>