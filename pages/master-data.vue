<template>
  <div class="px-4 md:px-0 pb-20 md:pb-10">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg md:text-2xl font-bold text-gray-800">Manajemen Master Data</h2>

      <button 
        @click="openModal()" 
        class="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm"
      >
        <span class="material-symbols-outlined text-sm md:text-base text-lg">add</span>
        Tambah Data
      </button>
    </div>

    <!-- TAB -->
    <div class="flex gap-2 mb-4">
      <button @click="activeTab = 'produk'" :class="tabClass('produk')">Produk</button>
      <button @click="activeTab = 'logistik'" :class="tabClass('logistik')">Logistik</button>
    </div>

    <!-- FILTER -->
    <div v-if="activeTab === 'produk'" class="flex gap-2 mb-4">
      <!-- BRAND -->
      <div ref="brandRef" class="relative w-52">
        <div @click.stop="toggleBrand" class="dropdown-input">
          {{ selectedBrandName || 'Semua Brand' }}
          <span class="material-symbols-outlined text-sm md:text-base">expand_more</span>
        </div>

        <div v-if="showBrand" class="dropdown-menu">
          <div @click="selectBrand('')" class="dropdown-item">
            Semua Brand
          </div>

          <div v-for="b in brands":key="b.id" @click="selectBrand(b.id)" class="dropdown-item">
            {{ b.name }}
          </div>
        </div>
      </div>

      <!-- CATEGORY -->
      <div ref="categoryRef" class="relative w-52">
        <div @click.stop="toggleCategory" class="dropdown-input">
          {{ selectedCategoryName || 'Semua Kategori' }}
          <span class="material-symbols-outlined text-sm md:text-base">expand_more</span>
        </div>

        <div v-if="showCategory" class="dropdown-menu">
          <div @click="selectCategory('')" class="dropdown-item">
            Semua Kategori
          </div>

          <div v-for="c in categories" :key="c.id" @click="selectCategory(c.id)" class="dropdown-item">
            {{ c.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border rounded-xl p-3 md:p-4 mb-4 flex items-center gap-2 md:gap-3">
      <input v-model="searchQuery" placeholder="Cari..." class="w-full md:w-64 border rounded-lg px-3 py-2 text-xs md:text-sm"/>
    </div>

    <!-- ================= PRODUK ================= -->
    <div v-if="activeTab === 'produk'" class="bg-white border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs md:text-sm min-w-[800px]">
          <thead class="bg-gray-50 text-[10px] md:text-xs uppercase">
            <tr>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">SKU</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">Nama</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">Brand</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">Kategori</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">UOM</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-center">Stock</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <template v-if="loadingProducts">
              <tr v-for="n in 6" :key="'skeleton-' + n">
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-24"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-32"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-24"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-24"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-16"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center"><div class="skeleton h-4 w-10 mx-auto"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center"><div class="skeleton h-4 w-16 mx-auto"></div></td>
              </tr>
            </template>

            <!-- ✅ DATA -->
            <template v-else>
              <tr v-for="item in filteredProducts" :key="item.id">
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.sku }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.name }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.brand?.name || '-' }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.category?.name || '-' }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.uom?.name || '-' }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center">{{ item.stock ?? 0 }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center">
                  <div class="flex justify-center gap-3">
                    <button @click="openModal(item)" class="text-blue-500">
                      <span class="material-symbols-outlined text-sm md:text-base">edit</span>
                    </button>
                    <button @click="hapusProduk(item.id)" class="text-red-500">
                      <span class="material-symbols-outlined text-sm md:text-base">delete</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- EMPTY -->
              <tr v-if="filteredProducts.length === 0">
                <td colspan="7" class="text-center py-6 text-gray-400">
                  Data kosong
                </td>
              </tr>
            </template>

          </tbody>
        </table>
      </div>  
    </div>

    <!-- ================= LOGISTIK ================= -->
    <div v-if="activeTab === 'logistik'" class="bg-white border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs md:text-sm min-w-[700px]">
          <thead class="bg-gray-50 text-[10px] md:text-xs uppercase">
            <tr>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">Kode</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">Ekspedisi</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">Platform</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">Store</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-left">Warehouse</th>
              <th class="px-2 md:px-4 py-2 md:py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <template v-if="loadingLogistics">
              <tr v-for="n in 6" :key="'log-skeleton-' + n">
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-20"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-32"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-24"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-24"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"><div class="skeleton h-4 w-28"></div></td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center">
                  <div class="skeleton h-4 w-16 mx-auto"></div>
                </td>
              </tr>
            </template>

            <!-- ✅ DATA -->
            <template v-else>
              <tr v-for="item in filteredLogistics" :key="item.id">
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.prefix_code }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.logistics_provider }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.platform }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.store_name || '-' }}</td>
                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{{ item.warehouse?.name || '-' }}</td>

                <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center">
                  <div class="flex justify-center items-center gap-3">
                    <button @click="openModal(item)" class="text-blue-500 hover:text-blue-700">
                      <span class="material-symbols-outlined text-sm md:text-base">edit</span>
                    </button>

                    <button @click="hapusLogistik(item.id)" class="text-red-500 hover:text-red-700">
                      <span class="material-symbols-outlined text-sm md:text-base">delete</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- EMPTY -->
              <tr v-if="filteredLogistics.length === 0">
                <td colspan="6" class="text-center py-6 text-gray-400">
                  Data kosong
                </td>
              </tr>
            </template>

          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL -->
    <!-- MODAL -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center">

      <!-- CONTENT -->
      <div class="relative bg-white w-full rounded-t-2xl md:rounded-xl p-4 md:p-6 pb-[env(safe-area-inset-bottom)+32px] max-h-[90vh] overflow-y-auto md:max-w-md animate-slide-up">

        <!-- HANDLE (mobile only) -->
        <div class="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-3 md:hidden"></div>

        <!-- CLOSE -->
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-400">
          <span class="material-symbols-outlined text-base">close</span>
        </button>

        <!-- TITLE -->
        <h3 class="font-bold mb-4 text-sm md:text-base">
          {{ isEditing ? 'Edit Data' : 'Tambah Data' }}
        </h3>

        <!-- ================= PRODUK ================= -->
        <form v-if="activeTab==='produk'" @submit.prevent="simpanData" class="space-y-3 text-sm">

          <input v-model="formProduk.sku" placeholder="SKU" class="input" required />
          <input v-model="formProduk.name" placeholder="Nama Produk" class="input" required />

          <!-- BRAND -->
          <div ref="modalBrandRef" class="relative">
            <div @click.stop="toggleModalBrand" class="dropdown-input">
              {{ selectedModalBrandName || 'Pilih Brand' }}
              <span class="material-symbols-outlined text-base">expand_more</span>
            </div>

            <div v-if="showModalBrand" class="dropdown-menu">
              <div v-for="b in brands" :key="b.id" @click="selectModalBrand(b)" class="dropdown-item">
                {{ b.name }}
              </div>
            </div>
          </div>

          <!-- CATEGORY -->
          <div ref="modalCategoryRef" class="relative">
            <div @click.stop="toggleModalCategory" class="dropdown-input">
              {{ selectedModalCategoryName || 'Pilih Kategori' }}
              <span class="material-symbols-outlined text-base">expand_more</span>
            </div>

            <div v-if="showModalCategory" class="dropdown-menu">
              <div v-for="c in categories" :key="c.id" @click="selectModalCategory(c)" class="dropdown-item">
                {{ c.name }}
              </div>
            </div>
          </div>

          <!-- UOM -->
          <div ref="uomRef" class="relative">
            <div @click.stop="toggleUom" class="dropdown-input">
              {{ selectedUomName || 'Pilih UOM' }}
              <span class="material-symbols-outlined text-base">expand_more</span>
            </div>

            <div v-if="showUom" class="dropdown-menu">
              <div v-for="u in uoms" :key="u.id" @click="selectUom(u)" class="dropdown-item">
                {{ u.name }}
              </div>
            </div>
          </div>

          <!-- BUTTON -->
          <div class="flex flex-col md:flex-row gap-2 pt-3 pb-4">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancel
            </button>

            <button class="btn" :disabled="isLoading">
              {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>

        </form>

        <!-- ================= LOGISTIK ================= -->
        <form v-else @submit.prevent="simpanData" class="space-y-3 text-sm">

          <input v-model="formLogistik.prefix_code" placeholder="Kode" class="input" required />
          <input v-model="formLogistik.logistics_provider" placeholder="Ekspedisi" class="input" required />
          <input v-model="formLogistik.platform" placeholder="Platform" class="input" required />

          <!-- BUTTON -->
          <div class="flex flex-col md:flex-row gap-2 pt-3 pb-6">
            <button type="button" @click="closeModal" class="btn-secondary">
              Batal
            </button>

            <button class="btn" :disabled="isLoading">
              {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>

        </form>
        <div class="h-6"></div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

// ================= STATE =================
const activeTab = ref('produk')
const isModalOpen = ref(false)
const isEditing = ref(false)
const selectedId = ref(null)
const isLoading = ref(false)

const loadingProducts = ref(true)
const loadingLogistics = ref(true)

const products = ref([])
const logistics = ref([])
const brands = ref([])
const categories = ref([])
const uoms = ref([])

// ================= NORMALIZE =================
const normalize = (res) => {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}

// ================= FORM =================
const formProduk = ref({
  sku: '',
  name: '',
  brand_id: '',
  category_id: '',
  uom_id: ''
})

const formLogistik = ref({
  prefix_code: '',
  logistics_provider: '',
  platform: ''
})

// ================= FETCH =================
const fetchData = async () => {
  loadingProducts.value = true
  loadingLogistics.value = true

  try {
    const [p, l, b, c, u] = await Promise.all([
      $api('/products'),
      $api('/warehouse-mappings'),
      $api('/brands'),
      $api('/categories'),
      $api('/uoms')
    ])

    products.value = normalize(p)
    logistics.value = normalize(l)
    brands.value = normalize(b)
    categories.value = normalize(c)
    uoms.value = normalize(u)

  } catch (e) {
    console.log('❌ FETCH ERROR:', e)
  } finally {
    loadingProducts.value = false
    loadingLogistics.value = false
  }
}

onMounted(fetchData)

// ================= FILTER =================
const searchQuery = ref('')
const filterBrand = ref('')
const filterCategory = ref('')

// ================= DROPDOWN FILTER =================
const showBrand = ref(false)
const showCategory = ref(false)

const brandRef = ref(null)
const categoryRef = ref(null)

const toggleBrand = () => showBrand.value = !showBrand.value
const toggleCategory = () => showCategory.value = !showCategory.value

const selectBrand = (id) => {
  filterBrand.value = id
  showBrand.value = false
}

const selectCategory = (id) => {
  filterCategory.value = id
  showCategory.value = false
}

const selectedBrandName = computed(() =>
  brands.value.find(b => b.id == filterBrand.value)?.name
)

const selectedCategoryName = computed(() =>
  categories.value.find(c => c.id == filterCategory.value)?.name
)

// ================= MODAL DROPDOWN =================
const showModalBrand = ref(false)
const showModalCategory = ref(false)
const showUom = ref(false)

const modalBrandRef = ref(null)
const modalCategoryRef = ref(null)
const uomRef = ref(null)

const toggleModalBrand = () => showModalBrand.value = !showModalBrand.value
const toggleModalCategory = () => showModalCategory.value = !showModalCategory.value
const toggleUom = () => showUom.value = !showUom.value

const selectModalBrand = (b) => {
  formProduk.value.brand_id = b.id
  showModalBrand.value = false
}

const selectModalCategory = (c) => {
  formProduk.value.category_id = c.id
  showModalCategory.value = false
}

const selectUom = (u) => {
  formProduk.value.uom_id = u.id
  showUom.value = false
}

const selectedModalBrandName = computed(() =>
  brands.value.find(b => b.id == formProduk.value.brand_id)?.name
)

const selectedModalCategoryName = computed(() =>
  categories.value.find(c => c.id == formProduk.value.category_id)?.name
)

const selectedUomName = computed(() =>
  uoms.value.find(u => u.id == formProduk.value.uom_id)?.name
)

// ================= CLICK OUTSIDE =================
const handleClickOutside = (e) => {
  if (brandRef.value && !brandRef.value.contains(e.target)) {
    showBrand.value = false
  }

  if (categoryRef.value && !categoryRef.value.contains(e.target)) {
    showCategory.value = false
  }

  if (modalBrandRef.value && !modalBrandRef.value.contains(e.target)) {
    showModalBrand.value = false
  }

  if (modalCategoryRef.value && !modalCategoryRef.value.contains(e.target)) {
    showModalCategory.value = false
  }

  if (uomRef.value && !uomRef.value.contains(e.target)) {
    showUom.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ================= COMPUTED =================
const filteredProducts = computed(() => {
  return products.value
    .filter(p =>
      `${p.sku || ''} ${p.name || ''}`
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    )
    .filter(p =>
      !filterBrand.value ||
      p.brand_id == filterBrand.value ||
      p.brand?.id == filterBrand.value
    )
    .filter(p =>
      !filterCategory.value ||
      p.category_id == filterCategory.value ||
      p.category?.id == filterCategory.value
    )
})

const filteredLogistics = computed(() => {
  return logistics.value.filter(l =>
    `${l.prefix_code || ''} ${l.logistics_provider || ''}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
})

// ================= MODAL =================
const openModal = (item = null) => {
  isModalOpen.value = true

  if (item) {
    isEditing.value = true
    selectedId.value = item.id

    if (activeTab.value === 'produk') {
      formProduk.value = {
        sku: item.sku || '',
        name: item.name || '',
        brand_id: item.brand_id || item.brand?.id || '',
        category_id: item.category_id || item.category?.id || '',
        uom_id: item.uom_id || item.uom?.id || ''
      }
    } else {
      formLogistik.value = {
        prefix_code: item.prefix_code || '',
        logistics_provider: item.logistics_provider || '',
        platform: item.platform || ''
      }
    }

  } else {
    isEditing.value = false
    selectedId.value = null

    formProduk.value = {
      sku: '',
      name: '',
      brand_id: '',
      category_id: '',
      uom_id: ''
    }

    formLogistik.value = {
      prefix_code: '',
      logistics_provider: '',
      platform: ''
    }
  }
}

const closeModal = () => {
  isModalOpen.value = false
}

// ================= SIMPAN =================
const simpanData = async () => {
  isLoading.value = true

  try {
    const isProduk = activeTab.value === 'produk'

    const url = isEditing.value
      ? `/${isProduk ? 'products' : 'warehouse-mappings'}/${selectedId.value}`
      : `/${isProduk ? 'products' : 'warehouse-mappings'}`

    const payload = isProduk
      ? formProduk.value
      : formLogistik.value

    await $api(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      body: payload
    })

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      timer: 1500,
      showConfirmButton: false
    })

    closeModal()
    await fetchData()

  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Data gagal disimpan'
    })
  } finally {
    isLoading.value = false
  }
}

// ================= DELETE =================
const hapusProduk = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus data?',
    text: 'Data tidak bisa dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus'
  })

  if (!result.isConfirmed) return

  await $api(`/products/${id}`, { method: 'DELETE' })
  await fetchData()
}

const hapusLogistik = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus data?',
    icon: 'warning',
    showCancelButton: true
  })

  if (!result.isConfirmed) return

  await $api(`/warehouse-mappings/${id}`, { method: 'DELETE' })
  await fetchData()
}

// ================= UI =================
const tabClass = (tab) => {
  return `px-3 md:px-4 py-2 text-xs md:text-sm rounded ${
    activeTab.value === tab
      ? 'bg-blue-600 text-white'
      : 'bg-gray-200'
  }`
}
</script>

<style scoped>

/* ================= INPUT ================= */
.input {
  @apply w-full border border-gray-300 rounded-lg 
  px-3 py-2.5 
  text-sm 
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

/* ================= BUTTON ================= */
.btn {
  @apply w-full bg-blue-600 text-white 
  py-2.5 
  text-sm font-semibold 
  rounded-lg 
  hover:bg-blue-700 
  transition 
  disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply w-full bg-gray-200 text-gray-700 
  py-2.5 
  text-sm font-medium 
  rounded-lg 
  hover:bg-gray-300 
  transition;
}

/* ================= SELECT ================= */
.select-wrapper {
  @apply relative w-full;
}

.select-custom {
  @apply w-full border border-gray-300 rounded-lg 
  px-3 py-2.5 pr-10 
  text-sm bg-white 
  appearance-none 
  focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.select-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 
  text-gray-400 pointer-events-none;
}

/* ================= DROPDOWN ================= */
.dropdown-input {
  @apply w-full border border-gray-300 rounded-xl 
  px-3 md:px-4 py-2.5 
  text-sm 
  bg-white flex justify-between items-center 
  cursor-pointer shadow-sm 
  hover:border-blue-400 transition;
}

.dropdown-menu {
  @apply absolute z-50 mt-2 w-full bg-white 
  rounded-2xl shadow-lg border 
  max-h-60 overflow-auto;
}

.dropdown-item {
  @apply px-3 md:px-4 py-2.5 
  text-sm 
  cursor-pointer 
  hover:bg-blue-50 
  transition;
}

/* ================= SKELETON ================= */
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
  border-radius: 6px;
}

/* ================= MODAL ANIMATION ================= */
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0.8;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp 0.25s ease-out;
}

/* ================= SCROLL (BIAR HALUS DI MOBILE) ================= */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* ================= MOBILE IMPROVEMENTS ================= */
@media (max-width: 640px) {

  .input {
    @apply text-sm py-3;
  }

  .btn, .btn-secondary {
    @apply text-sm py-3;
  }

  .dropdown-input {
    @apply py-3 text-sm;
  }

  .dropdown-item {
    @apply py-3;
  }

}

</style>