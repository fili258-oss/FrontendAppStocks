<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div class="flex flex-col gap-2 p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4 ...">
    <img class="mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0" src="/src/assets/erin-lindford.jpg" alt="" />
    <div class="space-y-2 text-center sm:text-left">
      <div class="space-y-0.5">
        <p class="text-lg font-semibold text-black">Erin Lindford</p>
        <p class="font-medium text-gray-500">Product Engineer</p>
      </div>
      <button class="border-purple-200 text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700 ...">
        Message
      </button>
    </div>
  </div>
  <h1>{{ msg }}</h1>

  <h1 class="bg-warning-500 rounded-xs">
      Hello world!
  </h1>
  <h1 class="bg-danger-500">
      Hello world!
  </h1>
  <h1 class="bg-success-500">
      Hello world!
  </h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  <button class="bg-sky-500 hover:bg-sky-700 ...">Save changes</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
