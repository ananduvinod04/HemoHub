import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://api.yoursite.com/api
  withCredentials: true,                 // allow cookies
});

// 🔥 Attach token for mobile browsers
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//  Optional: global 401 handler (recommended)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — token invalid or missing");
      // You can auto-logout here if you want:
      // useAuthStore.getState().logout(useAuthStore.getState().role);
    }
    return Promise.reject(error);
  }
);

export default api;
