// src/utils/formatters.ts

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export const formatPercent = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export const formatLargeNumber = (num: number) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return formatPrice(num)
}

export const getRecommendationColor = (type: RecommendationType) => {
  const colors = {
    STRONG_BUY: 'text-green-600 bg-green-50',
    BUY: 'text-green-500 bg-green-50',
    HOLD: 'text-yellow-600 bg-yellow-50',
    SELL: 'text-red-600 bg-red-50',
  }
  return colors[type]
}