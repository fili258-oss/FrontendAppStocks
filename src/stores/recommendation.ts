import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Recommendation,
  RecommendationStats,
  GenerateRecommendationsRequest,
  StrategyType,
  RecommendationType,
} from '@/types'
import { apiService } from '@/services/api'

export const useRecommendationStore = defineStore('recommendation', () => {
  // State
  const recommendations = ref<Recommendation[]>([])
  const stockRecommendations = ref<Recommendation[]>([])
  const stats = ref<RecommendationStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasRecommendations = computed(() => recommendations.value.length > 0)
  
  const recommendationsByStrategy = computed(() => {
    const grouped: Record<StrategyType, Recommendation[]> = {
      BALANCED: [],
      MOMENTUM: [],
      VALUE: [],
      DIVIDEND: [],
      GROWTH: [],
    }
    
    stockRecommendations.value.forEach((rec) => {
      if (rec.strategy in grouped) {
        grouped[rec.strategy].push(rec)
      }
    })
    
    return grouped
  })

  const topStrongBuys = computed(() => 
    recommendations.value
      .filter(r => r.type === 'STRONG_BUY')
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  )

  // Actions
  async function getTopRecommendations(limit = 10) {
    loading.value = true
    error.value = null
    
    try {
      recommendations.value = await apiService.getTopRecommendations(limit)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch recommendations'
      recommendations.value = []
    } finally {
      loading.value = false
    }
  }

  async function getRecommendationsByStock(symbol: string) {
    loading.value = true
    error.value = null
    
    try {
      stockRecommendations.value = await apiService.getRecommendationsByStock(symbol)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch recommendations'
      stockRecommendations.value = []
    } finally {
      loading.value = false
    }
  }

  async function getRecommendationsByType(type: RecommendationType, limit = 20) {
    loading.value = true
    error.value = null
    
    try {
      recommendations.value = await apiService.getRecommendationsByType(type, limit)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch recommendations'
      recommendations.value = []
    } finally {
      loading.value = false
    }
  }

  async function generateRecommendations(request: GenerateRecommendationsRequest) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.generateRecommendations(request)
      
      if (response.failed > 0) {
        error.value = `Generated ${response.generated} recommendations, ${response.failed} failed`
      }
      
      // Refresh top recommendations
      await getTopRecommendations()
      
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to generate recommendations'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getStats() {
    loading.value = true
    error.value = null
    
    try {
      stats.value = await apiService.getRecommendationStats()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch stats'
      stats.value = null
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearStockRecommendations() {
    stockRecommendations.value = []
  }

  return {
    // State
    recommendations,
    stockRecommendations,
    stats,
    loading,
    error,
    // Getters
    hasRecommendations,
    recommendationsByStrategy,
    topStrongBuys,
    // Actions
    getTopRecommendations,
    getRecommendationsByStock,
    getRecommendationsByType,
    generateRecommendations,
    getStats,
    clearError,
    clearStockRecommendations,
  }
})
