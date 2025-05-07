<!-- src/components/CardPost.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
    <img :src="post.thumbnail || '/images/placeholder.jpg'" alt="Post image" class="w-full h-40 object-cover" />
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ post.title }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">By {{ post.author }} • {{ formatDate(post.date) }}</p>
      <p class="mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">{{ post.summary }}</p>
      <router-link
        :to="`/post/${post.id}`"
        class="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
      >
        Read more →
      </router-link>
    </div>
  </div>
</template>

<script setup>
// import { defineProps } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      title: 'Sample Post Title',
      author: 'Jane Doe',
      summary: 'This is a short summary of the blog post...',
      date: new Date(),
      thumbnail: ''
    })
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>