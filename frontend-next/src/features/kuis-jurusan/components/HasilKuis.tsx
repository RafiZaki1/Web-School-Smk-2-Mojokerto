import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Briefcase, CircleHelp, ListChecks, MessageCircle, Quote, RotateCcw, Target } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import SalinTautanHasil from "./SalinTautanHasil";
import type { QuizResult, QuizScore } from "../types/kuis.type";
import { localizeDate } from "@/shared/lib/i18n/date";
import { getLocale, getTranslator } from "@/shared/lib/i18n/server";
import type { Translator } from "@/shared/lib/i18n/translate";

const POINT_LABEL: Record<number, string> = { 2: "sangat berkaitan", 1: "sedikit berkaitan" };

function PointBadge({ points }: { points: number }) {
  return <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ${points === 2 ? "bg-primary text-white" : "bg-surface text-primary"}`}>+{points}</span>;
}

/** "2× sangat berkaitan (+4) dan 1× sedikit berkaitan (+1)" dari rincian poin. */
function describeBreakdown(breakdown: QuizScore["breakdown"], t: Translator): string {
  return [2, 1]
    .map((points) => {
      const count = breakdown.filter((row) => row.points === points).length;
      return count ? t("{jumlah} jawaban {label} (+{poin})", { jumlah: count, label: t(POINT_LABEL[points]), poin: count * points }) : null;
    })
    .filter(Boolean)
    .join(` ${t("dan")} `);
}

/** Penjelasan rumus persentase memakai angka milik siswa ini. */
function CaraHitung({ totalAnswered, maxPoints, t }: { totalAnswered: number; maxPoints: number; t: Translator }) {
  return (
    <div className="mt-4 rounded-xl bg-surface-alt px-4 py-4 text-sm leading-relaxed text-[var(--color-body)] sm:text-base">
      <p className="font-semibold text-ink">{t("Cara menghitung persentase")}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        <li>
          {t("Setiap jawabanmu dinilai untuk tiap jurusan:")} <strong className="text-ink">+2</strong> {t("kalau sangat berkaitan,")}{" "}
          <strong className="text-ink">+1</strong> {t("kalau sedikit berkaitan,")} <strong className="text-ink">0</strong> {t("kalau tidak berkaitan.")}
        </li>
        <li>
          {t("Kamu menjawab {jumlah} pertanyaan, jadi poin maksimal tiap jurusan adalah {jumlah} × 2 =", { jumlah: totalAnswered })}{" "}
          <strong className="text-ink">{t("{jumlah} poin", { jumlah: maxPoints })}</strong>.
        </li>
        <li>
          {t("Persentase = poin yang didapat ÷ {maks} × 100%. Contoh: 6 poin berarti 6 ÷ {maks} × 100% = {contoh}%.", {
            maks: maxPoints,
            contoh: Math.round((6 / maxPoints) * 100),
          })}
        </li>
      </ol>
      <p className="mt-2">
        {t(
          "Tiap jurusan dihitung terpisah, jadi jumlah semuanya tidak harus 100%. Persentase ini bukan nilai ujian, hanya petunjuk seberapa kuat jawabanmu mengarah ke tiap jurusan.",
        )}
      </p>
    </div>
  );
}

function ScoreBars({ scores, highlight, answers, t }: { scores: QuizScore[]; highlight: string; answers: QuizResult["answers"]; t: Translator }) {
  const byId = Object.fromEntries(answers.map((item, index) => [item.questionId, { ...item, number: index + 1 }]));

  return (
    <ul className="mt-5 space-y-6">
      {scores.map(({ major, percentage, reason, evidence, points, maxPoints, breakdown }) => (
        <li key={major.id}>
          <div className="flex items-center justify-between gap-4 text-base sm:text-lg">
            <Link href={`/jurusan/${major.id}`} className="font-semibold text-ink hover:text-primary">
              {t(major.code)} <span className="font-normal text-muted">— {t(major.fullName)}</span>
            </Link>
            <span className="font-semibold text-ink">{percentage}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface">
            <div className={`h-full rounded-full ${major.id === highlight ? "bg-primary" : "bg-accent/60"}`} style={{ width: `${percentage}%` }} />
          </div>

          {points !== null && maxPoints !== null ? (
            <p className="mt-2 text-sm text-ink sm:text-[15px]">
              <strong>{t("{poin} dari {maks} poin = {persen}%", { poin: points, maks: maxPoints, persen: percentage })}</strong>
              <span className="text-[var(--color-body)]">
                {" "}
                · {breakdown.length ? t("dari {rincian}.", { rincian: describeBreakdown(breakdown, t) }) : t("tidak ada jawaban yang berkaitan dengan jurusan ini.")}
              </span>
            </p>
          ) : evidence.length > 0 ? (
            <p className="mt-2 text-sm font-semibold text-ink sm:text-[15px]">{t("{jumlah} jawaban mengarah ke sini.", { jumlah: evidence.length })}</p>
          ) : null}
          {reason && <p className="mt-1 text-sm leading-relaxed text-[var(--color-body)] sm:text-[15px]">{t(reason)}</p>}

          {breakdown.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-semibold text-primary">{t("Lihat jawaban yang dihitung")}</summary>
              <ul className="mt-2 space-y-2">
                {breakdown.map((row) => (
                  <li key={row.questionId} className="flex items-start gap-3 rounded-lg bg-surface-alt px-3 py-2 text-sm sm:text-[15px]">
                    <PointBadge points={row.points} />
                    <span>
                      <span className="text-muted">{t("Jawaban {nomor}:", { nomor: byId[row.questionId]?.number ?? "" })} </span>
                      <span className="text-ink">“{byId[row.questionId]?.answer}”</span>
                      <span className="text-muted"> ({t(POINT_LABEL[row.points])})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Bukti kenapa jurusan teratas cocok: hitungan poin dan kutipan jawaban yang mendukungnya. */
function AlasanCocok({
  score,
  answers,
  totalAnswered,
  isCorrected,
  t,
}: {
  score: QuizScore;
  answers: QuizResult["answers"];
  totalAnswered: number;
  isCorrected: boolean;
  t: Translator;
}) {
  const { major, percentage, reason, evidence, points, maxPoints, breakdown } = score;
  const pointsById = Object.fromEntries(breakdown.map((row) => [row.questionId, row.points]));
  const quoted = answers.filter((item) => evidence.includes(item.questionId)).sort((a, b) => (pointsById[b.questionId] ?? 0) - (pointsById[a.questionId] ?? 0));

  return (
    <section className="rounded-2xl border border-line px-5 py-5 sm:px-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-heading sm:text-xl">
        <CircleHelp size={20} className="text-primary" aria-hidden="true" />
        {t("Kenapa {kode} cocok untukmu?", { kode: t(major.code) })}
      </h2>

      {quoted.length > 0 ? (
        <p className="mt-2 text-base leading-relaxed text-[var(--color-body)] sm:text-lg">
          {t("Dari {total} jawabanmu,", { total: totalAnswered })} <strong className="text-ink">{t("{jumlah} jawaban", { jumlah: quoted.length })}</strong>{" "}
          {t("berkaitan dengan bidang {bidang}", { bidang: t(major.fullName) })}
          {points !== null && maxPoints !== null ? (
            <>
              : {describeBreakdown(breakdown, t)}. {t("Totalnya")}{" "}
              <strong className="text-ink">{t("{poin} dari {maks} poin", { poin: points, maks: maxPoints })}</strong>, {t("jadi kecocokannya")}{" "}
              <strong className="text-ink">{percentage}%</strong>.
            </>
          ) : (
            <>, {t("sehingga kecocokannya {persen}%.", { persen: percentage })}</>
          )}
          {reason ? ` ${t(reason)}` : ""}
        </p>
      ) : (
        <p className="mt-2 text-base text-[var(--color-body)] sm:text-lg">
          {isCorrected
            ? t("Jurusan {kode} disarankan oleh guru BK setelah meninjau seluruh jawabanmu.", { kode: t(major.code) })
            : t(reason) || t("Jawabanmu belum banyak menyinggung bidang tertentu, jadi {kode} dipilih dari kecocokan tertinggi yang ada.", { kode: t(major.code) })}
        </p>
      )}

      {quoted.length > 0 && (
        <ul className="mt-4 space-y-3">
          {quoted.map((item) => (
            <li key={item.questionId} className="rounded-xl border-l-4 border-primary bg-surface-alt px-4 py-3">
              <p className="text-sm text-muted">{t(item.question)}</p>
              <p className="mt-1 flex gap-2 text-base text-ink sm:text-lg">
                <Quote size={16} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
                <span className="flex-1 whitespace-pre-line">{item.answer}</span>
                {pointsById[item.questionId] ? <PointBadge points={pointsById[item.questionId]} /> : null}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Halaman hasil kuis: rekomendasi, alasan kecocokan, koreksi guru BK, rincian skor, dan log jawaban. */
export default async function HasilKuis({ result }: { result: QuizResult }) {
  const [t, locale] = await Promise.all([getTranslator(), getLocale()]);
  const { primary, alternative, systemRecommendation, allScores, answers } = result;
  if (!primary) return null;
  const { major } = primary;
  const maxPoints = allScores[0]?.maxPoints ?? null;
  // Kode jurusan yang terkait dengan tiap jawaban, untuk label di daftar jawaban
  const answerMajors = Object.fromEntries(
    answers.map((item) => [item.questionId, allScores.filter((score) => score.evidence.includes(item.questionId)).map((score) => score.major.code)]),
  );

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-navy-deep px-6 py-8 text-white sm:px-10">
        <p className="text-sm font-semibold tracking-wide text-white/70 uppercase">{t("Hasil Kuis Minat Jurusan")}</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
          {result.name ? t("Hai {nama}, ini jurusan yang cocok untukmu", { nama: result.name }) : t("Ini jurusan yang cocok untukmu")}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80 sm:text-base">
          <span>
            {t("Kode hasil:")} <strong className="tracking-[0.12em] text-white">{result.code}</strong>
          </span>
          <span>{t("Diisi {tanggal}", { tanggal: localizeDate(result.createdLabel, locale) })}</span>
          <SalinTautanHasil code={result.code} />
        </div>
        <p className="mt-3 text-sm text-white/70">{t("Simpan kode atau link ini untuk membuka kembali hasilmu kapan saja.")}</p>
      </header>

      {(result.isCorrected || result.publicNote) && (
        <section className="rounded-2xl border border-green-200 bg-green-50 px-5 py-5 sm:px-6 dark:border-green-400/30 dark:bg-green-400/10">
          <h2 className="flex items-center gap-2 text-base font-bold text-green-800 sm:text-lg dark:text-green-200">
            <BadgeCheck size={20} aria-hidden="true" />
            {result.reviewedLabel
              ? t("Sudah ditinjau guru BK pada {tanggal}", { tanggal: localizeDate(result.reviewedLabel, locale) })
              : t("Sudah ditinjau guru BK")}
          </h2>
          {result.isCorrected && systemRecommendation && (
            <p className="mt-2 text-base text-green-900 dark:text-green-100">
              {t("Rekomendasi awal sistem adalah")} <strong>{t(systemRecommendation.major.code)}</strong>.{" "}
              {t("Setelah ditinjau, jurusan yang disarankan untukmu adalah")} <strong>{t(major.code)}</strong>.
            </p>
          )}
          {result.publicNote && <p className="mt-2 text-base whitespace-pre-line text-green-900 dark:text-green-100">{result.publicNote}</p>}
        </section>
      )}

      <section className="grid gap-6 overflow-hidden rounded-3xl bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-8 lg:p-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card lg:aspect-[3/4]">
          <Image src={major.image} alt={t("Jurusan {nama}", { nama: t(major.code) })} fill sizes="(min-width: 1024px) 280px, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase">
            {t(result.isCorrected ? "Rekomendasi Guru BK" : "Rekomendasi Utama")}
          </span>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold text-heading sm:text-4xl">{t(major.code)}</h2>
              <p className="mt-1 text-lg font-semibold text-ink sm:text-xl">{t(major.fullName)}</p>
              {major.tagline && <p className="text-sm text-accent sm:text-base">{t(major.tagline)}</p>}
            </div>
            <p className="text-right">
              <span className="block text-3xl font-bold text-primary sm:text-4xl">{primary.percentage}%</span>
              <span className="text-sm text-muted">{t("kecocokan")}</span>
            </p>
          </div>

          {(result.analysis || major.whyMatch) && (
            <>
              <h3 className="mt-6 flex items-center gap-2 text-sm font-bold text-ink sm:text-base">
                <Target size={18} className="text-primary" aria-hidden="true" />
                {t("Analisis Kecocokan")}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-[var(--color-body)] sm:text-lg">{result.analysis || t(major.whyMatch)}</p>
            </>
          )}

          {major.careers.length > 0 && (
            <>
              <h3 className="mt-6 flex items-center gap-2 text-sm font-bold text-ink sm:text-base">
                <Briefcase size={18} className="text-primary" aria-hidden="true" />
                {t("Peluang Karir")}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {major.careers.map((career) => (
                  <li key={career} className="rounded-full bg-card px-3 py-1.5 text-sm text-ink sm:text-[15px]">
                    {t(career)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <AlasanCocok score={primary} answers={answers} totalAnswered={result.totalAnswered} isCorrected={result.isCorrected} t={t} />

      {alternative && (
        <section className="rounded-2xl border border-line px-5 py-5 sm:px-6">
          <p className="text-xs font-bold text-muted sm:text-sm">{t("Opsi Alternatif")}</p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-heading sm:text-xl">
              {t(alternative.major.code)} <span className="font-normal text-muted">— {t(alternative.major.fullName)}</span>
            </h2>
            <span className="font-semibold text-ink">{alternative.percentage}%</span>
          </div>
          {alternative.major.alternativeWhyMatch && <p className="mt-2 text-base leading-relaxed text-[var(--color-body)]">{t(alternative.major.alternativeWhyMatch)}</p>}
          <Link href={`/jurusan/${alternative.major.id}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:text-base">
            {t("Lihat jurusan {kode}", { kode: t(alternative.major.code) })}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      )}

      <section className="rounded-2xl border border-line px-5 py-5 sm:px-6">
        <h2 className="text-lg font-bold text-heading sm:text-xl">{t("Rincian Kecocokan")}</h2>
        {maxPoints ? (
          <CaraHitung totalAnswered={result.totalAnswered} maxPoints={maxPoints} t={t} />
        ) : (
          <p className="mt-2 text-sm text-muted">{t("Hasil ini dibuat dengan versi kuis lama, jadi rincian poinnya belum tersedia. Isi ulang kuis untuk melihat hitungannya.")}</p>
        )}
        <ScoreBars scores={allScores} highlight={major.id} answers={answers} t={t} />
      </section>

      <section className="rounded-2xl border border-line px-5 py-5 sm:px-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-heading sm:text-xl">
          <ListChecks size={20} className="text-primary" aria-hidden="true" />
          {t("Jawaban Kamu")}
        </h2>
        <ol className="mt-4 divide-y divide-line">
          {answers.map((item, index) => (
            <li key={item.questionId} className="py-3">
              <p className="text-sm text-muted sm:text-base">
                {index + 1}. {t(item.question)}
              </p>
              <p className="mt-1 text-base whitespace-pre-line text-ink sm:text-lg">{item.answer}</p>
              {answerMajors[item.questionId]?.length > 0 && (
                <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted sm:text-sm">
                  {t("Mengarah ke:")}
                  {answerMajors[item.questionId].map((code) => (
                    <span key={code} className="rounded-md bg-surface px-2 py-0.5 font-semibold text-primary">
                      {code}
                    </span>
                  ))}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href={`/jurusan/${major.id}`} withArrow>
          {t("Lihat Jurusan {kode}", { kode: t(major.code) })}
        </Button>
        <Button href="/spmb" variant="outline">
          {t("Info Pendaftaran")}
        </Button>
        <Button href="/kuis-jurusan" variant="outline">
          <span className="inline-flex items-center gap-2">
            <RotateCcw size={16} aria-hidden="true" />
            {t("Isi Ulang Kuis")}
          </span>
        </Button>
      </div>

      <p className="flex items-start gap-3 rounded-2xl bg-surface-alt px-5 py-4 text-sm leading-relaxed text-[var(--color-body)] sm:text-base">
        <MessageCircle size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <span>
          {t("Hasil kuis ini hanya gambaran awal dan akan ditinjau guru BK. Diskusikan juga dengan orang tua, atau")}{" "}
          <Link href="/sada" className="font-semibold text-primary hover:underline">
            {t("tanya SADA")}
          </Link>
          , {t("asisten virtual sekolah.")}
        </span>
      </p>
    </div>
  );
}
