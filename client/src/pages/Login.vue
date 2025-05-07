<!-- src/pages/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Login
        </button>
      </form>

      <!-- Register Link -->
      <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <router-link to="/register" class="text-blue-600 hover:underline dark:text-blue-400">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/useUserStore'
import  apiClient  from '../services/apiClient'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    // Simulate API call or replace with real backend
    const response = await apiClient.post('/auth/login', form.value)

    // Mock JWT and user data
    const mockToken = 'mock-jwt-token-123'
    const mockUser = {
      username: 'JaneDoe',
      email: form.value.email,
      role: 'admin' // You can simulate different roles here
    }

    // Set auth state
    userStore.setAuth(mockToken, mockUser)

    // Redirect based on role
    if (mockUser.role === 'admin') {
      router.push('/admin/dashboard')
    } else if (mockUser.role === 'author') {
      router.push('/author/posts')
    } else {
      router.push('/')
    }

    showNotification('Logged in successfully!', 'success')
  } catch (error) {
    showNotification('Login failed. Please check your credentials.', 'error')
  }
}

// Simple toast notification (replace with library like Toastify later)
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

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
</style>