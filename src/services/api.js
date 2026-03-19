import axios from 'axios';
import { useAuthStore } from '../features/auth/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const store = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry && store.refreshToken) {
      originalRequest._retry = true;
      const refreshed = await store.refreshSession();
      if (refreshed) {
        originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
        return api(originalRequest);
      }
    }

    throw error;
  }
);

export default api;
