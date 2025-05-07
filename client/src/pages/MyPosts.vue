<!-- src/pages/MyPosts.vue -->
<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Posts</h1>

    <!-- Create New Post Button -->
    <div class="mb-6">
      <router-link
        to="/author/posts/new"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
      >
        + New Post
      </router-link>
    </div>

    <!-- Posts List -->
    <div class="space-y-6">
      <div
        v-for="post in posts"
        :key="post.id"
        class="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ post.title }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(post.createdAt) }}</p>
        </div>
        <div class="flex space-x-2">
          <button
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>
          <button
            @click="deletePost(post.id)"
            class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="posts.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
      You haven’t written any posts yet.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const posts = ref([
  {
    id: 1,
    title: 'Getting Started with Vue 3',
    createdAt: new Date()
  },
  {
    id: 2,
    title: 'Tailwind CSS Tips & Tricks',
    createdAt: new Date()
  }
])

const deletePost = (id) => {
  posts.value = posts.value.filter(p => p.id !== id)
  showNotification('Post deleted successfully.', 'success')
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function showNotification(message, type = 'success') {
  const container = document.createElement('div')
  container.className = `
    fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg z-50
    ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
    transform transition-all duration-300 ease-in-out
    animate-fade-in-up
  `
  container.textContent = message
  document.body.appendChild(container)

  setTimeout(() => {
    container.classList.add('opacity-0', 'translate-y-2')
    setTimeout(() => container.remove(), 300)
  }, 2500)
}
</script>