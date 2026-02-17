<template>
  <div class="space-y-5">
    <!-- Controls Bar -->
    <div class="card p-4">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Type Filter -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            v-for="type in typeFilters"
            :key="type.value"
            @click="activeType = type.value; loadRecommendations()"
            class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            :class="activeType === type.value
              ? 'bg-white shadow text-slate-900'
              : 'text-slate-500 hover:text-slate-700'"
          >
            {{ type.label }}
          </button>
        </div>

        <!-- Strategy Filter -->
        <select v-model="activeStrategy" @change="loadRecommendations" class="select w-40">
          <option value="">All Strategies</option>
          <option v-for="s in strategies" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>

        <!-- Limit -->
        <select v-model="limit" @change="loadRecommendations" class="select w-28">
          <option :value="10">Show 10</option>
          <option :value="20">Show 20</option>
          <option :value="50">Show 50</option>
        </select>

        <!-- Generate Button -->
        <div class="ml-auto flex items-center gap-2">
          <select v-model="generateStrategy" class="select w-40">
            <option value="">All Strategies</option>
            <option v-for="s in strategies" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <button
            @click="handleGenerate"
            :disabled="recStore.loading"
            class="btn-primary"
          >
            <SparklesIcon class="w-4 h-4" />
            {{ recStore.loading ? 'Generating...' : 'Generate' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="recStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
      {{ recStore.error }}
    </div>

    <!-- Stats Row -->
    <div v-if="recStore.stats" class="grid grid-cols-4 gap-3">
      <div
        v-for="item in statsRow"
        :key="item.type"
        @click="activeType = item.type; loadRecommendations()"
        class="card p-4 cursor-pointer hover:border-indigo-200 transition-colors"
        :class="activeType === item.type ? 'border-indigo-400 bg-indigo-50' : ''"
      >
        <div class="flex justify-between items-start">
          <p class="text-xs text-slate-500">{{ item.label }}</p>
          <span class="badge text-xs" :class="item.badgeClass">{{ item.count }}</span>
        </div>
      </div>
    </div>

    <!-- Recommendations Grid -->
    <LoadingSpinner v-if="recStore.loading" message="Loading recommendations..." class="py-24" />

    <div v-else-if="filtered.length === 0" class="card p-16 text-center">
      <SparklesIcon class="w-12 h-12 text-slate-200 mx-auto mb-4" />
      <p class="text-slate-500 font-medium">No recommendations found</p>
      <p class="text-sm text-slate-400 mt-1">Try generating new recommendations</p>
      <button @click="handleGenerate" class="btn-primary mt-5">
        Generate Recommendations
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="rec in filtered"
        :key="rec.id"
        class="card p-5 hover:shadow-md transition-shadow"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <RouterLink
              :to="`/stocks/${rec.stock_symbol}`"
              class="font-mono font-bold text-xl text-indigo-600 hover:text-indigo-800"
            >
              {{ rec.stock_symbol }}
            </RouterLink>
            <p class="text-xs text-slate-500 mt-0.5">{{ getStrategyLabel(rec.strategy) }} Strategy</p>
          </div>
          <RecommendationBadge :type="rec.type" />
        </div>

        <!-- Score -->
        <div class="mb-4">
          <div class="flex justify-between text-xs mb-1.5">
            <span class="text-slate-500">Score</span>
            <span class="font-medium text-slate-700">{{ formatConfidence(rec.confidence) }} confidence</span>
          </div>
          <ScoreBar :score="rec.score" />
        </div>

        <!-- Reason -->
        <p class="text-xs text-slate-500 leading-relaxed line-clamp-3">{{ rec.reason }}</p>

        <!-- Footer -->
        <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <span class="text-xs text-slate-400">
            Valid until {{ formatDate(rec.valid_until) }}
          </span>
          <RouterLink
            :to="`/stocks/${rec.stock_symbol}`"
            class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View Stock →
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { SparklesIcon } from '@heroicons/vue/24/outline'
import { useRecommendationStore } from '@/stores/recommendation'
import RecommendationBadge from '@/components/RecommendationBadge.vue'
import ScoreBar from '@/components/ScoreBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { RecommendationType, StrategyType } from '@/types'
import {
  formatConfidence,
  getRecommendationLabel,
  getRecommendationBadgeClass,
  getStrategyLabel,
} from '@/utils/formatters'
import { format } from 'date-fns'

const recStore = useRecommendationStore()

const activeType = ref<RecommendationType | 'ALL'>('ALL')
const activeStrategy = ref<StrategyType | ''>('')
const limit = ref(20)
const generateStrategy = ref<StrategyType | ''>('')

const typeFilters = [
  { value: 'ALL' as const, label: 'All' },
  { value: 'STRONG_BUY' as const, label: 'Strong Buy' },
  { value: 'BUY' as const, label: 'Buy' },
  { value: 'HOLD' as const, label: 'Hold' },
  { value: 'SELL' as const, label: 'Sell' },
]

const strategies = [
  { value: 'BALANCED' as StrategyType, label: 'Balanced' },
  { value: 'MOMENTUM' as StrategyType, label: 'Momentum' },
  { value: 'VALUE' as StrategyType, label: 'Value' },
  { value: 'DIVIDEND' as StrategyType, label: 'Dividend' },
  { value: 'GROWTH' as StrategyType, label: 'Growth' },
]

const statsRow = computed(() => {
  const s = recStore.stats
  if (!s) return []
  return [
    { type: 'STRONG_BUY', label: 'Strong Buy', count: s.by_type.STRONG_BUY, badgeClass: 'badge-strong-buy' },
    { type: 'BUY', label: 'Buy', count: s.by_type.BUY, badgeClass: 'badge-buy' },
    { type: 'HOLD', label: 'Hold', count: s.by_type.HOLD, badgeClass: 'badge-hold' },
    { type: 'SELL', label: 'Sell', count: s.by_type.SELL, badgeClass: 'badge-sell' },
  ]
})

const filtered = computed(() => {
  let list = recStore.recommendations
  if (activeStrategy.value) {
    list = list.filter(r => r.strategy === activeStrategy.value)
  }
  return list
})

async function loadRecommendations() {
  if (activeType.value === 'ALL') {
    await recStore.getTopRecommendations(limit.value)
  } else {
    await recStore.getRecommendationsByType(activeType.value as RecommendationType, limit.value)
  }
  await recStore.getStats()
}

async function handleGenerate() {
  await recStore.generateRecommendations({
    strategies: generateStrategy.value ? [generateStrategy.value as StrategyType] : undefined,
    save_to_db: true,
  })
  await loadRecommendations()
}

const formatDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

onMounted(() => loadRecommendations())
</script>
