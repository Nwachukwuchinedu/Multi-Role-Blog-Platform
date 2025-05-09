<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-center max-w-md w-full p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-all duration-300">
      <!-- SVG Illustration -->
      <div class="mb-6 mx-auto w-40 h-40 text-indigo-500 animate-pulse">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
          <path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
          <path d="M12 16v-4m0-4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>

      <!-- Title -->
      <h1 class="text-3xl font-title font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>

      <!-- Message -->
      <p class="text-lg font-sans text-gray-600 dark:text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <!-- Back to Home Button -->
      <router-link
        to="/"
        class="inline-flex items-center px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
      >
        ← Back to Homepage
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No logic needed here
</script>