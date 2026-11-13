import "@/styles/admin/admin.css";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export const metadata = {
  title: "Masuk Panel Admin - SMKN 2 Kota Mojokerto",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="admin-app relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-10">
      <Image src="/images/sejarah/gedung.jpg" alt="" aria-hidden="true" fill sizes="100vw" className="scale-110 object-cover blur-[6px]" />
      <div className="absolute inset-0 bg-white/10" aria-hidden="true" />

      <PageOrnaments theme="login" behind={false} />
      <section className="relative w-full max-w-[448px] overflow-hidden rounded-3xl bg-white shadow-[0_24px_48px_rgba(15,23,42,0.25)] sm:rounded-[32px]">
        <div className="relative h-[136px] w-full sm:h-[160px]">
          <Image src="/images/login/card-top.jpg" alt="Gedung SMK Negeri 2 Kota Mojokerto" fill sizes="448px" className="object-cover" />
        </div>
        <div className="px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-7">
          <h1 className="text-center text-xl font-bold text-[#0f172a] sm:text-2xl">Masuk ke Panel Admin</h1>
          <p className="mt-1.5 mb-6 text-center text-sm text-[#94a3b8] sm:mt-2 sm:mb-7 sm:text-[15px]">Khusus untuk admin pengelola website sekolah</p>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-6 text-center text-[14px] text-[#64748b]">© 2026 SMK Negeri 2 Mojokerto</p>
        </div>
      </section>
    </main>
  );
}
