<!-- src/pages/PostDetail.vue -->
<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Post Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ post.title }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        By {{ post.author }} • {{ formatDate(post.createdAt) }}
      </p>
    </div>

    <!-- Post Content -->
    <div class="prose dark:prose-invert max-w-none mb-8" v-html="post.content"></div>

    <!-- Like Button -->
    <div class="flex items-center space-x-2 mb-6">
      <button
        @click="likePost"
        class="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
      >
        <span>❤️</span>
        <span>{{ post.likes }}</span>
      </button>
    </div>

    <!-- Comments Section -->
    <CommentThread :comments="post.comments" />

    <!-- Comment Form -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Leave a comment</h3>
      <textarea
        v-model="newCommentText"
        rows="3"
        placeholder="Write your comment..."
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      ></textarea>
      <button
        @click="addComment"
        class="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
      >
        Submit Comment
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CommentThread from '../components/CommentThread.vue'

const route = useRoute()
const newCommentText = ref('')
const postId = route.params.id

// Mock post data
const post = ref({
  title: 'How I Built My First Vue App',
  author: 'JaneDoe',
  content: '<p>This is the full rich-text content of the blog post...</p>',
  likes: 12,
  createdAt: new Date(),
  comments: [
    {
      id: 1,
      author: 'Alice',
      text: 'Great article!',
      likes: 3
    },
    {
      id: 2,
      author: 'Bob',
      text: 'Loved the tips.',
      likes: 1
    }
  ]
})

onMounted(() => {
  // Fetch real post here if needed
})

const likePost = () => {
  post.value.likes++
  showNotification('You liked this post!', 'success')
}

const addComment = () => {
  if (!newCommentText.value.trim()) return

  const newComment = {
    id: Date.now(),
    author: 'You',
    text: newCommentText.value,
    likes: 0
  }

  post.value.comments.unshift(newComment)
  newCommentText.value = ''
  showNotification('Your comment was added!', 'success')
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
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