<!-- src/layouts/AuthorLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800 shadow-md p-6 hidden md:block">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Author Dashboard</h2>
      <nav class="space-y-2">
        <router-link
          v-for="item in authorNav"
          :key="item.name"
          :to="item.path"
          class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Mobile Header -->
    <div class="md:hidden w-full bg-white dark:bg-gray-800 shadow-md p-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Author</h2>
        <button @click="toggleSidebar" class="text-gray-500 dark:text-gray-300 focus:outline-none">
          ☰
        </button>
      </div>
    </div>

    <!-- Sidebar for mobile (sliding) -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click.self="toggleSidebar"
    >
      <div class="bg-white dark:bg-gray-800 w-64 h-full p-6 shadow-lg">
        <button @click="toggleSidebar" class="absolute top-4 right-4 text-gray-500 dark:text-gray-300">×</button>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Author Dashboard</h2>
        <nav class="space-y-2">
          <router-link
            v-for="item in authorNav"
            :key="item.name"
            :to="item.path"
            class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="toggleSidebar"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const authorNav = [
  { name: 'My Posts', path: '/author/posts' },
  { name: 'New Post', path: '/author/posts/new' },
  { name: 'Profile', path: '/profile' }
]
</script>