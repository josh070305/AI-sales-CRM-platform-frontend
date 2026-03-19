import { create } from 'zustand';
import api from '../../services/api';
import { disconnectSocket } from '../../services/socket';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isBootstrapping: true,
  isAuthenticated: false,
  bootstrap: async () => {
    try {
      const refreshResponse = await api.post('/auth/refresh');
      const refreshedTokens = refreshResponse.data.data;
      const response = await api.get('/auth/me');
      set({
        user: response.data.data,
        accessToken: refreshedTokens?.accessToken || null,
        refreshToken: refreshedTokens?.refreshToken || null,
        isAuthenticated: true,
        isBootstrapping: false,
      });
    } catch (error) {
      set({ isBootstrapping: false, isAuthenticated: false, user: null, accessToken: null, refreshToken: null });
    }
  },
  login: async (payload) => {
    const response = await api.post('/auth/login', payload);
    set({
      user: response.data.data.user,
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken,
      isAuthenticated: true,
    });
    return response.data.data.user;
  },
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    set({
      user: response.data.data.user,
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken,
      isAuthenticated: true,
    });
    return response.data.data.user;
  },
  refreshSession: async () => {
    try {
      const response = await api.post('/auth/refresh', {
        refreshToken: get().refreshToken,
      });
      set({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      });
      return true;
    } catch (error) {
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      disconnectSocket();
      return false;
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout', { refreshToken: get().refreshToken });
    } finally {
      disconnectSocket();
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    }
  },
  updateUser: (user) => set({ user }),
}));
