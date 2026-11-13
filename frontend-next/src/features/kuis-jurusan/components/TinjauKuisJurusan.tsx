"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ExternalLink, Mail, UserRound } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import LoadErrorNotice from "@/shared/components/admin/LoadErrorNotice";
import { StatusBadge } from "@/shared/components/admin/Badge";
import { FormChoiceChips } from "@/shared/components/form/FormChoiceChips";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { loadErrorMessage } from "@/features/admin";
import { toast } from "@/shared/lib/toast";
import { useKuisRecord, useReviewKuis } from "../hooks/useKuisAdmin";
import { toAdminKuis } from "../services/kuis.service";
import { tinjauKuisSchema, type TinjauKuisFormValues } from "../validation/tinjau-kuis.schema";

interface TinjauKuisJurusanProps {
  id: string;
}

export function TinjauKuisJurusan({ id }: TinjauKuisJurusanProps) {
  const router = useRouter();
  const record = useKuisRecord(id);
  const review = useReviewKuis(id);
  const kuis = useMemo(() => (record.data ? toAdminKuis(record.data) : null), [record.data]);

  const form = useForm<TinjauKuisFormValues>({
    resolver: zodResolver(tinjauKuisSchema),
    defaultValues: { hasil: "", catatanSiswa: "", catatanInternal: "" },
    values: kuis ? { hasil: kuis.hasilLabel ?? "", catatanSiswa: kuis.catatanSiswa, catatanInternal: kuis.catatanInternal } : undefined,
  });
  const hasil = useWatch({ control: form.control, name: "hasil" });

  if (record.isError) return <LoadErrorNotice message={loadErrorMessage(record.error)} backHref="/admin/kuis-jurusan" />;

  if (!kuis) {
    return <p className="flex items-center justify-center gap-2 py-24 text-[15px] text-[#64748b]" role="status">Memuat log kuis...</p>;
  }

  const options = kuis.skor.map((score) => score.code);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await review.mutateAsync({
        final_major: kuis.skor.find((score) => score.code === values.hasil)?.slug ?? null,
        public_note: values.catatanSiswa || null,
        admin_note: values.catatanInternal || null,
      });
      toast.success(`Tinjauan disimpan. Hasil akhir: ${values.hasil}.`);
      setTimeout(() => router.push("/admin/kuis-jurusan"), 1200);
    } catch (error) {
      form.setError("root", { message: error instanceof Error ? error.message : "Gagal menyimpan tinjauan." });
    }
  });

  return (
    <>
      <button type="button" onClick={() => router.push("/admin/kuis-jurusan")} className="adm-btn adm-btn--text mb-4 px-0">
        <ArrowLeft aria-hidden="true" />
        <span>Kembali</span>
      </button>

      <form onSubmit={onSubmit} noValidate>
        <article className="app-card stepform">
          <header className="space-y-5 p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[15px] text-[#475569]">
                Status: <StatusBadge status={kuis.status} />
              </span>
              <time className="text-[15px] text-[#64748b]">{kuis.waktu}</time>
            </div>
            <div className="flex flex-wrap items-center gap-4 rounded-[14px] bg-[#f8fafc] p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f0] text-[#475569]">
                <UserRound size={22} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[18px] font-semibold text-[#0f172a]">{kuis.nama}</span>
                {kuis.email ? (
                  <a href={`mailto:${kuis.email}`} className="inline-flex items-center gap-1.5 text-[14px] text-[#2563eb] hover:underline">
                    <Mail size={14} aria-hidden="true" />
                    {kuis.email}
                  </a>
                ) : (
                  <span className="text-[14px] text-[#64748b]">Tidak mengisi email</span>
                )}
              </span>
              <Link href={`/kuis-jurusan/hasil/${kuis.kode}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#2563eb] hover:underline">
                Kode {kuis.kode}
                <ExternalLink size={14} aria-hidden="true" />
              </Link>
            </div>
          </header>

          <div className="stepform__body border-t border-[#e2e8f0] lg:p-8">
            <section>
              <h2 className="field__label field__label--caps">Hasil pencocokan sistem ({kuis.metode})</h2>
              <p className="mb-4 text-[15px] text-[#475569]">
                Rekomendasi: <strong className="text-[#0f172a]">{kuis.rekomendasiLabel}</strong>
                {kuis.alternatifLabel ? (
                  <>
                    {" "}
                    · Alternatif: <strong className="text-[#0f172a]">{kuis.alternatifLabel}</strong>
                  </>
                ) : null}
              </p>
              <ul className="space-y-3">
                {kuis.skor.map((score) => (
                  <li key={score.slug}>
                    <div className="flex items-center justify-between gap-4 text-[15px]">
                      <span className="font-semibold text-[#0f172a]">
                        {score.code} <span className="font-normal text-[#64748b]">— {score.name}</span>
                      </span>
                      <span className="text-[#475569]">
                        {score.points !== undefined ? `${score.points}/${score.max_points} poin · ` : ""}
                        <strong className="text-[#0f172a]">{score.percentage}%</strong>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                      <div className={`h-full rounded-full ${score.slug === kuis.rekomendasi ? "bg-[#2563eb]" : "bg-[#93c5fd]"}`} style={{ width: `${score.percentage}%` }} />
                    </div>
                    {score.reason ? <p className="mt-1.5 text-[13px] leading-relaxed text-[#64748b]">{score.reason}</p> : null}
                  </li>
                ))}
              </ul>
              {kuis.analisis ? <p className="mt-4 rounded-[12px] bg-[#f8fafc] p-4 text-[15px] leading-relaxed text-[#334155]">{kuis.analisis}</p> : null}
            </section>

            <section>
              <h2 className="field__label field__label--caps">Jawaban ({kuis.jawaban.length} soal)</h2>
              <ol className="divide-y divide-[#e2e8f0] rounded-[12px] border border-[#e2e8f0]">
                {kuis.jawaban.map((item, index) => (
                  <li key={item.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <span>
                      <span className="block text-[14px] text-[#64748b]">
                        {index + 1}. {item.soal}
                      </span>
                      <span className="mt-0.5 block text-[16px] whitespace-pre-line text-[#0f172a]">{item.jawaban}</span>
                    </span>
                    {item.jurusan.length > 0 ? (
                      <span className="flex shrink-0 flex-wrap gap-1.5">
                        {item.jurusan.map(({ code, points }) => (
                          <span
                            key={code}
                            className={`rounded-md px-2 py-0.5 text-[12px] font-semibold ${points === 1 ? "bg-[#f1f5f9] text-[#475569]" : "bg-[#dbeafe] text-[#1d4ed8]"}`}
                          >
                            {code}
                            {points ? ` +${points}` : ""}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-5 border-t border-[#e2e8f0] pt-6">
              <h2 className="stepform__section-title">Tinjau &amp; koreksi rekomendasi</h2>
              <FormChoiceChips control={form.control} name="hasil" label="Jurusan yang disarankan" options={options} />
              <p className="-mt-3 text-[13px] text-[#64748b]">
                {hasil === kuis.rekomendasiLabel ? "Sesuai rekomendasi sistem." : `Mengganti rekomendasi sistem (${kuis.rekomendasiLabel}) menjadi ${hasil}.`}
              </p>
              <FormTextarea
                control={form.control}
                name="catatanSiswa"
                label="Catatan untuk siswa (opsional, tampil di halaman hasil)"
                rows={3}
                placeholder="Contoh: Dari jawabanmu, kamu juga punya minat kuat di desain. Coba ikut kelas uji minat DKV saat MPLS."
              />
              <FormTextarea
                control={form.control}
                name="catatanInternal"
                label="Catatan internal (opsional, tidak tampil ke siswa)"
                rows={3}
                placeholder="Contoh: Sudah dihubungi lewat email, orang tua ingin konsultasi saat pendaftaran."
              />
              {form.formState.errors.root ? (
                <p role="alert" className="rounded-[10px] bg-[#fee2e2] px-4 py-3 text-[14px] font-medium text-[#b91c1c]">
                  {form.formState.errors.root.message}
                </p>
              ) : null}
            </section>
          </div>

          <footer className="stepform__footer justify-end">
            <AdminButton variant="ghost" onClick={() => router.push("/admin/kuis-jurusan")}>
              Batal
            </AdminButton>
            <AdminButton type="submit" loading={review.isPending}>
              Simpan Tinjauan
            </AdminButton>
          </footer>
        </article>
      </form>
    </>
  );
}
