import { create } from 'zustand';

const useToastStore = create((set) => ({
  items: [],
  push: (toast) =>
    set((state) => ({
      items: [...state.items, { id: crypto.randomUUID(), ...toast }],
    })),
  dismiss: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));

export function useToast() {
  return useToastStore();
}
