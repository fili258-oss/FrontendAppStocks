<template>
  <span :class="badgeClass">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RecommendationType } from '@/types'
import { getRecommendationBadgeClass, getRecommendationLabel } from '@/utils/formatters'

const props = defineProps<{
  type: RecommendationType
}>()

const badgeClass = computed(() => getRecommendationBadgeClass(props.type))
const label = computed(() => getRecommendationLabel(props.type))
</script>
