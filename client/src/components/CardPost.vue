<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <!-- Image -->
    <img
      :src="postImage"
      :alt="post.title"
      class="w-full h-40 object-cover"
      @error="handleImageError"
    />

    <!-- Content -->
    <div class="p-4">
      <h3 class="text-lg font-heading font-semibold text-gray-900 dark:text-white truncate">
        {{ post.title }}
      </h3>

      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        By {{ post.author }} • {{ formattedDate }}
      </p>

      <p class="mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">
        {{ post.summary }}
      </p>

      <!-- Read More Link -->
      <router-link
        :to="`/post/${post.id}`"
        class="mt-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Read more →
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      title: "Sample Post Title",
      author: "Jane Doe",
      summary: "This is a short summary of the blog post...",
      date: new Date(),
      thumbnail: "", // legacy fallback
      image: null,   // new field from API
    }),
  },
})

const apiUrl = `${import.meta.env.VITE_API_URL}/public`

// Format date using computed property
const formattedDate = computed(() => {
  return new Date(props.post.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

// Use image if available, otherwise use placeholder
const postImage = computed(() => {
  if (props.post.image) {
    return `${apiUrl}${props.post.image}`
  }
  return '/images/placeholder.jpg'
})

// Handle image load error
const handleImageError = (event) => {
  event.target.src = '/images/placeholder.jpg'
}
</script>