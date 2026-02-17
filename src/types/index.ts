// Types para Stock Analyzer Frontend

export interface Stock {
  id: string
  symbol: string
  name: string
  exchange: string
  price: number
  change: number
  change_percent: number
  volume: number
  market_cap: number
  pe_ratio: number
  dividend_yield: number
  week_52_high: number
  week_52_low: number
  created_at: string
  updated_at: string
}

export interface Recommendation {
  id: string
  stock_id: string
  stock_symbol: string
  type: RecommendationType
  score: number
  confidence: number
  reason: string
  metrics: Record<string, number>
  strategy: StrategyType
  valid_until: string
  created_at: string
  updated_at: string
}

export type RecommendationType = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL'

export type StrategyType = 'BALANCED' | 'MOMENTUM' | 'VALUE' | 'DIVIDEND' | 'GROWTH'

export interface StockSearchParams {
  query?: string
  exchange?: string
  min_price?: number
  max_price?: number
  min_volume?: number
  min_market_cap?: number
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: string
  }
  meta?: {
    page: number
    page_size: number
    total_items: number
    total_pages: number
  }
}

export interface RecommendationStats {
  total: number
  by_type: {
    STRONG_BUY: number
    BUY: number
    HOLD: number
    SELL: number
  }
}

export interface GenerateRecommendationsRequest {
  symbols?: string[]
  strategies?: StrategyType[]
  save_to_db: boolean
}

export interface GenerateRecommendationsResponse {
  recommendations: Recommendation[]
  generated: number
  failed: number
  errors: string[]
}
