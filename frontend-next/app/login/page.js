import "../../styles/admin/admin.css";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Masuk Panel Admin - SMKN 2 Kota Mojokerto",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="admin-app relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-10">
      <img src="/images/sejarah/gedung.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover blur-[6px]" />
      <div className="absolute inset-0 bg-white/10" aria-hidden="true" />

      <section className="relative w-full max-w-[448px] overflow-hidden rounded-[32px] bg-white shadow-[0_24px_48px_rgba(15,23,42,0.25)]">
        <img src="/images/login/card-top.jpg" alt="Gedung SMK Negeri 2 Kota Mojokerto" className="h-[160px] w-full object-cover" />
        <div className="px-8 pt-8 pb-7">
          <h1 className="text-center text-2xl font-bold text-[#0f172a]">Masuk ke Panel Admin</h1>
          <p className="mt-2 mb-7 text-center text-[15px] text-[#64748b]">Khusus untuk admin pengelola website sekolah</p>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-6 text-center text-[14px] text-[#94a3b8]">© 2026 SMK Negeri 2 Mojokerto</p>
        </div>
      </section>
    </main>
  );
}
