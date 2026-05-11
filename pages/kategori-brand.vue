<template>
  <div class="pb-10 relative">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-lg md:text-2xl font-bold text-gray-800">Kategori & Brand</h2>
        <p class="text-xs md:text-sm text-gray-500">Kelola Brand, Kategori, dan Satuan</p>
      </div>

      <button @click="openModal" class="btn-primary flex items-center gap-2 text-xs md:text-sm px-3 md:px-4 py-2">
        <span class="material-symbols-outlined text-lg">add</span>
        Tambah
      </button>
    </div>

    <!-- GRID -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- BRAND -->
      <div class="card">
        <h3 class="card-title text-sm md:text-base text-blue-600">Brand</h3>

        <ul>
          <!-- SKELETON -->
          <template v-if="loadingData">
            <li v-for="n in 4" :key="'b-skel-' + n" class="item">
              <div class="w-full">
                <div class="skeleton h-4 w-32 mb-1"></div>
                <div class="skeleton h-3 w-20"></div>
              </div>
            </li>
          </template>

          <!-- DATA -->
          <template v-else>
            <li v-for="b in brands" :key="b.id" class="item group">
              <div>
                <p class="font-semibold text-sm md:text-base">{{ b.name }}</p>
                <p class="text-[11px] md:text-xs text-gray-400">{{ b.contact_person || '-' }}</p>
              </div>

              <button 
                @click="hapusData('brands', b.id)" 
                class="btn-delete opacity-0 group-hover:opacity-100"
              >
                <span class="material-symbols-outlined text-[18px]">
                  delete_outline
                </span>
              </button>
            </li>

            <li v-if="brands.length === 0" class="empty">
              Belum ada data
            </li>
          </template>
        </ul>
      </div>

      <!-- CATEGORY -->
      <div class="card">
        <h3 class="card-title text-purple-600">Kategori</h3>

        <ul>
          <!-- 🔥 SKELETON -->
          <template v-if="loadingData">
            <li v-for="n in 5" :key="'cat-skeleton-' + n" class="item">
              <div class="skeleton h-4 w-32"></div>
            </li>
          </template>

          <!-- ✅ DATA -->
          <template v-else>
            <li v-for="c in categories" :key="c.id" class="item group">
              <span class="text-sm md:text-base">{{ c.name }}</span>

              <button 
                @click="hapusData('categories', c.id)" 
                class="btn-delete opacity-0 group-hover:opacity-100"
              >
                <span class="material-symbols-outlined text-[18px]">
                  delete_outline
                </span>
              </button>
            </li>

            <!-- EMPTY -->
            <li v-if="!categories.length" class="empty">
              Belum ada data
            </li>
          </template>
        </ul>
      </div>

      <!-- UOM -->
      <div class="card">
        <h3 class="card-title text-orange-600">Satuan</h3>

        <ul>
          <!-- 🔥 SKELETON -->
          <template v-if="loadingData">
            <li v-for="n in 5" :key="'uom-skeleton-' + n" class="item">
              <div class="skeleton h-4 w-24"></div>
            </li>
          </template>

          <!-- ✅ DATA -->
          <template v-else>
            <li v-for="u in uoms" :key="u.id" class="item group">
              <span>{{ u.name }}</span>

              <button 
                @click="hapusData('uoms', u.id)" 
                class="btn-delete opacity-0 group-hover:opacity-100"
              >
                <span class="material-symbols-outlined text-[18px]">
                  delete_outline
                </span>
              </button>
            </li>

            <!-- EMPTY -->
            <li v-if="!uoms.length" class="empty">
              Belum ada data
            </li>
          </template>
        </ul>
      </div>

    </div>

    <!-- MODAL -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center">

      <div class="relative bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-4 md:p-6 pb-[env(safe-area-inset-bottom)+32px] max-h-[90vh] overflow-y-auto animate-slide-up">

        <!-- HANDLE (mobile only) -->
        <div class="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-3 md:hidden"></div>

        <!-- CLOSE -->
        <button @click="isModalOpen = false" class="absolute top-3 right-3 text-gray-400">
          <span class="material-symbols-outlined text-base">close</span>
        </button>

        <!-- TITLE -->
        <h3 class="font-bold mb-4 text-sm md:text-lg">Tambah Data</h3>

        <form @submit.prevent="simpanData" class="space-y-4">

          <!-- TYPE -->
          <div ref="typeRef" class="relative">
            <div @click.stop="toggleType" class="dropdown-input">
              {{ selectedTypeLabel }}
              <span class="material-symbols-outlined text-sm">expand_more</span>
            </div>

            <div v-if="showType" class="dropdown-menu">
              <div v-for="item in typeOptions" :key="item.value" @click="selectType(item.value)" class="dropdown-item">
                {{ item.label }}
              </div>
            </div>
          </div>

          <!-- INPUT -->
          <input v-model="form.name" class="input" placeholder="Nama" required />

          <input v-if="form.type === 'brand'" v-model="form.contact_person" class="input" placeholder="Contact Person" />

          <!-- BUTTON -->
          <div class="flex flex-col md:flex-row gap-2 pt-3 pb-6">
            <button type="button" @click="isModalOpen = false" class="btn-secondary">
              Batal
            </button>

            <button type="submit" :disabled="loading" class="btn-primary">
              {{ loading ? 'Saving...' : 'Simpan' }}
            </button>
          </div>

        </form>

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
const isModalOpen = ref(false)
const loading = ref(false)
const loadingData = ref(true)

