<template>
  <div class="pb-10 max-w-7xl mx-auto">
    <div class="mb-6 md:mb-8 flex items-center">
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mr-3 md:mr-4 shrink-0">
        <span class="material-symbols-outlined text-xl md:text-2xl">move_to_inbox</span>
      </div>
      <div>
        <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Penerimaan Barang (Inbound)</h2>
        <p class="text-xs md:text-sm text-gray-500 mt-1">Catat barang masuk dari supplier untuk menambah stok gudang.</p>
      </div>
    </div>
    
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="w-full lg:w-1/3">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 lg:p-8 relative overflow-hidden">
          <span class="material-symbols-outlined absolute -right-6 -top-6 text-[6rem] md:text-[8rem] text-blue-50 opacity-40 pointer-events-none">add_circle</span>
          
          <h3 class="font-bold text-gray-900 mb-5 md:mb-6 border-b border-gray-100 pb-3 md:pb-4 flex items-center relative z-10 text-base md:text-lg">
            <span class="material-symbols-outlined mr-2 text-blue-600">edit_document</span> Form Input
          </h3>
          
          <form class="space-y-4 md:space-y-5 relative z-10">
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2">Pilih Brand</label>
              <select class="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white transition-colors cursor-pointer text-gray-700 font-medium">
                <option>CA SKIN GLOW</option>
                <option>Packaging Packing</option>
                <option>Brand X</option>
              </select>
            </div>
            
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2">Pilih SKU Produk</label>
              <select class="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white transition-colors cursor-pointer text-gray-700 font-medium truncate">
                <option>CAS001 - Cooper Peptide Luxe Serum</option>
                <option>CAM001 - Cooper Moisturizer 10 gr</option>
              </select>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2">Kuantitas</label>
                <input type="number" class="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white transition-colors text-gray-700 font-medium" placeholder="0">
              </div>
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2">Tgl Masuk</label>
                <input type="date" class="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white transition-colors text-gray-700 font-medium cursor-pointer" value="2026-03-27">
              </div>
            </div>
            
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2">Nama Supplier / Pabrik</label>
              <input type="text" class="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white transition-colors text-gray-700 font-medium" placeholder="Contoh: PT. Makmur Skincare">
            </div>
            
            <button type="button" class="w-full bg-blue-600 text-white font-bold py-3 md:py-3.5 px-4 rounded-xl hover:bg-blue-700 transition-colors mt-2 md:mt-4 flex justify-center items-center shadow-md shadow-blue-200 text-sm md:text-base">
              <span class="material-symbols-outlined mr-2 text-[18px] md:text-[24px]">save</span> Simpan Stok
            </button>
          </form>
        </div>
      </div>

      <div class="w-full lg:w-2/3">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
          
          <div class="px-4 py-4 md:px-6 md:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 class="font-bold text-gray-900 flex items-center text-base md:text-lg">
              <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center mr-2 md:mr-3 shrink-0">
                <span class="material-symbols-outlined text-sm">history</span>
              </div>
              Riwayat Hari Ini
            </h3>
            
            <NuxtLink to="/inbound-history" class="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 transition-colors bg-blue-50 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-100 border border-blue-100 w-full sm:w-auto">
              Lihat Semua Data
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </NuxtLink>
          </div>
          
          <div class="overflow-x-auto w-full flex-1 pb-2">
            <table class="w-full text-left min-w-[600px]">
              <thead class="bg-gray-50/50 text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 md:px-6 md:py-4 font-semibold whitespace-nowrap">Waktu</th>
                  <th class="px-4 py-3 md:px-6 md:py-4 font-semibold whitespace-nowrap">Brand</th>
                  <th class="px-4 py-3 md:px-6 md:py-4 font-semibold whitespace-nowrap">SKU</th>
                  <th class="px-4 py-3 md:px-6 md:py-4 font-semibold text-right whitespace-nowrap">Qty</th>
                  <th class="px-4 py-3 md:px-6 md:py-4 font-semibold whitespace-nowrap">Supplier</th>
                </tr>
              </thead>
              <tbody class="text-xs md:text-sm divide-y divide-gray-100">
                <tr class="hover:bg-gray-50/80 transition-colors">
                  <td class="px-4 py-3 md:px-6 md:py-4 text-gray-500 text-[11px] md:text-xs font-medium">08:30 WIB</td>
                  <td class="px-4 py-3 md:px-6 md:py-4">
                    <span class="font-medium text-gray-800 bg-gray-100 px-2 py-1 md:px-2.5 md:py-1 rounded-md text-[10px] md:text-xs border border-gray-200 whitespace-nowrap">CA SKIN GLOW</span>
                  </td>
                  <td class="px-4 py-3 md:px-6 md:py-4 font-mono text-gray-500 text-[11px] md:text-xs">CASM001</td>
                  <td class="px-4 py-3 md:px-6 md:py-4 text-right">
                    <span class="font-bold text-green-600 bg-green-50 px-2 py-1 md:px-2.5 md:py-1 rounded-md border border-green-100">+500</span>
                  </td>
                  <td class="px-4 py-3 md:px-6 md:py-4 text-gray-700 min-w-[120px]">Pabrik A</td>
                </tr>
                <tr class="hover:bg-gray-50/80 transition-colors">
                  <td class="px-4 py-3 md:px-6 md:py-4 text-gray-500 text-[11px] md:text-xs font-medium">10:15 WIB</td>
                  <td class="px-4 py-3 md:px-6 md:py-4">
                    <span class="font-medium text-gray-800 bg-gray-100 px-2 py-1 md:px-2.5 md:py-1 rounded-md text-[10px] md:text-xs border border-gray-200 whitespace-nowrap">Packaging Packing</span>
                  </td>
                  <td class="px-4 py-3 md:px-6 md:py-4 font-mono text-gray-500 text-[11px] md:text-xs">POLY02</td>
                  <td class="px-4 py-3 md:px-6 md:py-4 text-right">
                    <span class="font-bold text-green-600 bg-green-50 px-2 py-1 md:px-2.5 md:py-1 rounded-md border border-green-100">+1000</span>
                  </td>
                  <td class="px-4 py-3 md:px-6 md:py-4 text-gray-700 min-w-[120px]">Supplier Plastik PT</td>
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
// Proteksi Halaman
const currentUser = useState('user')
if (!currentUser.value) {
  navigateTo('/login')
}
</script>