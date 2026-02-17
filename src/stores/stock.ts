import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Stock, StockSearchParams } from '@/types'
import { apiService } from '@/services/api'

export const useStockStore = defineStore('stock', () => {
  // State
  const stocks = ref<Stock[]>([])
  const currentStock = ref<Stock | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchParams = ref<StockSearchParams>({
    limit: 20,
    offset: 0,
    sort_by: 'symbol',
    sort_direction: 'asc',
  })
  const totalItems = ref(0)
  const totalPages = ref(0)

  // Getters
  const hasStocks = computed(() => stocks.value.length > 0)
  const currentPage = computed(() => 
    Math.floor((searchParams.value.offset || 0) / (searchParams.value.limit || 20)) + 1
  )

  // Actions
  async function searchStocks(params?: StockSearchParams) {
    loading.value = true
    error.value = null
    
    try {
      if (params) {
        searchParams.value = { ...searchParams.value, ...params }
      }
      
      const response = await apiService.searchStocks(searchParams.value)
      stocks.value = response.stocks
      
      if (response.meta) {
        totalItems.value = response.meta.total_items
        totalPages.value = response.meta.total_pages
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to search stocks'
      stocks.value = []
    } finally {
      loading.value = false
    }
  }

  async function getStock(symbol: string) {
    loading.value = true
    error.value = null
    
    try {
      currentStock.value = await apiService.getStock(symbol)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch stock'
      currentStock.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchStocks(symbols: string[]) {
    loading.value = true
    error.value = null
    
    try {
      await apiService.fetchStocks(symbols, true)
      // Refresh the list
      await searchStocks()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch stocks'
    } finally {
      loading.value = false
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      searchParams.value.offset = (searchParams.value.offset || 0) + (searchParams.value.limit || 20)
      searchStocks()
    }
  }

  function previousPage() {
    if (currentPage.value > 1) {
      searchParams.value.offset = Math.max(0, (searchParams.value.offset || 0) - (searchParams.value.limit || 20))
      searchStocks()
    }
  }

  function setPage(page: number) {
    searchParams.value.offset = (page - 1) * (searchParams.value.limit || 20)
    searchStocks()
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    stocks,
    currentStock,
    loading,
    error,
    searchParams,
    totalItems,
    totalPages,
    // Getters
    hasStocks,
    currentPage,
    // Actions
    searchStocks,
    getStock,
    fetchStocks,
    nextPage,
    previousPage,
    setPage,
    clearError,
  }
})
