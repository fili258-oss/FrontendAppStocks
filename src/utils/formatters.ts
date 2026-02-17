import type { RecommendationType, StrategyType } from '@/types'

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return formatPrice(num)
}

export const formatVolume = (volume: number): string => {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
  return volume.toString()
}

export const formatScore = (score: number): string => {
  return score.toFixed(1)
}

export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(0)}%`
}

export const getRecommendationBadgeClass = (type: RecommendationType): string => {
  const classes: Record<RecommendationType, string> = {
    STRONG_BUY: 'badge-strong-buy',
    BUY: 'badge-buy',
    HOLD: 'badge-hold',
    SELL: 'badge-sell',
  }
  return classes[type]
}

export const getRecommendationLabel = (type: RecommendationType): string => {
  const labels: Record<RecommendationType, string> = {
    STRONG_BUY: 'Strong Buy',
    BUY: 'Buy',
    HOLD: 'Hold',
    SELL: 'Sell',
  }
  return labels[type]
}

export const getStrategyLabel = (strategy: StrategyType): string => {
  const labels: Record<StrategyType, string> = {
    BALANCED: 'Balanced',
    MOMENTUM: 'Momentum',
    VALUE: 'Value',
    DIVIDEND: 'Dividend',
    GROWTH: 'Growth',
  }
  return labels[strategy]
}

export const getStrategyDescription = (strategy: StrategyType): string => {
  const descriptions: Record<StrategyType, string> = {
    BALANCED: 'Equilibrium between risk and return',
    MOMENTUM: 'Based on price trends',
    VALUE: 'Undervalued companies with strong fundamentals',
    DIVIDEND: 'Focus on passive income',
    GROWTH: 'High growth potential',
  }
  return descriptions[strategy]
}

export const getChangeClass = (value: number): string => {
  if (value > 0) return 'text-emerald-600'
  if (value < 0) return 'text-red-600'
  return 'text-slate-500'
}

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-green-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-red-600'
}

export const getScoreBarColor = (score: number): string => {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-green-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-red-500'
}
