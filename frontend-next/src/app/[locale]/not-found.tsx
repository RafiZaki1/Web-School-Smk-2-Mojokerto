import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/shared/components/feedback/StatusState";
import { getTranslator } from "@/shared/lib/i18n/server";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const t = await getTranslator();
  return (
    <div className="px-4 py-16">
      <EmptyState
        title="Halaman tidak ditemukan"
        description="Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan."
        action={
          <Link href="/" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
            {t("Kembali ke beranda")}
          </Link>
        }
      />
    </div>
  );
}
