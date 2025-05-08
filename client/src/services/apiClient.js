// src/services/apiClient.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend base URL
  headers: {
    'Content-Type': 'application/json'
  }
})

// Optional: Add interceptor for auth later
/*
apiClient.interceptors.request.use(config => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers['Authorization'] = `Bearer ${userStore.token}`
  }
  return config
})
*/

export default apiClient