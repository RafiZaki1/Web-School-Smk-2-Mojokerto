"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, UserRound } from "lucide-react";
import AdminButton from "./ui/AdminButton";
import { InputText } from "./ui/Fields";
import { adminApi, adminToken } from "@/lib/api/adminApi";

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState(searchParams.get("expired") ? "Sesi login berakhir, silakan masuk kembali." : null);

  // Sudah login: langsung ke panel
  useEffect(() => {
    if (adminToken.get()) router.replace("/admin");
  }, [router]);

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!values.username.trim()) next.username = "Username atau email wajib diisi";
    if (!values.password) next.password = "Password wajib diisi";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setNotice(null);
    try {
      await adminApi.login(values.username.trim(), values.password);
      const target = searchParams.get("next");
      router.replace(target?.startsWith("/admin") ? target : "/admin");
    } catch (error) {
      setLoading(false);
      setNotice(error.status === 422 || error.status === 401 ? "Username/email atau password salah." : error.message || "Gagal masuk, coba lagi.");
    }
  };

  const update = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {notice ? (
        <p role="alert" className="rounded-[10px] bg-[#fee2e2] px-4 py-3 text-[14px] font-medium text-[#b91c1c]">
          {notice}
        </p>
      ) : null}
      <InputText icon={UserRound} placeholder="Username" aria-label="Username atau email" autoComplete="username" value={values.username} onChange={update("username")} error={errors.username} />
      <InputText
        icon={Lock}
        type="password"
        placeholder="Password"
        aria-label="Password"
        autoComplete="current-password"
        value={values.password}
        onChange={update("password")}
        error={errors.password}
      />
      <div className="text-right">
        <a href="mailto:smkn2mr@gmail.com?subject=Reset%20password%20panel%20admin" className="text-[14px] font-medium text-[#2563eb] hover:underline">
          Lupa password?
        </a>
      </div>
      <AdminButton type="submit" icon={ArrowRight} iconPosition="right" loading={loading} className="w-full">
        Masuk
      </AdminButton>
    </form>
  );
}
