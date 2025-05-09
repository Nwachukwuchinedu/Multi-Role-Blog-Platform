<template>
  <transition name="slide-up">
    <div
      v-show="show"
      class="fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-lg z-50 flex items-center space-x-3 max-w-xs"
      :class="{
        'bg-green-500 text-white': type === 'success',
        'bg-red-500 text-white': type === 'error',
        'bg-yellow-500 text-white': type === 'warning',
      }"
    >
      <!-- Icon -->
      <span class="text-xl">
        {{ icon }}
      </span>

      <!-- Message -->
      <span class="flex-1 font-sans">{{ message }}</span>

      <!-- Close Button -->
      <button @click="close" class="text-sm hover:text-gray-200">×</button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "success",
    validator: (value) => ["success", "error", "warning"].includes(value),
  },
  show: Boolean,
});

const emit = defineEmits(["close"]);

// Map icons based on type
const icon = computed(() => {
  switch (props.type) {
    case "success":
      return "✅";
    case "error":
      return "🚨";
    case "warning":
      return "⚠️";
    default:
      return "ℹ️";
  }
});

const close = () => {
  emit("close");
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
