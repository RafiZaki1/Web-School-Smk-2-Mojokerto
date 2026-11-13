import { Info } from "lucide-react";
import { ELEARNING, PORTAL_STEPS } from "@/features/portal-belajar/constants/portal-belajar-data";
import { getTranslator } from "@/shared/lib/i18n/server";

/** Tiga langkah mengakses kelas Bapak/Ibu Guru di e-Learning SMKN 2 Mojokerto. */
export default async function PortalSteps({ className = "" }: { className?: string }) {
  const t = await getTranslator();
  return (
    <section aria-labelledby="cara-akses-title" className={`rounded-3xl border border-line bg-card p-6 sm:p-8 lg:p-10 ${className}`}>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div>
          <p className="text-xs font-bold text-blue sm:text-[13px]">{t("Panduan Akses")}</p>
          <h2 id="cara-akses-title" className="mt-2 text-2xl font-bold text-heading sm:text-[28px]">
            {t("Cara mengakses kelas Bapak & Ibu Guru")}
          </h2>
        </div>
        <p className="max-w-[480px] text-base text-muted lg:text-right">
          {t("Login dilakukan langsung di portal {domain} menggunakan akun siswa atau guru.", { domain: ELEARNING.domain })}
        </p>
      </div>

      <ol className="mt-8 grid gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
        {PORTAL_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="flex gap-4 md:px-6 md:first:pl-0 md:last:pr-0 lg:px-8">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sun font-heading text-base font-bold text-sun-ink"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-heading">
                  <span className="sr-only">{t("Langkah {n}", { n: index + 1 })}:</span>
                  <Icon size={18} className="shrink-0 text-primary" aria-hidden="true" />
                  {t(step.title)}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{t(step.description)}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 flex items-start gap-3 rounded-2xl bg-tint px-4 py-3.5 text-[15px] leading-relaxed text-body sm:px-5">
        <Info size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <strong className="font-semibold text-heading">{t("Tips cepat untuk siswa:")}</strong>{" "}
          {t(
            "Kamu bisa langsung mengklik kartu nama Bapak/Ibu Guru di bawah ini untuk langsung menuju ke ruang kelas mata pelajaran beliau di smkn2mojokerto.my.id.",
          )}
        </span>
      </p>
    </section>
  );
}
