  <template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Title -->
    <h1 class="text-2xl font-bold font-title text-gray-900 dark:text-white mb-6">Write a New Post</h1>

    <!-- Form -->
    <form @submit.prevent="submitPost" class="space-y-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post Title</label>
        <input
          id="title"
          v-model="post.title"
          type="text"
          placeholder="What's this post about?"
          required
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
        />
      </div>

      <!-- Content -->
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
        <textarea
          id="content"
          v-model="post.content"
          rows="10"
          placeholder="Start writing..."
          required
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
        ></textarea>
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
        <input
          id="tags"
          v-model="post.tags"
          type="text"
          placeholder="e.g. vue,express,blog"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- Image Upload -->
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Image</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          @change="onImageChange"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        />
        <small class="text-gray-500 dark:text-gray-400 mt-1 block">Supported formats: JPG, PNG, GIF</small>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {{ loading ? "Saving..." : "Save Post" }}
      </button>
    </form>

    <!-- Preview Section -->
    <section v-if="post.image" class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 class="text-lg font-heading font-semibold text-gray-800 dark:text-gray-300 mb-4">Preview Image</h2>
      <img
        :src="post.image"
        alt="Featured image preview"
        class="w-full max-h-60 object-cover rounded-md"
      />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../services/apiClient'

const router = useRouter()
const post = ref({
  title: '',
  content: '',
  tags: '',
  image: null
})

const loading = ref(false)
const file = ref(null)

// Handle image selection
const onImageChange = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    const reader = new FileReader()

    reader.onload = (e) => {
      // Set preview URL
      post.value.image = e.target.result
    }

    reader.readAsDataURL(selectedFile)
    file.value = selectedFile
  }
}

// Submit new post
const submitPost = async () => {
  try {
    loading.value = true

    const formData = new FormData()
    formData.append('title', post.value.title)
    formData.append('content', post.value.content)
    formData.append('tags', post.value.tags)

    if (file.value) {
      formData.append('image', file.value)
    }

    // Send to backend
    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    showNotification('Post created successfully!', 'success')
    setTimeout(() => {
      router.push(`/post/${response.data._id}`)
    }, 1500)

  } catch (err) {
    showNotification('Failed to create post.', 'error')
    loading.value = false
    console.error(err)
  }
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