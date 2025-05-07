<!-- src/pages/Home.vue -->
<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to BlogPlatform</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Discover insightful articles from authors around the world. Start reading today.
      </p>
    </section>

    <!-- Search / Filter Bar -->
    <section class="mb-8 flex justify-center">
      <div class="relative w-full max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search posts..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <span class="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">🔍</span>
      </div>
    </section>

    <!-- Posts Grid -->
    <section>
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Latest Posts</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardPost v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
    </section>

    <!-- Empty State -->
    <div v-if="filteredPosts.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
      No posts found. Please try another search term.
    </div>

    <!-- Pagination (stub) -->
    <section class="mt-10 flex justify-center">
      <button
        @click="loadMore"
        class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Load More
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CardPost from '../components/CardPost.vue'

const searchQuery = ref('')

// Mock data for posts
const posts = ref([
  {
    id: 1,
    title: 'Getting Started with Vue 3',
    author: 'Jane Doe',
    summary: 'A beginner-friendly introduction to Vue 3 and Composition API.',
    date: new Date(),
    thumbnail: '/images/vue.jpg'
  },
  {
    id: 2,
    title: 'Tailwind CSS Tips & Tricks',
    author: 'John Smith',
    summary: 'Learn how to master utility-first CSS with Tailwind CSS.',
    date: new Date(),
    thumbnail: '/images/tailwind.jpg'
  },
  {
    id: 3,
    title: 'Building Reusable Components',
    author: 'Alice Chen',
    summary: 'How to structure and build reusable components in your Vue apps.',
    date: new Date(),
    thumbnail: '/images/components.jpg'
  }
])

// Filter posts by search query
const filteredPosts = computed(() => {
  if (!searchQuery.value.trim()) return posts.value
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.summary.toLowerCase().includes(query) ||
    post.author.toLowerCase().includes(query)
  )
})

// Load more stub
function loadMore() {
  // You can fetch more posts from an API here
}
</script>