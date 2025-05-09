<template>
  <div class="max-w-6xl mx-auto px-10 py-8">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-3xl font-title font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400 font-sans">
        Manage users and blog content.
      </p>
    </header>

    <!-- Stats Section (Optional) -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <div
        class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center justify-between"
      >
        <div>
          <h3 class="text-sm font-heading text-gray-500 dark:text-gray-400">
            Total Users
          </h3>
          <p
            class="text-2xl font-title font-bold text-gray-900 dark:text-white"
          >
            {{ users.length }}
          </p>
        </div>
        <span class="text-indigo-500">👥</span>
      </div>

      <div
        class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center justify-between"
      >
        <div>
          <h3 class="text-sm font-heading text-gray-500 dark:text-gray-400">
            Total Posts
          </h3>
          <p
            class="text-2xl font-title font-bold text-gray-900 dark:text-white"
          >
            {{ posts.length }}
          </p>
        </div>
        <span class="text-purple-500">📄</span>
      </div>

      <div
        class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center justify-between"
      >
        <div>
          <h3 class="text-sm font-heading text-gray-500 dark:text-gray-400">
            Recent Activity
          </h3>
          <p
            class="text-2xl font-title font-bold text-gray-900 dark:text-white"
          >
            {{ recentActivity }}
          </p>
        </div>
        <span class="text-pink-500">🕒</span>
      </div>
    </section>

    <!-- Users Section -->
    <section class="mb-10">
      <h2
        class="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-4"
      >
        Users
      </h2>
      <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                class="py-3 px-4 text-left text-sm font-heading text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                Username
              </th>
              <th
                scope="col"
                class="py-3 px-4 text-left text-sm font-heading text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                class="py-3 px-4 text-left text-sm font-heading text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                class="py-3 px-4 text-left text-sm font-heading text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="user in users"
              :key="user._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <td
                class="py-4 px-4 whitespace-nowrap font-sans text-gray-900 dark:text-white"
              >
                {{ user.username }}
              </td>
              <td
                class="py-4 px-4 whitespace-nowrap font-sans text-gray-600 dark:text-gray-400"
              >
                {{ user.email }}
              </td>
              <td
                class="py-4 px-4 whitespace-nowrap font-sans capitalize text-gray-600 dark:text-gray-400"
              >
                {{ user.role }}
              </td>
              <td class="py-4 px-4 whitespace-nowrap font-sans">
                <button
                  @click="banUser(user._id)"
                  :disabled="user.role === 'admin'"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-heading transition-colors"
                >
                  {{ user.banned ? "Unban" : "Ban" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Posts Section -->
    <section class="mb-10">
      <h2
        class="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-4"
      >
        All Posts
      </h2>
      <div class="space-y-4">
        <div
          v-for="post in posts"
          :key="post._id"
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200"
        >
          <div class="sm:flex-1">
            <h3 class="font-medium font-heading text-gray-900 dark:text-white">
              {{ post.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              By {{ post.author.username }} • {{ formatDate(post.createdAt) }}
            </p>
          </div>
          <div class="mt-4 sm:mt-0 flex space-x-3">
            <button
              @click="deletePost(post._id)"
              class="text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-md hover:shadow-md transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "../services/apiClient";

const users = ref([]);
const posts = ref([]);
const recentActivity = ref("No recent activity"); // Define recentActivity with a default value
const loading = ref(true);
const error = ref(null);

// Fetch data
const fetchData = async () => {
  try {
    const [usersRes, postsRes] = await Promise.all([
      apiClient.get("/admin/users"),
      apiClient.get("/admin/posts"),
    ]);

    users.value = usersRes.data;
    posts.value = postsRes.data.map((p) => ({
      ...p,
      author: p.author || { username: "Unknown" },
    }));
    recentActivity.value = "Fetched data successfully"; 
    loading.value = false;
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
    error.value = "Failed to load dashboard. Try refreshing.";
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

// Ban User
const banUser = async (userId) => {
  if (!confirm("Are you sure you want to ban this user?")) return;

  try {
    await apiClient.post(`/admin/ban-user/${userId}`);
    users.value = users.value.map((u) =>
      u._id === userId ? { ...u, banned: true } : u
    );
    showNotification("User banned successfully.", "success");
  } catch (err) {
    showNotification("Failed to ban user.", "error");
  }
};

// Delete Post
const deletePost = async (postId) => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await apiClient.delete(`/admin/posts/${postId}`);
    posts.value = posts.value.filter((p) => p._id !== postId);
    showNotification("Post deleted successfully.", "success");
  } catch (err) {
    showNotification("Failed to delete post.", "error");
  }
};

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Toast Notification
function showNotification(message, type = "success") {
  const container = document.createElement("div");
  container.className = `
    fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg z-50
    ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
    transform transition-all duration-300 ease-in-out
    animate-fade-in-up
  `;
  container.textContent = message;
  document.body.appendChild(container);

  setTimeout(() => {
    container.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => container.remove(), 300);
  }, 2500);
}
</script>
