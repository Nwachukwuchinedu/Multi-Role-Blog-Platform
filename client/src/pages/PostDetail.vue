<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <Loader />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-12 text-red-500 dark:text-red-400 font-sans"
    >
      {{ error }}
    </div>

    <!-- Post Content -->
    <div v-else class="space-y-8 animate-fade-in-up">
      <!-- Post Header -->
      <header class="space-y-2 text-center md:text-left">
        <h1 class="gradient-text text-4xl font-title font-extrabold leading-tight">
          {{ post.title }}
        </h1>
        <p class="text-sm font-heading text-gray-600 dark:text-gray-400">
          By {{ post.author }} • {{ formatDate(post.createdAt) }}
        </p>
      </header>

      <!-- Featured Image -->
      <section v-if="post.image" class="glass-card overflow-hidden rounded-xl">
        <img
          :src="`${apiUrl}${post.image.url}`"
          :alt="post.image.alt || 'Post Image'"
          class="w-full h-auto object-cover"
        />
      </section>

      <!-- Rich Post Content -->
      <article class="prose dark:prose-invert max-w-none font-sans">
        <div v-html="post.content"></div>
      </article>

      <!-- Like Button -->
      <footer class="mt-10 border-t dark:border-gray-700 pt-6 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <button
            @click="likePost"
            class="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
          >
            <span>❤️</span>
            <span>{{ post.likes }}</span>
          </button>
        </div>
      </footer>

      <!-- Comments Section -->
      <section class="mt-12">
        <h2 class="text-2xl font-heading font-semibold text-gray-900 dark:text-white mb-6">Comments</h2>
        <CommentThread :comments="commentsWithAuthors" />
      </section>

      <!-- Add New Comment -->
      <section class="mt-10 pt-6 border-t dark:border-gray-700">
        <h3 class="text-lg font-heading font-semibold text-gray-800 dark:text-white mb-4">Leave a comment</h3>
        <textarea
          v-model="newCommentText"
          rows="3"
          placeholder="Write your thoughts..."
          class="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:outline-none dark:bg-gray-800 dark:text-white font-sans"
        ></textarea>
        <button
          @click="addComment"
          class="mt-3 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-heading font-medium rounded-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          Submit Comment
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import apiClient from "../services/apiClient";
import CommentThread from "../components/CommentThread.vue";
import Loader from "../components/Loader.vue";

const route = useRoute();
const postId = route.params.id;
const apiUrl = `${import.meta.env.VITE_API_URL}/public`


// Real post data
const post = ref(null);
const loading = ref(true);
const error = ref(null);

// Author mapping
const authorMap = ref({});
const commentsWithAuthors = computed(() => {
  return post.value.comments.map((comment) => ({
    ...comment,
    author: authorMap.value[comment.authorId] || "Loading...",
  }));
});

// New comment input
const newCommentText = ref("");

// Fetch username from backend
const fetchAuthorName = async (userId) => {
  try {
    const res = await apiClient.get(`/users/${userId}`);
    authorMap.value[userId] = res.data.username;
  } catch (err) {
    console.error("Failed to load author", err);
    authorMap.value[userId] = "Unknown";
  }
};

// Fetch post from API
const fetchPost = async () => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);

    const data = response.data;

    // Map backend response
    post.value = {
      id: data._id,
      title: data.title,
      content: data.content,
      author: data.author.username,
      likes: data.likes.length,
      createdAt: data.createdAt,
      image: data.image?.url ? { url: data.image.url, alt: data.image.alt } : null,
      comments: data.comments.map((comment) => ({
        id: comment._id,
        authorId: comment.author,
        text: comment.text,
        date: comment.createdAt,
        likes: comment.likes.length
      }))
    };

    loading.value = false;

    // Preload comment authors
    const userIds = post.value.comments
      .map((c) => c.authorId)
      .filter((id) => id && !authorMap.value[id]);

    for (const id of userIds) {
      await fetchAuthorName(id);
    }

  } catch (err) {
    error.value = "Failed to load post.";
    loading.value = false;
    console.error(err);
  }
};

onMounted(() => {
  fetchPost();
});

// Like Post
const likePost = async () => {
  try {
    await apiClient.post(`/posts/like/${postId}`);
    await fetchPost(); // Refresh post data
    showNotification("You liked this post!", "success");
  } catch (err) {
    showNotification("Like failed. Try again.", "error");
  }
};

// Add Comment
const addComment = async () => {
  const text = newCommentText.value.trim();
  if (!text) return;

  try {
    const response = await apiClient.post(`/posts/comment/${postId}`, { text });

    const newComment = {
      id: response.data._id,
      authorId: response.data.author,
      text,
      date: response.data.createdAt,
      likes: 0
    };

    post.value.comments.unshift(newComment);
    newCommentText.value = "";
    showNotification("Your comment was added!", "success");

    if (!authorMap.value[newComment.authorId]) {
      await fetchAuthorName(newComment.authorId);
    }

  } catch (err) {
    showNotification("Failed to submit comment", "error");
  }
};

// Format Date
function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
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
