<template>
  <div class="space-y-6">
    <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-md shadow-sm border-l-4 border-blue-500">
      <div class="flex justify-between items-center mb-2">
        <!-- Author -->
        <strong class="text-lg font-heading text-gray-900 dark:text-white">{{ comment.author }}</strong>

        <!-- Date -->
        <small class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(comment.date) }}</small>
      </div>

      <!-- Comment Text -->
      <p class="mt-1 text-base font-sans text-gray-700 dark:text-gray-300">{{ comment.text }}</p>

      <!-- Actions -->
      <div class="mt-3 flex space-x-4">
        <button class="inline-flex items-center text-sm font-heading text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
          👍 Like
        </button>
        <button class="inline-flex items-center text-sm font-heading text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200">
          💬 Reply
        </button>
      </div>

      <!-- Nested Replies -->
      <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 ml-6 border-l-2 border-gray-300 dark:border-gray-600 pl-4 space-y-3">
        <div v-for="reply in comment.replies" :key="reply.id" class="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
          <div class="flex justify-between">
            <strong class="text-sm font-heading text-gray-800 dark:text-gray-200">{{ reply.author }}</strong>
            <small class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(reply.date) }}</small>
          </div>
          <p class="mt-1 text-sm font-sans text-gray-700 dark:text-gray-300">{{ reply.text }}</p>
          <!-- <div class="mt-2 flex space-x-3">
            <button class="text-xs font-heading text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
              👍 Like
            </button>
            <button class="text-xs font-heading text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200">
              💬 Reply
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  comments: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}
</script>