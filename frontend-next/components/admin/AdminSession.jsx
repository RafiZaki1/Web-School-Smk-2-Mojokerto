"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminApi, adminToken } from "@/lib/api/adminApi";

const AdminSessionContext = createContext(null);

/**
 * Sesi panel admin: memastikan token ada & valid (GET /auth/me), lalu
 * menyediakan profil admin dan ringkasan (jumlah aspirasi baru, dsb.).
 */
export function AdminSessionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [ready, setReady] = useState(false);

  const refreshSummary = useCallback(async () => {
    try {
      setSummary(await adminApi.dashboard());
    } catch {
      // ringkasan opsional; menu tetap tampil
    }
  }, []);

  useEffect(() => {
    if (!adminToken.get()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    let active = true;
    adminApi
      .me()
      .then((profile) => {
        if (!active) return;
        setUser(profile);
        setReady(true);
        refreshSummary();
      })
      .catch(() => {
        // 401 sudah diarahkan ke /login oleh adminApi
      });
    return () => {
      active = false;
    };
    // Cek sesi sekali saat panel dibuka
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(async () => {
    await adminApi.logout().catch(() => {});
    router.replace("/login");
  }, [router]);

  return <AdminSessionContext.Provider value={{ user, summary, ready, refreshSummary, logout }}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  return useContext(AdminSessionContext) ?? { user: null, summary: null, ready: false, refreshSummary: () => {}, logout: () => {} };
}
