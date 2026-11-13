import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicPage from "@/shared/components/layout/PublicPage";
import BackLink from "@/shared/components/ui/BackLink";
import { HasilKuis, getQuizResult } from "@/features/kuis-jurusan";
import { getTranslator } from "@/shared/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: `${t("Hasil Kuis Jurusan")} - SMKN 2 Kota Mojokerto`,
    // Halaman hasil berisi nama siswa, jangan diindeks mesin pencari
    robots: { index: false, follow: false },
  };
}

export default async function HasilKuisPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [result, t] = await Promise.all([getQuizResult(code), getTranslator()]);

  if (result === undefined) notFound();

  return (
    <PublicPage className="bg-card" contentClassName="font-ui" ornaments="kuisHasil">
      <BackLink href="/kuis-jurusan" className="text-muted hover:text-primary">
        Kembali ke kuis
      </BackLink>
      <div className="mt-6">
        {result ? (
          <HasilKuis result={result} />
        ) : (
          <p
            role="alert"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-base text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200"
          >
            {t("Hasil kuis belum bisa dimuat karena server sedang tidak bisa dihubungi. Coba muat ulang halaman ini beberapa saat lagi.")}
          </p>
        )}
      </div>
    </PublicPage>
  );
}
