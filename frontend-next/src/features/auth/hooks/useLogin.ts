"use client";

import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/login.api";
import { useAuthStore } from "@/shared/stores/auth.store";

// Login admin. Error ditangani form (mis. kata sandi salah), jadi error global dilewati.
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: ({ login, password }: { login: string; password: string }) => loginApi({ login, password }),
    meta: { skipGlobalError: true },
    onSuccess: ({ token, user }) => setSession(token, user),
  });
}
