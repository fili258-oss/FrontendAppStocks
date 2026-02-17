import axios, { type AxiosInstance } from 'axios'
import type {
  Stock,
  Recommendation,
  StockSearchParams,
  ApiResponse,
  RecommendationStats,
  GenerateRecommendationsRequest,
  GenerateRecommendationsResponse,
  RecommendationType,
} from '@/types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Interceptor para logging
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  // ==========================================
  // STOCKS
  // ==========================================

  async getStock(symbol: string): Promise<Stock> {
    const { data } = await this.api.get<ApiResponse<Stock>>(`/stocks/${symbol}`)
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to fetch stock')
    }
    return data.data
  }

  async searchStocks(params: StockSearchParams = {}): Promise<{
    stocks: Stock[]
    meta: ApiResponse<Stock[]>['meta']
  }> {
    const { data } = await this.api.get<ApiResponse<Stock[]>>('/stocks', { params })
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to search stocks')
    }
    return {
      stocks: data.data,
      meta: data.meta,
    }
  }

  async fetchStocks(symbols: string[], save = true): Promise<Stock[]> {
    const { data } = await this.api.post<ApiResponse<{ stocks: Stock[] }>>('/stocks/fetch', {
      symbols,
      save,
    })
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to fetch stocks')
    }
    return data.data.stocks
  }

  async updateStocks(symbols: string[], force = false): Promise<void> {
    const { data } = await this.api.put('/stocks/update', {
      symbols,
      force,
    })
    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to update stocks')
    }
  }

  // ==========================================
  // RECOMMENDATIONS
  // ==========================================

  async generateRecommendations(
    request: GenerateRecommendationsRequest
  ): Promise<GenerateRecommendationsResponse> {
    const { data } = await this.api.post<ApiResponse<GenerateRecommendationsResponse>>(
      '/recommendations/generate',
      request
    )
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to generate recommendations')
    }
    return data.data
  }

  async getTopRecommendations(limit = 10): Promise<Recommendation[]> {
    const { data } = await this.api.get<ApiResponse<{ recommendations: Recommendation[] }>>(
      '/recommendations/top',
      { params: { limit } }
    )
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to fetch top recommendations')
    }
    return data.data.recommendations
  }

  async getRecommendationsByStock(symbol: string): Promise<Recommendation[]> {
    const { data } = await this.api.get<ApiResponse<{ recommendations: Recommendation[] }>>(
      `/recommendations/stock/${symbol}`
    )
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to fetch recommendations')
    }
    return data.data.recommendations
  }

  async getRecommendationsByType(
    type: RecommendationType,
    limit = 20
  ): Promise<Recommendation[]> {
    const { data } = await this.api.get<ApiResponse<{ recommendations: Recommendation[] }>>(
      `/recommendations/type/${type}`,
      { params: { limit } }
    )
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to fetch recommendations')
    }
    return data.data.recommendations
  }

  async getRecommendationStats(): Promise<RecommendationStats> {
    const { data } = await this.api.get<ApiResponse<RecommendationStats>>(
      '/recommendations/stats'
    )
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to fetch stats')
    }
    return data.data
  }

  async getValidRecommendations(limit = 50): Promise<Recommendation[]> {
    const { data } = await this.api.get<ApiResponse<{ recommendations: Recommendation[] }>>(
      '/recommendations/valid',
      { params: { limit } }
    )
    if (!data.success || !data.data) {
      throw new Error(data.error?.message || 'Failed to fetch valid recommendations')
    }
    return data.data.recommendations
  }
}

export const apiService = new ApiService()
