<template>
  <div class="pb-10 relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
      <div class="flex items-center">
        <span class="material-symbols-outlined text-2xl md:text-3xl text-gray-400 mr-2 md:mr-3">assignment_return</span>
        <h2 class="text-lg md:text-2xl font-bold text-gray-800">Manajemen Retur & Batal</h2>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 md:gap-6">
      <div class="w-full lg:w-1/3">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 relative overflow-hidden">
          <span class="material-symbols-outlined absolute -right-4 -top-4 text-8xl text-red-50 opacity-50 pointer-events-none">keyboard_return</span>
          
          <h3 class="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center relative z-10 text-sm md:text-base">
            <span class="material-symbols-outlined mr-2 text-red-500 text-lg">edit_document</span> Form Terima Retur
          </h3>
          
          <form class="space-y-3 md:space-y-4 relative z-10">
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">No. Resi (Waybill)</label>
              <input type="text" class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-red-500 outline-none uppercase font-mono" placeholder="Scan atau ketik resi...">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">Ekspedisi</label>
                <select class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-red-500 outline-none">
                  <option>J&T</option>
                  <option>Sicepat</option>
                  <option>Shopee Express</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">Platform</label>
                <select class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-red-500 outline-none">
                  <option>Tiktok</option>
                  <option>Shopee</option>
                  <option>Lazada</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">Kondisi Barang (QC)</label>
              <select class="w-full border border-gray-300 rounded-lg p-2 md:p-2.5 text-xs md:text-sm focus:ring-2 focus:ring-red-500 outline-none bg-red-50 font-semibold text-gray-700">
                <option value="good">🟢 Utuh (Kembali ke Stok)</option>
                <option value="defect">🔴 Rusak / Bocor (Defect/Dump)</option>
                <option value="lost">⚫ Hilang di Ekspedisi</option>
              </select>
            </div>
            <button type="button" class="w-full bg-red-600 text-white text-sm md:text-base font-bold py-2.5 md:py-3 px-4 rounded-lg hover:bg-red-700 transition-colors mt-2 shadow-sm flex justify-center items-center">
              <span class="material-symbols-outlined mr-2 text-lg">save</span> Proses Retur
            </button>
          </form>
        </div>
      </div>

      <div class="w-full lg:w-2/3">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
          <div class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 class="font-bold text-gray-700 flex items-center text-sm md:text-base">
              <span class="material-symbols-outlined mr-2 text-gray-500">history</span> Paket Retur Hari Ini
            </h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left min-w-[700px]">
              <thead class="bg-white text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 md:px-6 md:py-4 border-b">No. Resi</th>
                  <th class="px-4 py-3 md:px-6 md:py-4 border-b">Asal</th>
                  <th class="px-4 py-3 md:px-6 md:py-4 border-b">SKU Diterima</th>
                  <th class="px-4 py-3 md:px-6 md:py-4 border-b text-center">Status Inventori</th>
                </tr>
              </thead>
              <tbody class="text-xs md:text-sm divide-y divide-gray-100">
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 md:px-6 md:py-4 font-mono font-bold">JP991203011</td>
                  <td class="px-4 py-3 md:px-6 md:py-4">Shopee <span class="text-gray-400">| J&T</span></td>
                  <td class="px-4 py-3 md:px-6 md:py-4 font-mono text-gray-600">CAS001 <span class="text-xs ml-1">(1 pcs)</span></td>
                  <td class="px-4 py-3 md:px-6 md:py-4 text-center">
                    <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] md:text-xs font-bold">Good Stock</span>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 md:px-6 md:py-4 font-mono font-bold">JX882199330</td>
                  <td class="px-4 py-3 md:px-6 md:py-4">Tiktok <span class="text-gray-400">| SPX</span></td>
                  <td class="px-4 py-3 md:px-6 md:py-4 font-mono text-gray-600">CASM001 <span class="text-xs ml-1">(2 pcs)</span></td>
                  <td class="px-4 py-3 md:px-6 md:py-4 text-center">
                    <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] md:text-xs font-bold">Rusak / Dump</span>
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