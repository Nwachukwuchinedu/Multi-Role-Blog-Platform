<!-- src/pages/Dashboard.vue -->
<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Users" value="1,234" icon="👥" />
      <StatCard title="Total Posts" value="567" icon="📝" />
      <StatCard title="Pending Reports" value="12" icon="⚠️" />
    </div>

    <!-- User Management Table -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Management</h2>
      <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Role</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th class="px-6 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ user.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">{{ user.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="banUser(user.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Ban</button>
                <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Post Moderation Table -->
    <section>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Post Moderation</h2>
      <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Title</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Author</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th class="px-6 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="post in posts" :key="post.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ post.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ post.author }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  Published
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="deletePost(post.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '../components/StatCard.vue'

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'reader' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'author' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin' }
])

const posts = ref([
  { id: 1, title: 'Introduction to Vue 3', author: 'Jane Smith' },
  { id: 2, title: 'Tailwind CSS Tips', author: 'Jane Smith' },
  { id: 3, title: 'Getting Started with Pinia', author: 'Jane Smith' }
])

const banUser = (id) => {
  users.value = users.value.filter(u => u.id !== id)
  showNotification('User has been banned.', 'success')
}

const deletePost = (id) => {
  posts.value = posts.value.filter(p => p.id !== id)
  showNotification('Post deleted successfully.', 'success')
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