<!-- src/components/CommentThread.vue -->
<template>
  <div class="space-y-4">
    <div v-for="comment in comments" :key="comment.id" class="border-l-4 border-blue-500 pl-4 py-2">
      <div class="flex justify-between">
        <strong class="text-gray-900 dark:text-white">{{ comment.author }}</strong>
        <small class="text-gray-500 dark:text-gray-400">{{ formatDate(comment.date) }}</small>
      </div>
      <p class="mt-1 text-gray-700 dark:text-gray-300">{{ comment.text }}</p>
      <div class="mt-2 flex space-x-2">
        <button class="text-sm text-blue-600 hover:underline dark:text-blue-400">Like</button>
        <button class="text-sm text-gray-600 hover:underline dark:text-gray-400">Reply</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { defineProps } from 'vue'

const props = defineProps({
  comments: {
    type: Array,
    default: () => [
      {
        id: 1,
        author: 'Alice',
        text: 'Great article!',
        date: new Date()
      },
      {
        id: 2,
        author: 'Bob',
        text: 'Nice insights.',
        date: new Date()
      }
    ]
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}
</script>