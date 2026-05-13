<template>
  <div class="w-full">

    <!-- HEADER -->
    <h2 class="text-lg md:text-2xl font-bold mb-4 md:mb-6">Warehouse Mapping</h2>

    <div class="grid grid-cols-1 md:grid-cols-[40%_60%] gap-4 md:gap-6 items-start">

      <!-- ================= FORM ================= -->
      <div class="bg-white p-6 rounded-xl border shadow-sm">
        <h3 class="font-semibold mb-4">Form Mapping</h3>

        <div class="space-y-3">

          <input v-model="form.prefix_code" placeholder="Prefix"
            class="input-modern" />

          <input v-model="form.logistics_provider" placeholder="Courier"
            class="input-modern" />

          <input v-model="form.platform" placeholder="Platform"
            class="input-modern" />

          <!-- PRODUCT DROPDOWN -->
          <div ref="productRef" class="relative">
            <div @click="toggleProduct" class="input-modern flex justify-between items-center cursor-pointer">
              <span>
                {{ selectedProductLabel || '-- Pilih Produk --' }}
              </span>
              <span class="material-symbols-outlined text-gray-400 text-sm">
                expand_more
              </span>
            </div>

            <div v-if="showProduct" class="dropdown-menu">
              
              <!-- SEARCH -->
              <input v-model="searchProduct" placeholder="Cari produk..." class="dropdown-search"/>

              <!-- LIST -->
              <div v-for="p in filteredProducts" :key="p.id" @click="selectProduct(p)" class="dropdown-item">
                <div class="font-medium">{{ p.sku }}</div>
                <div class="text-xs text-gray-400">{{ p.name }}</div>
              </div>

              <div v-if="filteredProducts.length === 0" class="dropdown-empty">
                Tidak ditemukan
              </div>
            </div>
          </div>

          <input v-model="form.qty_default" type="number" placeholder="Qty"
            class="input-modern" />

          <button @click="save" class="btn-primary w-full">
            {{ form.id ? 'Update Mapping' : 'Tambah Mapping' }}
          </button>

        </div>
      </div>

      <!-- ================= TABLE ================= -->
      <div class="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
        <h3 class="font-semibold mb-4">List Mapping</h3>

        <div class="overflow-x-auto">
          <table class="w-full text-xs md:text-sm min-w-[650px]">
            <thead>
              <tr class="text-gray-500 border-b">
                <th class="text-left py-2 md:py-3">Prefix</th>
                <th class="text-left py-2 md:py-3">Courier</th>
                <th class="text-left py-2 md:py-3">Platform</th>
                <th class="text-left py-2 md:py-3">Product</th>
                <th class="text-left py-2 md:py-3">Qty</th>
                <th class="text-left py-2 md:py-3">Aksi</th>
              </tr>
            </thead>

            <tbody>

              <template v-if="loading">
                <tr v-for="n in 5" :key="'skel-' + n">
                  <td class="py-2 md:py-3 font-semibold"><div class="skeleton h-4 w-20"></div></td>
                  <td><div class="skeleton h-4 w-24"></div></td>
                  <td><div class="skeleton h-4 w-24"></div></td>
                  <td><div class="skeleton h-4 w-32"></div></td>
                  <td><div class="skeleton h-4 w-10"></div></td>
                  <td><div class="skeleton h-4 w-16"></div></td>
                </tr>
              </template>

              <template v-else>
                <tr v-for="item in list" :key="item.id"
                    class="border-b hover:bg-gray-50 transition">

                  <td class="py-2 md:py-3 font-semibold">{{ item.prefix_code }}</td>
                  <td>{{ item.logistics_provider }}</td>
                  <td>{{ item.platform }}</td>
                  <td>{{ item.product_id }}</td>
                  <td>{{ item.qty_default }}</td>

                  <td>
                    <div class="flex flex-col md:flex-row gap-1 md:gap-2">
                      <button @click="edit(item)" class="btn-edit">Edit</button>
                      <button @click="remove(item.id)" class="btn-delete">Delete</button>
                    </div>
                  </td>
                </tr>

                <tr v-if="list.length === 0">
                  <td colspan="6" class="text-center py-6 text-gray-400">
                    Tidak ada data
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

const BASE_URL = 'https://9eb8-118-137-62-156.ngrok-free.app/api'

