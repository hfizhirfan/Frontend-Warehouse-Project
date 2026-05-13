<template>
  <div class="p-6 max-w-4xl">

    <!-- TITLE -->
    <h2 class="text-2xl font-semibold mb-6">
      Master Bill of Materials
    </h2>

    <!-- CARD -->
    <div class="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

      <!-- ================= BUNDLE ================= -->
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-600">
          Produk Bundle
        </label>

        <div class="relative">
          <select
            v-model="bundle_id"
            class="w-full appearance-none border border-gray-300 rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Pilih Produk</option>

            <option
              v-for="p in products"
              :key="p.id"
              :value="p.id"
            >
              {{ p.sku }} - {{ p.name }}
            </option>

          </select>

          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            expand_more
          </span>
        </div>
      </div>

      <!-- ================= COMPONENTS ================= -->
      <div class="space-y-3">

        <div
          v-for="(row, i) in components"
          :key="i"
          class="flex items-center gap-3 bg-gray-50 border rounded-xl p-3"
        >

          <!-- SELECT COMPONENT -->
          <div class="flex-1 relative">
            <select
              v-model="row.product_id"
              class="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Pilih Komponen</option>

              <option
                v-for="p in products"
                :key="p.id"
                :value="p.id"
              >
                {{ p.sku }} - {{ p.name }}
              </option>

            </select>

            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              expand_more
            </span>
          </div>

          <!-- QTY -->
          <input
            type="number"
            v-model.number="row.qty"
            min="1"
            class="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <!-- DELETE -->
          <button
            @click="removeRow(i)"
            class="text-red-500 hover:bg-red-50 rounded-lg p-2 transition"
          >
            ✕
          </button>

        </div>
      </div>

      <!-- ================= ACTION ================= -->
      <div class="flex justify-between items-center pt-2">

        <button
          @click="addRow"
          class="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
        >
          + Tambah Komponen
        </button>

        <button
          @click="saveBom"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          Simpan
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const BASE_URL = 'https://1ea1-118-137-62-156.ngrok-free.app/api'

// ================= STATE =================
const bundle_id = ref('')
const components = ref([
  { product_id: '', qty: 1 }
])

// ================= FETCH PRODUCTS =================
const { data, pending, error } = await useFetch(`${BASE_URL}/products`)

// HANDLE SEMUA FORMAT RESPONSE 🔥
const products = computed(() => {
  if (!data.value) return []

  return Array.isArray(data.value)
    ? data.value
    : data.value.data || []
})

// ================= ACTION =================
const addRow = () => {
  components.value.push({
    product_id: '',
    qty: 1
  })
}

const removeRow = (i) => {
  components.value.splice(i, 1)
}

// ================= SAVE =================
const saveBom = async () => {

  if (!bundle_id.value) {
    alert('Pilih bundle dulu')
    return
  }

  if (components.value.length === 0) {
    alert('Tambahkan minimal 1 komponen')
    return
  }

  // validasi kosong
  const invalid = components.value.some(c => !c.product_id || !c.qty)
  if (invalid) {
    alert('Semua komponen harus diisi')
    return
  }

  try {
    await $fetch(`${BASE_URL}/bom`, {
      method: 'POST',
      body: {
        bundle_id: bundle_id.value,
        components: components.value
      }
    })

    alert('✅ BoM berhasil disimpan')

    // reset
    bundle_id.value = ''
    components.value = [{ product_id: '', qty: 1 }]

  } catch (err) {
    console.error(err)
    alert(err.data?.message || '❌ Gagal simpan BoM')
  }
}
</script>