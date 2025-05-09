<template>
  <nav
    class="glass-navbar flex items-center justify-between px-4 py-3 md:px-8 md:py-4 rounded-b-xl shadow-lg transition-all duration-300"
  >
    <!-- Logo / Brand -->
    <div class="flex-shrink-0 flex items-center">
      <router-link
        to="/"
        class="gradient-text text-2xl font-title font-bold tracking-tight"
      >
        Bl&Phi;g
      </router-link>
    </div>

    <!-- Center Links -->
    <div class="hidden md:flex space-x-6 items-center">
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.path"
        class="text-gray-700 dark:text-gray-300 font-heading font-medium hover:text-primary dark:hover:text-blue-400 transition-colors duration-300"
      >
        {{ link.name }}
      </router-link>
    </div>

    <!-- Right Side - Auth & Theme Toggle -->
    <div class="flex items-center space-x-4">
      <!-- Dark Mode Toggle -->
      <button
        @click="toggleDarkMode"
        class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        <span v-if="isDarkMode">☀️</span>
        <span v-else>🌙</span>
      </button>

      <!-- Authenticated User -->
      <div v-if="userStore.isAuthenticated" class="relative">
        <div
          @click="toggleDropdown"
          class="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:p-0"
        >
          <!-- Avatar or Initials -->
          <div
            class="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-sans"
          >
            {{ userStore.user.username.charAt(0).toUpperCase() }}
          </div>

          <!-- Username (only on desktop) -->
          <span
            class="hidden md:inline-block font-heading text-gray-900 dark:text-white"
          >
            {{ userStore.user.username }}
          </span>
        </div>

        <!-- Dropdown (visible on click, not just hover) -->
        <div
          v-show="isDropdownOpen"
          class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden z-50 transition-all duration-200"
        >
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Guest -->
      <div v-else class="flex space-x-3">
        <router-link
          to="/login"
          class="hidden md:block text-sm font-heading text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200"
        >
          Login
        </router-link>
        <router-link
          to="/register"
          class="text-sm font-semibold font-heading bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1.5 rounded-full hover:shadow-md transition-all duration-200"
        >
          Register
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/useUserStore";

const router = useRouter();
const userStore = useUserStore();

// Nav links
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Posts", path: "/posts" },
];

const isDropdownOpen = ref(false)

// Toggle dropdown manually for mobile support
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const logout = () => {
  isDropdownOpen.value = false // Close dropdown after logout
  userStore.logout()
  router.push('/login')
}

// Dark mode state
const isDarkMode = ref(document.documentElement.classList.contains("dark"));

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");
  }
};

// Load saved theme
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    isDarkMode.value = true;
  } else {
    document.documentElement.classList.remove("dark");
    isDarkMode.value = false;
  }
});

onMounted(() => {
  const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.relative');
    if (!dropdown?.contains(event.target)) {
      isDropdownOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)
})
</script>
