<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="flex flex-col items-center gap-3">
      <div
        class="animate-spin rounded-full border-2 border-slate-200"
        :class="[sizeClass, `border-t-indigo-600`]"
      />
      <p v-if="message" class="text-sm text-slate-500">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullPage?: boolean
}>()

const sizeClass = computed(() => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return sizes[props.size || 'md']
})

const containerClass = computed(() => props.fullPage ? 'min-h-96' : '')
</script>
