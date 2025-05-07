<!-- src/pages/NotFound.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="text-center max-w-md w-full">
      <!-- Emoji Illustration -->
      <div class="text-6xl mb-6">🔍</div>

      <!-- Title -->
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>

      <!-- Message -->
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <!-- Back to Home Button -->
      <router-link
        to="/"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
      >
        ← Back to Homepage
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No logic needed here
</script>