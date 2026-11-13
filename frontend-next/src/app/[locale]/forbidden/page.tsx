import type { Metadata } from "next";
import Link from "next/link";
import { ErrorState } from "@/shared/components/feedback/StatusState";
import { getTranslator } from "@/shared/lib/i18n/server";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("Akses Ditolak"),
    robots: { index: false, follow: false },
  };
}

export default async function ForbiddenPage() {
  const t = await getTranslator();
  return (
    <div className="relative isolate px-4 py-16">
      <PageOrnaments theme="akses" />
      <ErrorState
        title="Akses ditolak (403)"
        description="Akun Anda tidak memiliki izin untuk membuka halaman ini."
        action={
          <Link href="/" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
            {t("Kembali ke beranda")}
          </Link>
        }
      />
    </div>
  );
}
