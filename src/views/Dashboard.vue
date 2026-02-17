<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="card p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-slate-500">{{ stat.label }}</p>
            <p class="text-2xl font-bold mt-1" :class="stat.color">{{ stat.value }}</p>
          </div>
          <div class="p-2 rounded-lg" :class="stat.bgColor">
            <component :is="stat.icon" class="w-5 h-5" :class="stat.color" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Recommendations Table -->
      <div class="lg:col-span-2 card">
        <div class="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 class="font-semibold text-slate-900">Top Recommendations</h2>
            <p class="text-xs text-slate-500 mt-0.5">Highest scoring picks</p>
          </div>
          <RouterLink to="/recommendations" class="btn-secondary text-xs">
            View all
          </RouterLink>
        </div>

        <LoadingSpinner v-if="recStore.loading" message="Loading recommendations..." />

        <div v-else-if="recStore.recommendations.length === 0" class="p-12 text-center">
          <SparklesIcon class="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p class="text-sm text-slate-500">No recommendations yet.</p>
          <button @click="handleGenerateAll" class="btn-primary mt-4 text-xs">
            Generate Now
          </button>
        </div>

        <div v-else class="divide-y divide-slate-50">
          <div
            v-for="(rec, i) in recStore.recommendations.slice(0, 8)"
            :key="rec.id"
            class="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
          >
            <span class="w-5 text-xs text-slate-400 font-mono">{{ i + 1 }}</span>
            <RouterLink
              :to="`/stocks/${rec.stock_symbol}`"
              class="w-16 font-mono font-semibold text-sm text-indigo-600 hover:text-indigo-800"
            >
              {{ rec.stock_symbol }}
            </RouterLink>
            <RecommendationBadge :type="rec.type" />
            <div class="flex-1">
              <ScoreBar :score="rec.score" />
            </div>
            <span class="text-xs text-slate-400 w-20 text-right">{{ rec.strategy }}</span>
          </div>
        </div>
      </div>

      <!-- Distribution Chart -->
      <div class="card p-5">
        <h2 class="font-semibold text-slate-900 mb-1">Distribution</h2>
        <p class="text-xs text-slate-500 mb-5">By recommendation type</p>

        <LoadingSpinner v-if="recStore.loading" />

        <div v-else-if="recStore.stats" class="space-y-4">
          <div
            v-for="item in distributionItems"
            :key="item.type"
            class="flex items-center gap-3"
          >
            <div class="w-3 h-3 rounded-sm flex-shrink-0" :class="item.dotColor" />
            <div class="flex-1">
              <div class="flex justify-between text-sm mb-1">
                <span class="font-medium text-slate-700">{{ item.label }}</span>
                <span class="text-slate-500">{{ item.count }}</span>
              </div>
              <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :class="item.barColor"
                  :style="{ width: item.total > 0 ? `${(item.count / item.total) * 100}%` : '0%' }"
                />
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 text-center">
            <p class="text-2xl font-bold text-slate-900">{{ recStore.stats.total }}</p>
            <p class="text-xs text-slate-500">Total recommendations</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stocks Preview -->
    <div class="card">
      <div class="flex items-center justify-between p-5 border-b border-slate-100">
        <div>
          <h2 class="font-semibold text-slate-900">Recent Stocks</h2>
          <p class="text-xs text-slate-500 mt-0.5">Latest in database</p>
        </div>
        <RouterLink to="/stocks" class="btn-secondary text-xs">
          Browse all
        </RouterLink>
      </div>

      <LoadingSpinner v-if="stockStore.loading" message="Loading stocks..." />

      <div v-else-if="stockStore.stocks.length === 0" class="p-12 text-center">
        <TableCellsIcon class="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p class="text-sm text-slate-500">No stocks in database yet.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100">
              <th
                v-for="col in tableColumns"
                :key="col"
                class="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide"
              >
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="stock in stockStore.stocks.slice(0, 5)"
              :key="stock.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-5 py-3">
                <RouterLink
                  :to="`/stocks/${stock.symbol}`"
                  class="font-mono font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  {{ stock.symbol }}
                </RouterLink>
              </td>
              <td class="px-5 py-3 text-slate-600">{{ stock.name }}</td>
              <td class="px-5 py-3 font-mono font-medium">{{ formatPrice(stock.price) }}</td>
              <td class="px-5 py-3">
                <span class="font-mono text-sm" :class="getChangeClass(stock.change_percent)">
                  {{ formatPercent(stock.change_percent) }}
                </span>
              </td>
              <td class="px-5 py-3 text-slate-500">{{ formatLargeNumber(stock.market_cap) }}</td>
              <td class="px-5 py-3 text-slate-500">{{ formatVolume(stock.volume) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  SparklesIcon,
  TableCellsIcon,
  ArrowTrendingUpIcon,
  MinusSmallIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'
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
  getChangeClass,
} from '@/utils/formatters'

const stockStore = useStockStore()
const recStore = useRecommendationStore()

const tableColumns = ['Symbol', 'Name', 'Price', 'Change', 'Market Cap', 'Volume']

const stats = computed(() => {
  const s = recStore.stats
  return [
    {
      label: 'Total Stocks',
      value: stockStore.totalItems,
      icon: TableCellsIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: 'Strong Buy',
      value: s?.by_type.STRONG_BUY ?? 0,
      icon: ArrowTrendingUpIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Hold',
      value: s?.by_type.HOLD ?? 0,
      icon: MinusSmallIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Sell',
      value: s?.by_type.SELL ?? 0,
      icon: ArrowTrendingDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]
})

const distributionItems = computed(() => {
  const s = recStore.stats
  if (!s) return []
  const total = s.total
  return [
    { type: 'STRONG_BUY', label: 'Strong Buy', count: s.by_type.STRONG_BUY, dotColor: 'bg-emerald-500', barColor: 'bg-emerald-500', total },
    { type: 'BUY', label: 'Buy', count: s.by_type.BUY, dotColor: 'bg-green-500', barColor: 'bg-green-500', total },
    { type: 'HOLD', label: 'Hold', count: s.by_type.HOLD, dotColor: 'bg-amber-500', barColor: 'bg-amber-500', total },
    { type: 'SELL', label: 'Sell', count: s.by_type.SELL, dotColor: 'bg-red-500', barColor: 'bg-red-500', total },
  ]
})

async function handleGenerateAll() {
  await recStore.generateRecommendations({ save_to_db: true })
}

onMounted(async () => {
  await Promise.all([
    stockStore.searchStocks({ limit: 10 }),
    recStore.getTopRecommendations(10),
    recStore.getStats(),
  ])
})
</script>
