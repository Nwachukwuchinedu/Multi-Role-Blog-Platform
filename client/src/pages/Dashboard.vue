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

    <!-- Stats Section -->
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
              v-for="user in paginatedUsers"
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
                  class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                >
                  {{ user.banned ? "Unban" : "Ban" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- User Pagination -->
        <div
          v-if="users.length > usersPerPage"
          class="flex justify-between items-center mt-4 px-4 pb-4"
        >
          <button
            @click="prevPage('users')"
            :disabled="currentPage.users <= 1"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Page {{ currentPage.users }} of {{ totalPages.users }}
          </span>
          <button
            @click="nextPage('users')"
            :disabled="currentPage.users >= totalPages.users"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
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
          v-for="post in paginatedPosts"
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

      <!-- Post Pagination -->
      <div
        v-if="posts.length > postsPerPage"
        class="flex justify-between items-center mt-4 px-4 pb-4"
      >
        <button
          @click="prevPage('posts')"
          :disabled="currentPage.posts <= 1"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Page {{ currentPage.posts }} of {{ totalPages.posts }}
        </span>
        <button
          @click="nextPage('posts')"
          :disabled="currentPage.posts >= totalPages.posts"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import apiClient from "../services/apiClient";

const users = ref([]);
const posts = ref([]);
const recentActivity = ref("No recent activity");
const loading = ref(true);
const error = ref(null);

// Pagination state
const currentPage = ref({
  users: 1,
  posts: 1,
});
const usersPerPage = 10;
const postsPerPage = 10;

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

// Pagination helpers
const paginatedUsers = computed(() => {
  const start = (currentPage.value.users - 1) * usersPerPage;
  const end = start + usersPerPage;
  return users.value.slice(start, end);
});

const paginatedPosts = computed(() => {
  const start = (currentPage.value.posts - 1) * postsPerPage;
  const end = start + postsPerPage;
  return posts.value.slice(start, end);
});

const totalPages = computed(() => ({
  users: Math.ceil(users.value.length / usersPerPage),
  posts: Math.ceil(posts.value.length / postsPerPage),
}));

// Pagination actions
function nextPage(section) {
  if (currentPage.value[section] < totalPages.value[section]) {
    currentPage.value[section]++;
  }
}

function prevPage(section) {
  if (currentPage.value[section] > 1) {
    currentPage.value[section]--;
  }
}
</script>
