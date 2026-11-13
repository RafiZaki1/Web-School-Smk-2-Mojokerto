"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import { FormText } from "@/shared/components/form/FormText";
import { ApiError } from "@/shared/lib/http/api-error";
import { useAuthStore } from "@/shared/stores/auth.store";
import { homePathFor, ROLES } from "@/shared/types/user.type";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../validation/login.schema";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const login = useLogin();
  const [notice, setNotice] = useState<string | null>(searchParams.get("expired") ? "Sesi login berakhir, silakan masuk kembali." : null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "" },
  });

  // Sudah login: langsung ke panel
  useEffect(() => {
    if (token) router.replace(homePathFor(role));
  }, [token, role, router]);

  const onSubmit = form.handleSubmit(async (values) => {
    setNotice(null);
    try {
      const { user } = await login.mutateAsync({ login: values.login.trim(), password: values.password });
      const target = searchParams.get("next");
      // Akun TU hanya boleh kembali ke halaman /admin/tu; tujuan lain diganti meja kerja TU
      const allowedPrefix = user.role === ROLES.adminTu ? "/admin/tu" : "/admin";
      router.replace(target?.startsWith(allowedPrefix) ? target : homePathFor(user.role));
    } catch (error) {
      const wrongCredentials = error instanceof ApiError && (error.status === 422 || error.status === 401);
      setNotice(wrongCredentials ? "Username/email atau password salah." : error instanceof Error ? error.message : "Gagal masuk, coba lagi.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {notice ? (
        <p role="alert" className="rounded-[10px] bg-[#fee2e2] px-4 py-3 text-[14px] font-medium text-[#b91c1c]">
          {notice}
        </p>
      ) : null}
      <FormText
        control={form.control}
        name="login"
        icon={UserRound}
        placeholder="Username"
        autoComplete="username"
      />
      <FormText control={form.control} name="password" icon={Lock} type="password" placeholder="Password" autoComplete="current-password" />
      <div className="text-right">
        <a href="mailto:smkn2mr@gmail.com?subject=Reset%20password%20panel%20admin" className="text-[14px] font-medium text-[#2563eb] hover:underline">
          Lupa password?
        </a>
      </div>
      <AdminButton type="submit" icon={ArrowRight} iconPosition="right" loading={login.isPending} className="w-full">
        Masuk
      </AdminButton>
    </form>
  );
}
