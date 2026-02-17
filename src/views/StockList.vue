<template>
  <div class="space-y-5">
    <!-- Search & Filters Bar -->
    <div class="card p-4">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative flex-1 min-w-52">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search by symbol or name..."
            class="input pl-9"
          />
        </div>

        <!-- Exchange Filter -->
        <select v-model="exchange" @change="handleSearch" class="select w-36">
          <option value="">All Exchanges</option>
          <option value="NASDAQ">NASDAQ</option>
          <option value="NYSE">NYSE</option>
        </select>

        <!-- Sort -->
        <select v-model="sortBy" @change="handleSearch" class="select w-40">
          <option value="symbol">Sort: Symbol</option>
          <option value="price">Sort: Price</option>
          <option value="change_percent">Sort: Change</option>
          <option value="market_cap">Sort: Market Cap</option>
          <option value="volume">Sort: Volume</option>
        </select>

        <button
          @click="toggleSortDirection"
          class="btn-secondary px-3"
          :title="sortDirection === 'asc' ? 'Ascending' : 'Descending'"
        >
          <ArrowsUpDownIcon class="w-4 h-4" />
        </button>

        <!-- Fetch New Stock -->
        <div class="flex items-center gap-2 ml-auto">
          <input
            v-model="newSymbol"
            type="text"
            placeholder="TSLA"
            class="input w-24 uppercase"
            @keyup.enter="handleFetchStock"
          />
          <button
            @click="handleFetchStock"
            :disabled="!newSymbol || stockStore.loading"
            class="btn-primary whitespace-nowrap"
          >
            <PlusIcon class="w-4 h-4" />
            Add Stock
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <LoadingSpinner v-if="stockStore.loading" message="Loading stocks..." class="py-16" />

      <div v-else-if="stockStore.stocks.length === 0" class="py-20 text-center">
        <TableCellsIcon class="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <p class="text-slate-500 font-medium">No stocks found</p>
        <p class="text-sm text-slate-400 mt-1">Try adjusting your search or add new stocks</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                @click="col.sortable ? handleSort(col.key) : null"
                class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                :class="col.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''"
              >
                <div class="flex items-center gap-1">
                  {{ col.label }}
                  <span v-if="col.sortable && sortBy === col.key" class="text-indigo-500">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="stock in stockStore.stocks"
              :key="stock.id"
              class="hover:bg-slate-50 transition-colors group"
            >
              <td class="px-5 py-3.5">
                <RouterLink
                  :to="`/stocks/${stock.symbol}`"
                  class="font-mono font-bold text-indigo-600 hover:text-indigo-800 group-hover:underline"
                >
                  {{ stock.symbol }}
                </RouterLink>
              </td>
              <td class="px-5 py-3.5 text-slate-700 max-w-48 truncate">{{ stock.name }}</td>
              <td class="px-5 py-3.5 font-mono font-semibold">{{ formatPrice(stock.price) }}</td>
              <td class="px-5 py-3.5">
                <span class="font-mono text-sm font-medium" :class="getChangeClass(stock.change_percent)">
                  {{ formatPercent(stock.change_percent) }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-slate-600 font-mono text-xs">{{ formatLargeNumber(stock.market_cap) }}</td>
              <td class="px-5 py-3.5 text-slate-600 font-mono text-xs">{{ formatVolume(stock.volume) }}</td>
              <td class="px-5 py-3.5 text-slate-500 font-mono text-xs">
                {{ stock.pe_ratio > 0 ? stock.pe_ratio.toFixed(1) : '—' }}
              </td>
              <td class="px-5 py-3.5 text-slate-500 font-mono text-xs">
                {{ stock.dividend_yield > 0 ? `${stock.dividend_yield.toFixed(2)}%` : '—' }}
              </td>
              <td class="px-5 py-3.5">
                <RouterLink
                  :to="`/stocks/${stock.symbol}`"
                  class="btn-ghost text-xs px-2 py-1 opacity-0 group-hover:opacity-100"
                >
                  Detail →
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="stockStore.totalPages > 1"
        class="flex items-center justify-between px-5 py-3 border-t border-slate-100"
      >
        <p class="text-xs text-slate-500">
          Page {{ stockStore.currentPage }} of {{ stockStore.totalPages }}
          <span class="ml-2 text-slate-400">({{ stockStore.totalItems }} total)</span>
        </p>
        <div class="flex items-center gap-1">
          <button
            @click="stockStore.previousPage()"
            :disabled="stockStore.currentPage === 1"
            class="btn-secondary px-3 py-1.5 text-xs"
          >
            ← Previous
          </button>
          <button
            v-for="page in paginationPages"
            :key="page"
            @click="typeof page === 'number' ? stockStore.setPage(page) : null"
            class="px-3 py-1.5 text-xs rounded-lg transition-colors"
            :class="page === stockStore.currentPage
              ? 'bg-indigo-600 text-white'
              : page === '...' ? 'text-slate-400 cursor-default' : 'btn-secondary'"
          >
            {{ page }}
          </button>
          <button
            @click="stockStore.nextPage()"
            :disabled="stockStore.currentPage === stockStore.totalPages"
            class="btn-secondary px-3 py-1.5 text-xs"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  PlusIcon,
  TableCellsIcon,
} from '@heroicons/vue/24/outline'
import { useStockStore } from '@/stores/stock'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import {
  formatPrice,
  formatPercent,
  formatLargeNumber,
  formatVolume,
  getChangeClass,
} from '@/utils/formatters'

const stockStore = useStockStore()

const searchQuery = ref('')
const exchange = ref('')
const sortBy = ref('symbol')
const sortDirection = ref<'asc' | 'desc'>('asc')
const newSymbol = ref('')

let searchTimeout: ReturnType<typeof setTimeout>

const columns = [
  { key: 'symbol', label: 'Symbol', sortable: true },
  { key: 'name', label: 'Name', sortable: false },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'change_percent', label: 'Change', sortable: true },
  { key: 'market_cap', label: 'Market Cap', sortable: true },
  { key: 'volume', label: 'Volume', sortable: true },
  { key: 'pe_ratio', label: 'P/E', sortable: true },
  { key: 'dividend_yield', label: 'Dividend', sortable: true },
  { key: 'actions', label: '', sortable: false },
]

function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    stockStore.searchStocks({
      query: searchQuery.value || undefined,
      exchange: exchange.value || undefined,
      sort_by: sortBy.value,
      sort_direction: sortDirection.value,
      offset: 0,
    })
  }, 300)
}

function handleSort(key: string) {
  if (sortBy.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortDirection.value = 'asc'
  }
  handleSearch()
}

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  handleSearch()
}

async function handleFetchStock() {
  if (!newSymbol.value.trim()) return
  const symbol = newSymbol.value.trim().toUpperCase()
  await stockStore.fetchStocks([symbol])
  newSymbol.value = ''
}

const paginationPages = computed(() => {
  const total = stockStore.totalPages
  const current = stockStore.currentPage
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)

  return pages
})

onMounted(() => {
  stockStore.searchStocks({ limit: 20 })
})
</script>
