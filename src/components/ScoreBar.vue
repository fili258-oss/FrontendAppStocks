<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="barColor"
        :style="{ width: `${score}%` }"
      />
    </div>
    <span class="text-xs font-mono font-medium w-10 text-right" :class="scoreColor">
      {{ score.toFixed(1) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getScoreBarColor, getScoreColor } from '@/utils/formatters'

const props = defineProps<{ score: number }>()

const barColor = computed(() => getScoreBarColor(props.score))
const scoreColor = computed(() => getScoreColor(props.score))
</script>
