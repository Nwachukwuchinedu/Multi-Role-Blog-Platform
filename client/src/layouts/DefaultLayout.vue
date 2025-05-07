<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 shadow-inner py-6">
      <div class="text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 BlogPlatform. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
</script>
