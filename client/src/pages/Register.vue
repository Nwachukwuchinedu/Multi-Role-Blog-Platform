<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-all duration-300">
      <!-- Logo / Title -->
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Create Account</h2>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="johndoe"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Role Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I want to register as:</label>
          <select
            v-model="form.role"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="reader">Reader</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full mt-2 py-3 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:shadow-md transform transition-all duration-200 hover:scale-105"
        >
          Register
        </button>
      </form>

      <!-- Login Link -->
      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 font-sans">
        Already have an account?
        <router-link
          to="/login"
          class="font-medium text-primary dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 ml-1"
        >
          Log in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../services/apiClient'
import { useUserStore } from '../stores/useUserStore'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  role: 'reader'
})

const handleRegister = async () => {
  try {
    const response = await apiClient.post('/auth/register', form.value)

    // Mock login flow (replace with real login if needed)
    const { _id, username, email, role, token } = response.data

    // Set auth state
    userStore.setAuth(token, { _id, username, email, role })

    showNotification('Registration successful!', 'success')
    setTimeout(() => {
      if (role === 'admin') {
        router.push('/admin/dashboard')
      } else if (role === 'author') {
        router.push('/author/posts')
      } else {
        router.push('/')
      }
    }, 1500)

  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed. Try again.'
    showNotification(message, 'error')
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