import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
}

interface ToastState {
  items: ToastItem[];
  push: (variant: ToastVariant, message: string) => void;
  dismiss: (id: number) => void;
}

const TOAST_LIFETIME_MS = 5000;
let nextId = 0;

export const useToastStore = create<ToastState>()((set) => ({
  items: [],
  push: (variant, message) => {
    const id = ++nextId;
    set((state) => ({ items: [...state.items, { id, variant, message }] }));
    setTimeout(() => set((state) => ({ items: state.items.filter((item) => item.id !== id) })), TOAST_LIFETIME_MS);
  },
  dismiss: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}));
