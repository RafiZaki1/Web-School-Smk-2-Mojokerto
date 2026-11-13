import { useToastStore } from "@/shared/stores/toast.store";

// Pemanggilan dari luar React (mis. error handler) cukup memakai objek ini.
export const toast = {
  success: (message: string) => useToastStore.getState().push("success", message),
  error: (message: string) => useToastStore.getState().push("error", message),
  info: (message: string) => useToastStore.getState().push("info", message),
};
