import Image from "next/image";
import { MessageCircleQuestion, Sparkles } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { SADA_AVATAR } from "@/features/chatbot";
import { getTranslator } from "@/shared/lib/i18n/server";
import { OrnamentSparkle, OrnamentSquiggle } from "@/shared/components/ui/Ornaments";

const PREVIEW: { role: "bot" | "user"; text: string }[] = [
  { role: "bot", text: "Kalau kamu dikasih modal dan alat lengkap, kamu paling pengen bikin karya apa?" },
  { role: "user", text: "Aku suka ngedit video dan bikin poster buat OSIS." },
  { role: "bot", text: "Seru! Sepertinya kamu cocok di DKV. Yuk lanjut ke pertanyaan berikutnya ✨" },
];

/** Ajakan kuis minat jurusan di beranda, tepat sebelum daftar jurusan. */
export default async function KuisJurusanSection() {
  const t = await getTranslator();
  return (
    <section id="kuis-jurusan" className="section">
      <div className="page-container">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[32px] bg-navy-deep px-6 py-10 text-white sm:px-10 lg:grid-cols-2 lg:gap-14 lg:px-14 lg:py-14">
          <div className="relative">
          <OrnamentSquiggle className="absolute -top-16 -right-16 w-56 text-white/[0.06] lg:w-72" />
          <OrnamentSparkle className="absolute top-6 right-8 w-7 text-sun lg:top-8 lg:right-12 lg:w-9" />
          <OrnamentSparkle className="absolute top-16 right-20 w-4 text-tint-strong lg:top-20 lg:right-24" />
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase lg:text-sm">
              <Sparkles size={16} aria-hidden="true" />
              {t("Kuis Minat Jurusan")}
            </span>
            <h2 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-[44px]">{t("Bingung mau pilih jurusan apa?")}</h2>
            <p className="mt-4 max-w-[540px] text-base leading-relaxed text-white/85 sm:text-lg">
              {t(
                "Ngobrol santai dengan SADA tentang hobi, pelajaran favorit, dan cita-citamu. Jawab dengan kata-katamu sendiri, lalu lihat jurusan mana yang paling cocok untukmu.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/kuis-jurusan" variant="accent">
                {t("Mulai Ngobrol")}
              </Button>
              <span className="flex items-center gap-2 text-sm text-white/75">
                <MessageCircleQuestion size={18} aria-hidden="true" />
                {t("7 pertanyaan · sekitar 3-5 menit")}
              </span>
            </div>
          </div>

          <div className="relative space-y-3 rounded-3xl bg-white/10 p-4 backdrop-blur-sm sm:p-6" aria-hidden="true">
            {PREVIEW.map((item) =>
              item.role === "user" ? (
                <p key={item.text} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-sun px-4 py-3 text-[15px] text-sun-ink">
                  {t(item.text)}
                </p>
              ) : (
                <div key={item.text} className="flex items-start gap-2.5">
                  <Image src={SADA_AVATAR} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full bg-white object-contain p-0.5" />
                  <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-card px-4 py-3 text-[15px] text-[var(--color-heading)]">{t(item.text)}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
