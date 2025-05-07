<!-- src/components/Loader.vue -->
<template>
  <div class="flex justify-center items-center space-x-2 my-6">
    <span class="w-3 h-3 bg-blue-500 rounded-full animate-[loader_1.2s_infinite_0ms]"></span>
    <span class="w-3 h-3 bg-blue-500 rounded-full animate-[loader_1.2s_infinite_300ms]"></span>
    <span class="w-3 h-3 bg-blue-500 rounded-full animate-[loader_1.2s_infinite_600ms]"></span>
  </div>
</template>

<style>
@keyframes loader {
  0% { transform: scale(0); }
  50% { transform: scale(1); }
  100% { transform: scale(0); }
}
.animate-loader {
  animation: loader 1.2s infinite ease-in-out;
}
</style>