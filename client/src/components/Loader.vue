<template>
  <div class="flex justify-center items-center flex-col space-y-2 my-6">
    <div class="flex justify-center items-center space-x-2">
      <span class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
      <span class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
      <span class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
    </div>

    <!-- Optional Loading Text -->
    <p class="text-sm text-gray-600 dark:text-gray-400 font-sans mt-2">Loading...</p>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: scale(0.2);
    opacity: 0.9;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce {
  animation: bounce 1.2s infinite ease-in-out;
}
</style>

