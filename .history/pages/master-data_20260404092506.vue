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
          <tbody class="text-xs md:text-