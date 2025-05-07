<!-- src/components/Button.vue -->
<template>
  <button
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors duration-200',
      {
        'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
        'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600': variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-700': variant === 'danger'
      }
    ]"
    v-bind="$attrs"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: String,
  variant: {
    type: String,
    default: 'primary', // primary | secondary | danger
    validator: value => ['primary', 'secondary', 'danger'].includes(value)
  }
})
</script>