<!-- src/components/ToastNotification.vue -->
<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg z-50"
      :class="{
        'bg-green-500 text-white': type === 'success',
        'bg-red-500 text-white': type === 'error',
        'bg-yellow-500 text-white': type === 'warning'
      }"
    >
      <div class="flex items-center space-x-2">
        <span>{{ message }}</span>
        <button @click="close" class="ml-2 text-sm">×</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
// import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success', // success | error | warning
    validator: value => ['success', 'error', 'warning'].includes(value)
  },
  show: Boolean
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>