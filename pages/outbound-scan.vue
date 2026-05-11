  <template>
    <div class="w-full px-4 pb-20 md:pb-0">

      <!-- HEADER -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg md:text-2xl font-bold">Scan Outbound</h2>

        <NuxtLink
          to="/outbound-history"
          class="flex items-center gap-2 bg-white border border-gray-200 px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <span class="material-symbols-outlined text-base">
            history
          </span>
          Riwayat Outbound
        </NuxtLink>
      </div>

      <div class="grid md:grid-cols-2 gap-6 items-start">

        <!-- ================= LEFT : SCAN ================= -->
        <div class="bg-white p-6 rounded-xl border shadow-sm">

          <form @submit.prevent="scan">

            <label class="text-sm text-gray-600 mb-1 block">
              Scan / Input Resi
            </label>

            <input
              ref="inputRef"
              v-model="waybill"
              placeholder="Scan Resi..."
              class="w-full border p-3 md:p-4 text-base md:text-xl mb-4 rounded-lg font-mono uppercase"
            />

            <button class="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg text-sm md:text-base">
              Proses
            </button>

          </form>

          <!-- MESSAGE -->
          <div
            v-if="message"
            :class="[
              'mt-4 p-3 rounded-lg text-xs md:text-sm flex items-center gap-2',
              success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            ]"
          >
            <!-- ICON -->
            <span class="material-symbols-outlined text-base leading-none">
              {{ success ? 'check_circle' : 'error' }}
            </span>

            <!-- TEXT -->
            <span>{{ message }}</span>
          </div>

        </div>

        <!-- ================= RIGHT : RESULT ================= -->
        <div class="bg-white p-6 rounded-xl border shadow-sm">

          <div v-if="!result" class="text-gray-400 text-sm text-center">
            Belum ada hasil scan
          </div>

          <div v-else>

            <!-- HEADER -->
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="font-bold text-base md:text-lg">
                  {{ result.order_number }}
                </div>

                <div class="text-xs md:text-sm text-gray-500">
                  {{ result.customer_name }}
                </div>

                <div class="text-[10px] md:text-xs text-gray-400">
                  {{ result.platform }} • {{ result.courier }}
                </div>
              </div>

              <span
                :class="[
                  'flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold shadow-sm leading-tight',
                  result.status === 'shipped'
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                ]"
              >
                <span class="material-symbols-outlined text-sm leading-none">
                  {{ result.status === 'shipped' ? 'check_circle' : 'schedule' }}
                </span>

                {{ result.status.toUpperCase() }}
              </span>

            </div>

            <!-- ITEMS -->
            <div class="space-y-2">
              <div
                v-for="item in result.items"
                :key="item.id"
                class="flex justify-between text-xs md:text-sm border-b pb-2"
              >
                <div>
                  <div class="font-semibold text-xs md:text-sm">
                    {{ item.product?.sku }}
                  </div>
                  <div class="text-[10px] md:text-xs text-gray-400 line-clamp-1">
                    {{ item.product?.name }}
                  </div>
                </div>

                <span class="text-red-500 font-bold text-xs md:text-sm">
                  -{{ item.quantity }}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  </template>

 <script setup>
import { ref, nextTick } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

const waybill = ref('')
const result = ref(null)
const message = ref('')
const success = ref(false)
const inputRef = ref(null)

// focus helper
const focusInput = async () => {
  await nextTick()
  inputRef.value?.focus()
}

// MAIN SCAN FUNCTION
const scan = async () => {
  if (!waybill.value) {
    message.value = 'Resi kosong'
    success.value = false
    return
  }

  try {
    message.value = ''

    // ✅ STEP 1: scan order
    await $api('/scan-order', {
      method: 'POST',
      body: {
        waybill_number: waybill.value
      }
    })

    // ✅ STEP 2: outbound
    const res = await $api('/transactions/scan-outbound', {
      method: 'POST',
      body: {
        waybill_number: waybill.value
      }
    })

    result.value = res.order

    message.value = 'Scan berhasil (Order + Outbound)'
    success.value = true

  } catch (e) {
    console.log('❌ SCAN ERROR:', e)

    result.value = e?.data?.order || null
    message.value = e?.data?.message || 'Gagal scan'
    success.value = false
  }

  waybill.value = ''
  setTimeout(focusInput, 100)
}

// autofocus awal
focusInput()
</script>

  <style scoped>
  input {
    outline: none;
  }
  </style>