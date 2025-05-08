<!-- src/pages/MyPosts.vue -->
<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      My Posts
    </h1>

    <!-- Create New Post Button -->
    <div class="mb-6">
      <router-link
        to="/author/posts/new"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
      >
        + New Post
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <Loader />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-12 text-red-500 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- Posts List -->
    <div v-else class="space-y-6">
      <div
        v-for="post in posts"
        :key="post._id"
        class="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ post.title }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(post.createdAt) }}
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="router.push(`/author/posts/edit/${post._id}`)"
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>
          <button
            @click="deletePost(post._id)"
            class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && posts.length === 0"
      class="text-center py-10 text-gray-500 dark:text-gray-400"
    >
      You haven’t written any posts yet.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../services/apiClient'
import Loader from '../components/Loader.vue'

const router = useRouter()
const posts = ref([])
const loading = ref(true)
const error = ref(null)

// For debug only
const debug = {
  currentUser: ref(null),
  rawPosts: ref([]),
  filteredPosts: ref([]),
  matchCount: ref(0)
}

// Base URL for images (optional later)
const apiUrl = import.meta.env.VITE_API_URL

// Fetch user's own posts
const fetchPosts = async () => {
  try {
    const response = await apiClient.get('/posts/nolimit')

    // Store raw data for debugging
    debug.rawPosts.value = response.data.posts

    // Get current user from localStorage
    const currentUserFromStorage = JSON.parse(localStorage.getItem('user'))
    debug.currentUser.value = currentUserFromStorage

    console.groupCollapsed('[DEBUG] MyPosts.vue – Post Filtering')
    console.log('Raw API Posts:', debug.rawPosts.value)
    console.log('Current User:', debug.currentUser.value)

    // Filter by author ID
    const filtered = debug.rawPosts.value.filter(post => {
      const backendId = post.author._id
      const storedId = currentUserFromStorage?._id

      const match = String(backendId).trim() === String(storedId).trim()

      console.log(`Post Author ID: "${backendId}" | Current User ID: "${storedId}" → Match: ${match}`)

      return match
    })

    debug.filteredPosts.value = filtered
    debug.matchCount.value = filtered.length

    console.log('✅ Filtered Posts:', filtered)
    console.groupEnd()

    // Set final list
    posts.value = filtered
    loading.value = false
  } catch (err) {
    error.value = 'Failed to load your posts.'
    loading.value = false
    console.error('🚨 Error fetching posts:', err)
  }
}

onMounted(() => {
  fetchPosts()
})

// Delete Post
const deletePost = async (postId) => {
  if (!confirm('Are you sure you want to delete this post?')) return

  try {
    await apiClient.delete(`/posts/${postId}`)
    posts.value = posts.value.filter(p => p._id !== postId)
    showNotification('Post deleted successfully.', 'success')
  } catch (err) {
    showNotification('Delete failed. Try again.', 'error')
  }
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Toast Notification
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