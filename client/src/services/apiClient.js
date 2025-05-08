import axios from "axios";
import { useUserStore } from "../stores/useUserStore";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Mock base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers["Authorization"] = `Bearer ${userStore.token}`;
  }
  return config;
});

export default apiClient;
