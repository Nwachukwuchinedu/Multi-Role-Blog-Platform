<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <Loader />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-12 text-red-500 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- Post Content -->
    <div v-else>
      <!-- Post Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ post.title }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          By {{ post.author }} • {{ formatDate(post.createdAt) }}
        </p>
      </div>

      <!-- Post Image -->
      <div v-if="post.image" class="mb-6">
        <img
          :src="`${apiUrl}${post.image.url}`"
          :alt="post.image.alt || 'Post Image'"
          class="w-full h-auto rounded-md shadow"
        />
      </div>

      <!-- Post Content -->
      <div
        class="prose dark:prose-invert max-w-none mb-8"
        v-html="post.content"
      ></div>

      <!-- Like Button -->
      <div class="flex items-center space-x-2 mb-6">
        <button
          @click="likePost"
          class="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
        >
          <span>❤️</span>
          <span>{{ post.likes }}</span>
        </button>
      </div>

      <!-- Comments Section -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Comments
        </h2>
        <CommentThread :comments="commentsWithAuthors" />
      </section>

      <!-- Comment Form -->
      <section class="mt-8">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Leave a comment
        </h3>
        <textarea
          v-model="newCommentText"
          rows="3"
          placeholder="Write your comment..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        ></textarea>
        <button
          @click="addComment"
          class="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
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
import CommentThread from "../components/CommentThread.vue";
import Loader from "../components/Loader.vue";
import apiClient from "../services/apiClient";

const route = useRoute();
const postId = route.params.id;
const apiUrl = import.meta.env.VITE_API_URL
const authorMap = ref({});

// Real post data
const post = ref(null);
const loading = ref(true);
const error = ref(null);

// New comment input
const newCommentText = ref("");

const commentsWithAuthors = computed(() => {
  return post.value.comments.map((comment) => ({
    ...comment,
    author: authorMap.value[comment.authorId] || "Loading...",
  }));
});

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

    // Map backend response to expected structure
    post.value = {
      id: data._id,
      title: data.title,
      content: data.content,
      author: data.author.username,
      likes: data.likes.length,
      createdAt: data.createdAt,
      image: data.image?.url
        ? {
            url: data.image.url,
            alt: data.image.alt,
          }
        : null,
      comments: data.comments.map((comment) => ({
        id: comment._id,
        authorId: comment.author,
        text: comment.text,
        date: comment.createdAt,
        likes: comment.likes.length,
      })),
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

    // Re-fetch full post with updated author info
    await fetchPost();

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
    const response = await apiClient.post(`/posts/comment/${postId}`, {
      text,
    });

    const newComment = {
      id: response.data._id,
      authorId: response.data.author,
      text,
      date: response.data.createdAt,
      likes: 0,
    };

    // Add new comment
    post.value.comments.unshift(newComment);

    // Fetch username for new comment author
    if (!authorMap.value[newComment.authorId]) {
      await fetchAuthorName(newComment.authorId);
    }

    newCommentText.value = "";
    showNotification("Your comment was added!", "success");
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
