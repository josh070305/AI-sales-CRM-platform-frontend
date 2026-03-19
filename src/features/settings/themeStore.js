import { create } from 'zustand';

const initialTheme = localStorage.getItem('crm-theme') || 'dark';

export const useThemeStore = create((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem('crm-theme', theme);
    set({ theme });
  },
}));
