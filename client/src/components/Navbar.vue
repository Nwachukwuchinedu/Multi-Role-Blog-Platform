<!-- src/components/Navbar.vue -->
<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo / Title -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-xl font-bold text-gray-800 dark:text-white">
            BlogPlatform
          </router-link>
        </div>

        <!-- Center Links (Optional for future categories) -->
        <div class="hidden md:flex space-x-4 items-center">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
          >
            {{ link.name }}
          </router-link>
        </div>

        <!-- Right Side - Auth & Theme Toggle -->
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
          >
            <span v-if="isDarkMode">☀️</span>
            <span v-else>🌙</span>
          </button>

          <!-- Authenticated User -->
          <div v-if="userStore.isAuthenticated" class="relative">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ userStore.user.username }}</span>
            <button
              @click="logout"
              class="ml-3 text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>

          <!-- Guest -->
          <div v-else class="space-x-2">
            <router-link
              to="/login"
              class="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Register
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/useUserStore'

const router = useRouter()
const userStore = useUserStore()

// Nav links based on role
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Posts', path: '/posts' }
]

// Dark mode handling
const isDarkMode = ref(document.documentElement.classList.contains('dark'))

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>