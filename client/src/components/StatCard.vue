<!-- src/components/StatCard.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center justify-between">
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</h3>
    </div>
    <div class="text-3xl">{{ icon }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String
})
</script>