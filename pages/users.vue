<template>
  <div class="max-w-5xl mx-auto pb-10">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-lg md:text-2xl font-bold">Manajemen User</h2>
        <p class="text-sm text-gray-500">Kelola user admin & guest</p>
      </div>

      <button @click="openModal" class="btn-primary text-xs md:text-sm px-3 md:px-4 py-2">
        + Tambah User
      </button>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-2xl border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs md:text-sm min-w-[600px]">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left">Nama</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left">Username</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-left">Role</th>
              <th class="px-3 md:px-6 py-2 md:py-3 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-t">
              <td class="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">{{ user.name }}</td>
              <td class="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">{{ user.username }}</td>
              <td class="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                <span :class="badgeRole(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-3 md:px-6 py-2 md:py-4 text-right whitespace-nowrap">
                <button @click="deleteUser(user.id)" class="text-red-500 text-xs">
                  Hapus
                </button>
              </td>
            </tr>

            <tr v-if="!users.length">
              <td colspan="4" class="text-center py-10 text-gray-400">
                Tidak ada user
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
      <div class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-xl p-4 md:p-6 pb-[env(safe-area-inset-bottom)+20px]">
        <div class="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-3 md:hidden"></div>

        <h3 class="font-bold mb-4">Tambah User</h3>

        <div class="space-y-3">

          <input v-model="form.name" placeholder="Nama" class="input" />

          <input v-model="form.username" placeholder="Username" class="input" />

          <input v-model="form.password" type="password" placeholder="Password" class="input" />

          <!-- ROLE -->
          <div ref="roleRef" class="relative">
            <div @click="toggleRole" class="dropdown-input">
              {{ selectedRoleLabel }}
              <span class="material-symbols-outlined text-sm">expand_more</span>
            </div>

            <div v-if="showRole" class="dropdown-menu">
              <div @click="selectRole('admin')" class="dropdown-item">Admin</div>
              <div @click="selectRole('guest')" class="dropdown-item">Guest</div>
              <div @click="selectRole('super_admin')" class="dropdown-item">Super Admin</div>
            </div>
          </div>

          <!-- BRAND -->
          <div v-if="form.role !== 'super_admin'" ref="brandRef" class="relative">
            <div @click="toggleBrand" class="dropdown-input">
              {{ selectedBrandName || 'Pilih Brand' }}
              <span class="material-symbols-outlined text-sm">expand_more</span>
            </div>

            <div v-if="showBrand" class="dropdown-menu">
              <div @click="selectBrand('')" class="dropdown-item">
                Pilih Brand
              </div>

              <div
                v-for="b in brands"
                :key="b.id"
                @click="selectBrand(b.id)"
                class="dropdown-item"
              >
                {{ b.name }}
              </div>
            </div>
          </div>

        </div>

        <div class="flex flex-col md:flex-row gap-2 mt-4  pb-6">
          <button @click="showModal=false" class="btn-secondary w-full md:w-auto">Batal</button>
          <button @click="createUser" class="btn-primary w-full md:w-auto">Simpan</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import Swal from 'sweetalert2'

const { $api } = useNuxtApp()

// ================= STATE =================
const users = ref([])
const brands = ref([])
const showModal = ref(false)

const form = ref({
  name: '',
  username: '',
  password: '',
  role: 'admin',
  brand_id: ''
})

// ================= DROPDOWN =================
const showRole = ref(false)
const showBrand = ref(false)

const roleRef = ref(null)
const brandRef = ref(null)

// toggle
const toggleRole = () => {
  showRole.value = !showRole.value
}

const toggleBrand = () => {
  showBrand.value = !showBrand.value
}

// select
const selectRole = (role) => {
  form.value.role = role
  showRole.value = false

  if (role === 'super_admin') {
    form.value.brand_id = ''
  }
}

const selectBrand = (id) => {
  form.value.brand_id = id
  showBrand.value = false
}

// label
const selectedRoleLabel = computed(() => {
  switch (form.value.role) {
    case 'admin': return 'Admin'
    case 'guest': return 'Guest'
    case 'super_admin': return 'Super Admin'
    default: return 'Pilih Role'
  }
})

const selectedBrandName = computed(() => {
  return brands.value.find(b => b.id == form.value.brand_id)?.name
})

// klik luar
const handleClickOutside = (e) => {
  if (roleRef.value && !roleRef.value.contains(e.target)) {
    showRole.value = false
  }

  if (brandRef.value && !brandRef.value.contains(e.target)) {
    showBrand.value = false
  }
}

// ================= FETCH =================
const fetchUsers = async () => {
  const res = await $api('/users')
  users.value = res.data || res
}

const fetchBrands = async () => {
  const res = await $api('/brands')
  brands.value = res.data || res
}

onMounted(() => {
  fetchUsers()
  fetchBrands()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ================= MODAL =================
const openModal = () => {
  form.value = {
    name: '',
    username: '',
    password: '',
    role: 'admin',
    brand_id: ''
  }
  showModal.value = true
}

// ================= CREATE =================
const createUser = async () => {
  try {
    if (!form.value.name || !form.value.username || !form.value.password) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Semua field wajib diisi'
      })
    }

    if (form.value.role !== 'super_admin' && !form.value.brand_id) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Pilih brand terlebih dahulu'
      })
    }

    await $api('/users', {
      method: 'POST',
      body: form.value
    })

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'User berhasil dibuat',
      timer: 1500,
      showConfirmButton: false
    })

    showModal.value = false
    fetchUsers()

  } catch (err) {
    console.log('❌ ERROR:', err)

    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: err?.data?.message || 'Gagal membuat user'
    })
  }
}

// ================= DELETE =================
const deleteUser = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus user?',
    text: 'Data tidak bisa dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    await $api(`/users/${id}`, { method: 'DELETE' })

    await Swal.fire({
      icon: 'success',
      title: 'Terhapus',
      timer: 1500,
      showConfirmButton: false
    })

    fetchUsers()

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal hapus'
    })
  }
}

// ================= UI =================
const badgeRole = (role) => {
  const base = 'px-2 py-0.5 rounded text-[10px] md:text-xs'

  switch (role) {
    case 'super_admin':
      return `${base} bg-purple-100 text-purple-600`
    case 'admin':
      return `${base} bg-blue-100 text-blue-600`
    default:
      return `${base} bg-gray-100 text-gray-600`
  }
}
</script>

<style scoped>
.input {
  @apply w-full border p-2 rounded-lg text-sm;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700;
}

.dropdown-input {
  @apply w-full border rounded-xl px-4 py-2 bg-white flex justify-between items-center cursor-pointer shadow-sm text-sm;
}

.dropdown-menu {
  @apply absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-lg border max-h-60 overflow-auto;
}

.dropdown-item {
  @apply px-4 py-2 cursor-pointer hover:bg-gray-100 transition text-sm;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg;
}
</style>