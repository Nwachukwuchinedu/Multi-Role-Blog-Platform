<!-- src/pages/Home.vue -->
<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to BlogPlatform
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Discover insightful articles from authors around the world. Start
        reading today.
      </p>
    </section>

    <!-- Search / Filter Bar -->
    <section class="mb-8 flex justify-center">
      <div class="relative w-full max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search posts..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <span class="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
          >🔍</span
        >
      </div>
    </section>

    <!-- Posts Grid -->
    <section>
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Latest Posts
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardPost v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </section>

    <!-- Empty State -->
    <div
      v-if="posts.length === 0 && !loading.value"
      class="text-center py-12 text-gray-500 dark:text-gray-400"
    >
      No posts found. Please try another search term.
    </div>

    <!-- Pagination -->
    <section class="mt-10 flex justify-center">
      <button
        @click="loadMore"
        :disabled="!hasMore.valueOf() || loading.valueOf()"
        class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{
          loading.valueOf()
            ? "Loading..."
            : hasMore.valueOf()
            ? "Load More"
            : "No more posts"
        }}
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import CardPost from "../components/CardPost.vue";
import apiClient from "../services/apiClient";

const searchQuery = ref("");
const posts = ref([]);
const loading = ref(true);
const page = ref(1);
const limit = 3;
const totalPages = ref(1);
const hasMore = ref(true);

// Fetch posts from API
const fetchPosts = async () => {
  try {
    loading.value = true;

    const response = await apiClient.get("/posts", {
      params: {
        search: searchQuery.value,
        page: page.value,
        limit,
      },
    });

    const newPosts = response.data.posts.map((post) => ({
      id: post._id,
      title: post.title,
      summary: post.content.substring(0, 100) + "...",
      author: post.author.username,
      date: post.createdAt,
      image: post.image?.url,
    }));

    posts.value = [...posts.value, ...newPosts];
    totalPages.value = response.data.totalPages;
    if (page.value >= totalPages.value) {
      hasMore.value = false;
    }

    loading.value = false;
  } catch (err) {
    console.error(err);
    loading.value = false;
  }
};

// Load more posts
const loadMore = () => {
  if (!hasMore.value || loading.value) return;
  page.value += 1;
  fetchPosts();
};

// Reset on search change
watch(searchQuery, (newVal) => {
  if (newVal.trim().length > 2 || newVal === "") {
    page.value = 1;
    posts.value = [];
    hasMore.value = true;
    fetchPosts();
  }
});

onMounted(() => {
  fetchPosts();
});
</script>
