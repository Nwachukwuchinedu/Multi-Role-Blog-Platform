<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-white dark:bg-gray-800 shadow-md p-6 hidden md:block h-full sticky top-0"
    >
      <h2
        class="text-lg font-bold font-title text-gray-900 dark:text-white mb-4"
      >
        Author Dashboard
      </h2>
      <nav class="space-y-2">
        <router-link
          v-for="item in authorNav"
          :key="item.name"
          :to="item.path"
          class="block px-4 py-2 rounded-md text-gray-700 hover:bg-indigo-100 dark:text-gray-300 dark:hover:bg-indigo-600 transition-colors duration-200 font-heading"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Mobile Header -->
    <div class="md:hidden w-full bg-white dark:bg-gray-800 shadow-md p-4 z-20">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold font-title text-gray-900 dark:text-white">
          Author
        </h2>
        <button
          @click="toggleSidebar"
          class="text-gray-500 dark:text-gray-300 focus:outline-none"
        >
          ☰
        </button>
      </div>
    </div>

    <!-- Full Screen Mobile Sidebar Drawer -->
    <transition name="slide" mode="out-in">
      <div
        v-show="isSidebarOpen"
        class="fixed inset-0 z-50 md:hidden"
        v-if="isSidebarOpen"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          @click.self="toggleSidebar"
        ></div>

        <!-- Sidebar Panel -->
        <div
          class="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out pt-16 pb-8 overflow-auto"
        >
          <button
            @click="toggleSidebar"
            class="absolute top-4 right-4 text-xl text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
          >
            ×
          </button>
          <h2
            class="absolute top-4 left-6 text-lg font-bold font-title text-gray-900 dark:text-white"
          >
            Author Dashboard
          </h2>
          <nav class="mt-8 space-y-2 px-2">
            <router-link
              v-for="item in authorNav"
              :key="item.name"
              :to="item.path"
              class="block px-4 py-3 rounded-md text-gray-700 hover:bg-indigo-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 font-heading"
              @click="toggleSidebar"
            >
              {{ item.name }}
            </router-link>
          </nav>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <main
      class="flex-grow container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 md:px-6"
    >
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>

<script setup>
import { ref } from "vue";

const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const authorNav = [
  { name: "My Posts", path: "/author/posts" },
  { name: "New Post", path: "/author/posts/new" },
  { name: "Profile", path: "/profile" },
];
</script>
