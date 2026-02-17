<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Sidebar Navigation -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-slate-900 flex flex-col z-50">
      <!-- Logo -->
      <div class="px-6 py-5 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p class="text-white font-semibold text-sm">Stock Analyzer</p>
            <p class="text-slate-400 text-xs">Investment Intelligence</p>
          </div>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-indigo-600 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          {{ item.name }}
        </RouterLink>
      </nav>

      <!-- Footer -->
      <div class="px-4 py-4 border-t border-slate-800">
        <div class="flex items-center gap-3 px-3 py-2">
          <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span class="text-slate-400 text-xs">API Connected</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="pl-64">
      <!-- Top Bar -->
      <header class="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-lg font-semibold text-slate-900">{{ pageTitle }}</h1>
            <p class="text-sm text-slate-500">{{ pageSubtitle }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400">{{ currentDate }}</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  HomeIcon,
  ChartBarIcon,
  SparklesIcon,
  TableCellsIcon,
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'

const route = useRoute()

const navItems = [
  { name: 'Dashboard', to: '/', icon: HomeIcon },
  { name: 'Stocks', to: '/stocks', icon: TableCellsIcon },
  { name: 'Recommendations', to: '/recommendations', icon: SparklesIcon },
]

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Market overview and top picks' },
  stocks: { title: 'Stocks', subtitle: 'Browse and search all stocks' },
  'stock-detail': { title: 'Stock Detail', subtitle: 'Detailed analysis and recommendations' },
  recommendations: { title: 'Recommendations', subtitle: 'AI-powered investment recommendations' },
}

const pageTitle = computed(() => pageMeta[route.name as string]?.title || 'Stock Analyzer')
const pageSubtitle = computed(() => pageMeta[route.name as string]?.subtitle || '')
const currentDate = computed(() => format(new Date(), 'MMMM d, yyyy'))

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
