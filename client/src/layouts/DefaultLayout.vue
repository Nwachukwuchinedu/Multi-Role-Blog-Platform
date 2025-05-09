<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="glass-navbar w-full bg-opacity-70 backdrop-filter backdrop-blur-sm py-6 mt-auto">
      <div class="text-center text-sm text-gray-500 dark:text-gray-400 font-heading tracking-wide">
        © {{ new Date().getFullYear() }} BlogPlatform. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup></script>
