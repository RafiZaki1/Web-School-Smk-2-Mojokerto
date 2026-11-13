import type { Metadata } from "next";
import { Clock, GraduationCap, MessageCircleQuestion } from "lucide-react";
import PublicPage from "@/shared/components/layout/PublicPage";
import ContactPanel from "@/shared/components/ui/ContactPanel";
import JurusanIcon from "@/shared/components/ui/JurusanIcon";
import { getJurusanList } from "@/features/jurusan";
import { CekHasilKuis, IKON_JURUSAN, KuisJurusanChat, getQuizQuestions } from "@/features/kuis-jurusan";
import { getTranslator } from "@/shared/lib/i18n/server";

const TITLE = "Kuis Pilih Jurusan - SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Ngobrol singkat dengan SADA tentang hobi dan minatmu untuk menemukan jurusan yang paling cocok di SMKN 2 Kota Mojokerto.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function KuisJurusanPage() {
  const [jurusan, quiz, t] = await Promise.all([getJurusanList(), getQuizQuestions(), getTranslator()]);
  const stats = [
    { icon: MessageCircleQuestion, value: t("{jumlah} Pertanyaan", { jumlah: quiz.questions.length }), desc: t("Dijawab dengan kata-katamu sendiri") },
    { icon: Clock, value: t("{jumlah} Menit", { jumlah: quiz.estimatedMinutes }), desc: t("Santai, seperti chatting") },
    { icon: GraduationCap, value: t("{jumlah} Jurusan", { jumlah: jurusan.length }), desc: jurusan.map((item) => t(item.code)).join(", ") },
  ];

  return (
    <PublicPage className="bg-card" contentClassName="font-ui" ornaments="kuis">
      <div className="max-w-[820px]">
        <span className="inline-flex rounded-full bg-surface px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase lg:text-sm">{t("Kuis Minat")}</span>
        <h1 className="mt-3 text-3xl leading-tight font-bold text-heading sm:text-4xl lg:text-[44px]">{t("Bingung pilih jurusan? Ngobrol dulu yuk!")}</h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--color-body)] sm:text-lg">
          {t(
            "SADA akan menanyakan beberapa hal tentang hobi dan minatmu. Ceritakan dengan kata-katamu sendiri, lalu kami cocokkan dengan jurusan yang paling sesuai. Nama dan email boleh dikosongkan.",
          )}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <KuisJurusanChat questions={quiz.questions} maxLength={quiz.maxLength} offline={quiz.offline} />

        <aside className="space-y-6">
          <section className="rounded-3xl border border-line bg-card p-5 sm:p-6">
            <ul className="space-y-4">
              {stats.map(({ icon: Icon, value, desc }) => (
                <li key={value} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span>
                    <strong className="block text-base text-heading">{value}</strong>
                    <span className="text-sm text-muted">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
              {jurusan.map((item) => (
                <li key={item.id} className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm font-semibold text-ink">
                  <JurusanIcon name={IKON_JURUSAN[item.id] ?? "Sparkles"} size={16} className="text-primary" />
                  {t(item.code)}
                </li>
              ))}
            </ul>
          </section>
          <CekHasilKuis />
        </aside>
      </div>

      <ContactPanel className="mt-10 lg:mt-12" />
    </PublicPage>
  );
}
