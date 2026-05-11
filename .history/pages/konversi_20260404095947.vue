<template>
  <div class="pb-10 relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
      <div class="flex items-center">
        <span class="material-symbols-outlined text-2xl md:text-3xl text-gray-400 mr-2 md:mr-3">layers</span>
        <h2 class="text-lg md:text-2xl font-bold text-gray-800">Rakitan & Bundling Konversi</h2>
      </div>
    </div>

    <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-md p-4 md:p-6 mb-6 text-white">
      <h3 class="font-bold flex items-center mb-4 text-sm md:text-base border-b border-blue-500/50 pb-3">
        <span class="material-symbols-outlined mr-2">add_task</span> Buat Bundling Baru (Proses Konversi)
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-blue-200 uppercase mb-1">SKU Hasil Jadi (Nama Paket)</label>
          
          <div class="relative w-full">
            <select class="w-full bg-white/10 hover:bg-white/20 border border-blue-400/50 rounded-lg py-2.5 pl-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-white text-white font-bold appearance-none cursor-pointer transition-colors shadow-inner">
              <option class="text-gray-800">PAKET-GLOWING-LENGKAP</option>
              <option class="text-gray-800">BUNDLE-SERUM-MIST</option>
            </select>
            <span class="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none text-xl">expand_more</span>
          </div>

          <p class="text-[10px] md:text-xs text-blue-200 mt-1.5 flex items-center">
            <span class="material-symbols-outlined text-xs mr-1">info</span> 
            Otomatis akan memotong: 1x CAS001 + 1x CAM001 + 1x Pouch
          </p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-blue-200 uppercase mb-1">Kuantitas Dibuat</label>
          <div class="flex gap-2">
            <input type="number" class="w-full bg-white/10 border border-blue-400/50 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-white text-center font-bold text-white placeholder-blue-300" placeholder="0">
            <button class="bg-white text-blue-700 font-bold px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">Rakit</button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 class="font-bold text-gray-700 flex items-center text-sm md:text-base">
          <span class="material-symbols-outlined mr-2 text-gray-500">list_alt</span> Daftar Rumus Konversi (Bill of Materials)
        </h3>
      </div>
      
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left min-w-[700px]">
          <thead class="bg-white text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">
            <tr>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">SKU Bundling Jadi</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b">Komponen Satuan (Barang Dipotong)</th>
              <th class="px-4 py-3 md:px-6 md:py-4 border-b text-center">Status</th>
            </tr>
          </thead>
          <tbody class="text-xs md:text-sm divide-y divide-gray-100">
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 md:px-6 md:py-4 font-mono font-bold text-gray-800">PAKET-GLOWING-LENGKAP</td>
              <td class="px-4 py-3 md:px-6 md:py-4">
                <ul class="list-disc list-inside text-gray-600 font-mono text-xs space-y-1">
                  <li>1x CAS001 (Peptide Serum)</li>
                  <li>1x CAM001 (Moisturizer)</li>
                  <li>1x POUCH-CA</li>
                </ul>
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-center">
                <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] md:text-xs font-bold">Aktif</span>
              </td>
            </tr>
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 md:px-6 md:py-4 font-mono font-bold text-gray-800">BUNDLE-SERUM-MIST</td>
              <td class="px-4 py-3 md:px-6 md:py-4">
                <ul class="list-disc list-inside text-gray-600 font-mono text-xs space-y-1">
                  <li>1x CASM001 (Serum Mist)</li>
                  <li>1x CAS001 (Peptide Serum)</li>
                </ul>
              </td>
              <td class="px-4 py-3 md:px-6 md:py-4 text-center">
                <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] md:text-xs font-bold">Aktif</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>