const brandsData = ref([])
const categoriesData = ref([])
const uomsData = ref([])

// ================= NORMALIZE =================
const normalize = (res) => {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}

// ================= FETCH =================
const fetchData = async () => {
  loadingData.value = true

  try {
    const [b, c, u] = await Promise.all([
      $api('/brands'),
      $api('/categories'),
      $api('/uoms')
    ])

    brandsData.value = normalize(b)
    categoriesData.value = normalize(c)
    uomsData.value = normalize(u)

  } catch (e) {
    console.log('❌ FETCH ERROR:', e)

    Swal.fire({
      icon: 'error',
      title: 'Gagal load data',
      text: 'Tidak bisa mengambil data'
    })
  } finally {
    await new Promise(r => setTimeout(r, 300))
    loadingData.value = false
  }
}

onMounted(fetchData)

// ================= COMPUTED =================
const brands = computed(() => brandsData.value)
const categories = computed(() => categoriesData.value)
const uoms = computed(() => uomsData.value)

// ================= FORM =================
const form = ref({
  type: 'brand',
  name: '',
  contact_person: ''
})

// ================= DROPDOWN TYPE =================
const showType = ref(false)
const typeRef = ref(null)

const typeOptions = [
  { label: 'Brand', value: 'brand' },
  { label: 'Kategori', value: 'category' },
  { label: 'UOM', value: 'uom' }
]

const toggleType = () => {
  showType.value = !showType.value
}

const selectType = (val) => {
  form.value.type = val
  showType.value = false
}

const selectedTypeLabel = computed(() => {
  return typeOptions.find(t => t.value === form.value.type)?.label || 'Pilih Tipe'
})

// ================= CLICK OUTSIDE =================
const handleClickOutside = (e) => {
  if (typeRef.value && !typeRef.value.contains(e.target)) {
    showType.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ================= MODAL =================
const openModal = () => {
  form.value = {
    type: 'brand',
    name: '',
    contact_person: ''
  }
  isModalOpen.value = true
}

// ================= CREATE =================
const simpanData = async () => {
  loading.value = true

  try {
    if (!form.value.name) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Nama wajib diisi'
      })
    }

    const endpoint =
      form.value.type === 'brand'
        ? '/brands'
        : form.value.type === 'category'
        ? '/categories'
        : '/uoms'

    const payload = {
      name: form.value.name
    }

    if (form.value.type === 'brand') {
      payload.contact_person = form.value.contact_person
    }

    await $api(endpoint, {
      method: 'POST',
      body: payload
    })

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Data berhasil ditambahkan',
      timer: 1500,
      showConfirmButton: false
    })

    isModalOpen.value = false
    await fetchData()

  } catch (e) {
    console.log(e)

    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: e.data?.message || 'Gagal menyimpan data'
    })
  } finally {
    loading.value = false
  }
}

// ================= DELETE =================
const hapusData = async (type, id) => {
  const result = await Swal.fire({
    title: 'Hapus data?',
    text: 'Data tidak bisa dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    await $api(`/${type}/${id}`, {
      method: 'DELETE'
    })

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil dihapus',
      timer: 1500,
      showConfirmButton: false
    })

    await fetchData()

  } catch (e) {
    console.log(e)

    Swal.fire({
      icon: 'error',
      title: 'Gagal hapus',
      text: e.data?.message || 'Tidak bisa dihapus'
    })
  }
}
</script>

<style scoped>
.card {
  @apply bg-white p-3 md:p-4 rounded-xl border shadow-sm;
}
.card-title {
  @apply font-bold mb-3;
}
.item {
  @apply flex justify-between items-center px-2 py-1.5 md:py-2 text-sm;
}
.empty {
  @apply text-gray-400 text-sm text-center py-4;
}
.btn-delete {
  @apply text-gray-300 hover:text-red-500 transition-all duration-200;
}
.input {
  @apply w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all;
}
.btn-secondary {
  @apply bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 transition-all;
}
.modal {
  @apply fixed inset-0 bg-black/40 flex items-center justify-center;
}
.modal-box {
  @apply bg-white p-4 md:p-6 text-sm md:text-base rounded-2xl w-full max-w-md shadow-xl;
}

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

.dropdown-input {
  @apply w-full border rounded-xl px-4 py-2 bg-white flex justify-between items-center cursor-pointer shadow-sm;
}

.dropdown-menu {
  @apply absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-lg border max-h-60 overflow-auto;
}

.dropdown-item {
  @apply px-4 py-2 cursor-pointer hover:bg-gray-100 transition;
}

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
</style>