"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { History, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "@/shared/components/ui/Button";
import { readRiwayat, type RiwayatItem } from "../utils/riwayat-kuis";
import { cekHasilSchema, type CekHasilFormValues } from "../validation/cek-hasil.schema";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { localizeDate } from "@/shared/lib/i18n/date";

// Riwayat dibaca dari localStorage hanya di browser; saat SSR selalu kosong
const subscribe = () => () => {};
const getSnapshot = () => JSON.stringify(readRiwayat());
const getServerSnapshot = () => "[]";

/** Buka lagi hasil kuis: ketik kode, atau pilih dari riwayat di perangkat ini. */
export default function CekHasilKuis() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const riwayat = useMemo<RiwayatItem[]>(() => JSON.parse(raw) as RiwayatItem[], [raw]);

  const form = useForm<CekHasilFormValues>({ resolver: zodResolver(cekHasilSchema), defaultValues: { kode: "" } });
  const kodeError = form.formState.errors.kode?.message;

  const open = form.handleSubmit(({ kode }) => router.push(`/kuis-jurusan/hasil/${encodeURIComponent(kode.toUpperCase())}`));

  return (
    <section className="rounded-3xl border border-line bg-card p-5 sm:p-8">
      <h2 className="text-lg font-bold text-heading sm:text-xl">{t("Sudah pernah mengisi?")}</h2>
      <p className="mt-1 text-sm text-muted sm:text-base">{t("Masukkan kode hasil yang kamu terima untuk melihat kembali jawaban dan rekomendasi jurusanmu.")}</p>

      <form onSubmit={open} noValidate className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="kuis-kode" className="sr-only">
          {t("Kode hasil kuis")}
        </label>
        <input
          id="kuis-kode"
          {...form.register("kode")}
          aria-invalid={Boolean(kodeError)}
          aria-describedby={kodeError ? "kuis-kode-error" : undefined}
          placeholder={t("Contoh: K7MX2QPA")}
          maxLength={12}
          autoComplete="off"
          className="w-full rounded-xl border border-line bg-card px-4 py-3 text-base tracking-[0.12em] text-ink uppercase placeholder:tracking-normal placeholder:normal-case focus:border-primary"
        />
        <Button type="submit" variant="outline" className="shrink-0">
          <span className="inline-flex items-center gap-2">
            <Search size={18} aria-hidden="true" />
            {t("Lihat Hasil")}
          </span>
        </Button>
      </form>
      {kodeError ? (
        <p id="kuis-kode-error" role="alert" className="mt-2 text-sm text-[#b91c1c] dark:text-red-300">
          {t(kodeError)}
        </p>
      ) : null}

      {riwayat.length > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink sm:text-base">
            <History size={18} className="text-primary" aria-hidden="true" />
            {t("Riwayat di perangkat ini")}
          </h3>
          <ul className="mt-3 divide-y divide-line">
            {riwayat.map((item) => (
              <li key={item.code}>
                <Link href={`/kuis-jurusan/hasil/${item.code}`} className="flex items-center justify-between gap-4 py-3 hover:text-primary">
                  <span>
                    <span className="block font-semibold text-ink">{item.name || t("Tanpa nama")}</span>
                    <span className="text-sm text-muted">
                      {localizeDate(item.date, locale)} · {t("Kode {kode}", { kode: item.code })}
                    </span>
                  </span>
                  {item.major && <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-sm font-semibold text-primary">{item.major}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
