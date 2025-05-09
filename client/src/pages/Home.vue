<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="mb-12 relative overflow-hidden rounded-xl group">
      <div class="hero-content p-8 text-center">
        <h1 class="gradient-text text-5xl font-extrabold mb-4 tracking-tight font-title">
          Welcome to BlogPlatform
        </h1>
        <p class="text-lg font-sans dark:text-gray-300 max-w-2xl mx-auto">
          Discover insightful articles from authors around the world. Start reading today.
        </p>
      </div>
    </section>

    <!-- Search Bar -->
    <section class="mb-8 flex justify-center">
      <div class="relative w-full max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          required
          class="peer h-12 w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-900/30 placeholder:opacity-0 placeholder:translate-y-0 group-focus-within:ring-2 ring-primary outline-none transition-all duration-300 px-4 pt-3 pb-1 rounded-md"
        />
        <label
          for="search"
          class="absolute left-4 top-3 text-sm text-gray-500 dark:text-gray-400 peer-placeholder-shown:top-2 peer-focus:top-0 peer-placeholder-shown:text-base peer-focus:text-sm peer-focus:text-blue-500 dark:peer-focus:text-blue-400 transition-all cursor-text"
        >
          Search posts...
        </label>
        <span class="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">🔍</span>
      </div>
    </section>

    <!-- Posts Grid -->
    <section>
      <h2 class="text-2xl font-bold font-title text-gray-900 dark:text-white mb-6">
        Latest Posts
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardPost
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>
    </section>

    <!-- Empty State -->
    <div
      v-if="posts.length === 0 && !loading"
      class="text-center py-12 text-gray-500 dark:text-gray-400 font-sans"
    >
      No posts found. Please try another search term.
    </div>

    <!-- Load More Button -->
    <section class="mt-10 flex justify-center">
      <button
        @click="loadMore"
        :disabled="!hasMore || loading"
        class="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold font-heading rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ loading ? "Loading..." : hasMore ? "Load More" : "No more posts" }}
      </button>
    </section>

    <!-- Loader -->
    <div v-if="loading && page > 1" class="text-center py-8">
      <div class="skeleton-loader"></div>
    </div>
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

<style scoped>
/* Glassmorphism Hero */
.hero-content {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  z-index: 10;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-image: url('https://images.unsplash.com/photo-1508610048659-a06b668d3320a-049248f1bda5d-8c01e65f-4fbd-11eb-8f6b-795f9aef9a2b?ixid=M3wzNjM5Nzd8MHwxfHNlYXJjaHwxfHxiZWV9ZGVmYWxs0ZXJ8MA%3D%3D&ixlib=rb-4.1&w=1200 ');
  background-size: cover;
  background-position: center;
  filter: brightness(0.7);
  transition: filter 0.3s ease-in-out;
}

.hero-section:hover::before {
  filter: brightness(0.5) scale(1.05);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(to right, #4f46e5, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

/* Shimmer Loader */
.skeleton-loader {
  width: 60%;
  height: 20px;
  margin: 0 auto;
  border-radius: 9999px;
  background: linear-gradient(
    to right,
    #e0e0e0 5%,
    #f5f5f5 20%,
    #e0e0e0 40%
  );
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}
</style>
