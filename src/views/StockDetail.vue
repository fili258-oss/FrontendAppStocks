<template>
  <div class="space-y-5">
    <!-- Back Button -->
    <RouterLink to="/stocks" class="btn-ghost inline-flex text-sm">
      ← Back to Stocks
    </RouterLink>

    <LoadingSpinner v-if="stockStore.loading" message="Loading stock details..." class="py-24" />

    <div v-else-if="!stockStore.currentStock" class="card p-12 text-center">
      <p class="text-slate-500">Stock not found: {{ symbol }}</p>
      <RouterLink to="/stocks" class="btn-primary mt-4">Browse Stocks</RouterLink>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="card p-6">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-3xl font-bold font-mono text-slate-900">{{ stock.symbol }}</h1>
              <span class="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-medium">
                {{ stock.exchange }}
              </span>
            </div>
            <p class="text-slate-500 text-lg">{{ stock.name }}</p>
          </div>

          <div class="text-right">
            <p class="text-3xl font-bold font-mono text-slate-900">
              {{ formatPrice(stock.price) }}
            </p>
            <p class="text-lg font-mono font-semibold mt-1" :class="getChangeClass(stock.change_percent)">
              {{ formatPercent(stock.change_percent) }}
            </p>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div v-for="metric in metrics" :key="metric.label">
            <p class="text-xs text-slate-500">{{ metric.label }}</p>
            <p class="font-semibold font-mono text-slate-900 mt-0.5">{{ metric.value }}</p>
          </div>
        </div>
      </div>

      <!-- 52-Week Range -->
      <div class="card p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-4">52-Week Range</h3>
        <div class="flex items-center gap-3">
          <span class="text-xs font-mono text-slate-500">{{ formatPrice(stock.week_52_low) }}</span>
          <div class="flex-1 h-2 bg-slate-100 rounded-full relative">
            <div
              class="h-full bg-indigo-200 rounded-full"
              :style="{ width: `${rangePercent}%` }"
            />
            <div
              class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow"
              :style="{ left: `calc(${rangePercent}% - 6px)` }"
            />
          </div>
          <span class="text-xs font-mono text-slate-500">{{ formatPrice(stock.week_52_high) }}</span>
        </div>
        <p class="text-xs text-slate-400 text-center mt-2">
          Current: {{ formatPrice(stock.price) }}
        </p>
      </div>

      <!-- Recommendations -->
      <div class="card">
        <div class="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 class="font-semibold text-slate-900">Strategy Analysis</h2>
            <p class="text-xs text-slate-500 mt-0.5">Performance across all 5 strategies</p>
          </div>
          <button
            @click="handleGenerate"
            :disabled="recStore.loading"
            class="btn-primary text-xs"
          >
            <SparklesIcon class="w-3.5 h-3.5" />
            {{ recStore.loading ? 'Generating...' : 'Generate' }}
          </button>
        </div>

        <LoadingSpinner v-if="recStore.loading" message="Analyzing strategies..." />

        <div v-else-if="recStore.stockRecommendations.length === 0" class="p-12 text-center">
          <SparklesIcon class="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p class="text-sm text-slate-500">No analysis yet for {{ symbol }}</p>
          <button @click="handleGenerate" class="btn-primary mt-4 text-xs">
            Run Analysis
          </button>
        </div>

        <div v-else class="divide-y divide-slate-50">
          <div
            v-for="rec in recStore.stockRecommendations"
            :key="rec.id"
            class="p-5"
          >
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-slate-700 w-20">
                  {{ getStrategyLabel(rec.strategy) }}
                </span>
                <RecommendationBadge :type="rec.type" />
              </div>
              <div class="text-right flex-shrink-0">
                <span class="text-xs text-slate-500">
                  Confidence {{ formatConfidence(rec.confidence) }}
                </span>
              </div>
            </div>

            <div class="mb-3">
              <ScoreBar :score="rec.score" />
            </div>

            <p class="text-xs text-slate-500 leading-relaxed">{{ rec.reason }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { SparklesIcon } from '@heroicons/vue/24/outline'
import { useStockStore } from '@/stores/stock'
import { useRecommendationStore } from '@/stores/recommendation'
import RecommendationBadge from '@/components/RecommendationBadge.vue'
import ScoreBar from '@/components/ScoreBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import {
  formatPrice,
  formatPercent,
  formatLargeNumber,
  formatVolume,
  formatConfidence,
  getChangeClass,
  getStrategyLabel,
} from '@/utils/formatters'

const props = defineProps<{ symbol: string }>()

const stockStore = useStockStore()
const recStore = useRecommendationStore()

const stock = computed(() => stockStore.currentStock!)

const rangePercent = computed(() => {
  if (!stock.value) return 0
  const { price, week_52_low, week_52_high } = stock.value
  if (week_52_high === week_52_low) return 50
  return ((price - week_52_low) / (week_52_high - week_52_low)) * 100
})

const metrics = computed(() => {
  if (!stock.value) return []
  return [
    { label: 'Market Cap', value: formatLargeNumber(stock.value.market_cap) },
    { label: 'Volume', value: formatVolume(stock.value.volume) },
    { label: 'P/E Ratio', value: stock.value.pe_ratio > 0 ? stock.value.pe_ratio.toFixed(2) : '—' },
    { label: 'Dividend Yield', value: stock.value.dividend_yield > 0 ? `${stock.value.dividend_yield.toFixed(2)}%` : '—' },
  ]
})

async function handleGenerate() {
  await recStore.generateRecommendations({
    symbols: [props.symbol],
    save_to_db: true,
  })
  await recStore.getRecommendationsByStock(props.symbol)
}

async function loadData(symbol: string) {
  await stockStore.getStock(symbol)
  await recStore.getRecommendationsByStock(symbol)
}

watch(() => props.symbol, (sym) => loadData(sym))
onMounted(() => loadData(props.symbol))
</script>