export default {
  data() {
    return {
      list: [],
      products: [],
      loading: true,

      showProduct: false,
      searchProduct: '',

      form: {
        id: null,
        prefix_code: '',
        logistics_provider: '',
        platform: '',
        product_id: '',
        qty_default: 1
      }
    }
  },

  mounted() {
    this.fetchAll()
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  computed: {
    filteredProducts() {
      return this.products.filter(p => {
        const keyword = this.searchProduct.toLowerCase()

        return (
          p.sku?.toLowerCase().includes(keyword) ||
          p.name?.toLowerCase().includes(keyword)
        )
      })
    },

    selectedProductLabel() {
      const p = this.products.find(i => i.id == this.form.product_id)
      return p ? `${p.sku} - ${p.name}` : ''
    }
  },

  methods: {
    // ================= TOKEN =================
    getHeaders() {
      const token = localStorage.getItem('token')

      return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    },

    // ================= FETCH =================
    async fetchAll() {
      this.loading = true

      try {
        const [mappingRes, productRes] = await Promise.all([
          axios.get(`${BASE_URL}/warehouse-mappings`, {
            headers: this.getHeaders()
          }),
          axios.get(`${BASE_URL}/products`, {
            headers: this.getHeaders()
          })
        ])

        this.list = mappingRes.data?.data || mappingRes.data || []
        this.products = productRes.data?.data || productRes.data || []

      } catch (e) {
        console.log('❌ FETCH ERROR:', e)

        Swal.fire({
          icon: 'error',
          title: 'Gagal load data',
          text: 'Tidak bisa mengambil data dari server'
        })

        this.list = []
        this.products = []
      } finally {
        await new Promise(r => setTimeout(r, 300))
        this.loading = false
      }
    },

    // ================= DROPDOWN =================
    toggleProduct() {
      this.showProduct = !this.showProduct
    },

    selectProduct(p) {
      this.form.product_id = p.id
      this.showProduct = false
      this.searchProduct = ''
    },

    handleClickOutside(e) {
      if (this.$refs.productRef && !this.$refs.productRef.contains(e.target)) {
        this.showProduct = false
      }
    },

    // ================= SAVE =================
    async save() {
      try {
        if (!this.form.product_id) {
          return Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Pilih produk terlebih dahulu'
          })
        }

        if (this.form.id) {
          await axios.put(
            `${BASE_URL}/warehouse-mappings/${this.form.id}`,
            this.form,
            { headers: this.getHeaders() }
          )
        } else {
          await axios.post(
            `${BASE_URL}/warehouse-mappings`,
            this.form,
            { headers: this.getHeaders() }
          )
        }

        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Mapping berhasil disimpan',
          timer: 1500,
          showConfirmButton: false
        })

        this.resetForm()
        this.fetchAll()

      } catch (e) {
        console.log(e)

        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: e.response?.data?.message || 'Gagal menyimpan data'
        })
      }
    },

    // ================= EDIT =================
    edit(item) {
      this.form = { ...item }
    },

    // ================= DELETE =================
    async remove(id) {
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
        await axios.delete(
          `${BASE_URL}/warehouse-mappings/${id}`,
          { headers: this.getHeaders() }
        )

        await Swal.fire({
          icon: 'success',
          title: 'Terhapus',
          timer: 1500,
          showConfirmButton: false
        })

        this.fetchAll()

      } catch (e) {
        console.log(e)

        Swal.fire({
          icon: 'error',
          title: 'Gagal hapus'
        })
      }
    },

    // ================= RESET =================
    resetForm() {
      this.form = {
        id: null,
        prefix_code: '',
        logistics_provider: '',
        platform: '',
        product_id: '',
        qty_default: 1
      }

      this.searchProduct = ''
      this.showProduct = false
    }
  }
}
</script>

<style>
/* INPUT & SELECT BASE */
.input-modern {
  width: 100%;
  border: 1px solid #e5e7eb;
  padding: 10px 16px 10px 12px; /* 🔥 kasih space kanan untuk arrow */
  border-radius: 10px;
  font-size: 14px;
  transition: 0.2s;
  background-color: white;
}

/* FOCUS */
.input-modern:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
}

/* 🔥 KHUSUS SELECT (hilangkan arrow default & custom arrow) */
select.input-modern {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml;utf8,<svg fill='%236b7280' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center; /* 🔥 jarak dari kanan */
  background-size: 16px;
}

/* BUTTON PRIMARY */
.btn-primary {
  background: linear-gradient(to right, #2563eb, #3b82f6);
  color: white;
  padding: 10px;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* BUTTON EDIT */
.btn-edit {
  background: #e0f2fe;
  color: #0284c7;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
}

/* BUTTON DELETE */
.btn-delete {
  background: #fee2e2;
  color: #dc2626;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
}

.skeleton {
  display: block;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.dropdown-menu {
  position: absolute;
  z-index: 50;
  margin-top: 6px;
  width: 100%;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  max-height: 260px;
  overflow: auto;
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
}

.dropdown-search {
  width: 100%;
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  outline: none;
  font-size: 13px;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-empty {
  padding: 10px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
}

@media (max-width: 640px) {
  .input-modern {
    font-size: 13px;
    padding: 10px 12px;
  }
}

@media (max-width: 640px) {
  .btn-edit,
  .btn-delete {
    font-size: 11px;
    padding: 4px 8px;
  }
}
</style>