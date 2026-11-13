"use client";

import { useId, useState } from "react";
import { Calculator } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { bacaNilai, formatNilai, hitungGabungan, posisiNilai, type PosisiNilai } from "../utils/nilai-gabungan";

const KESIMPULAN: Record<PosisiNilai, string> = {
  jarang: "Luar biasa! Hanya sedikit sekali pendaftar yang nilainya di atas 90.",
  tinggi: "Nilaimu di atas rata-rata pendaftar tahun lalu. Peluangmu kuat!",
  dominan: "Nilaimu masuk rentang rata-rata pendaftar tahun lalu (70–80).",
  bawah: "Masih di bawah rata-rata tahun lalu, tapi tetap berpeluang sesuai daya tampung jurusan.",
};

function NilaiInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = useId();
  const salah = value.trim() !== "" && bacaNilai(value) === null;
  return (
    <label htmlFor={id} className="grid gap-1.5">
      <span className="text-sm font-semibold text-heading">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0–100"
        aria-invalid={salah}
        className={`w-full rounded-xl border bg-card px-4 py-3 font-mono text-lg text-ink tabular-nums transition-colors placeholder:text-base placeholder:text-muted/60 focus:border-primary ${
          salah ? "border-[#b91c1c] dark:border-red-300" : "border-line"
        }`}
      />
    </label>
  );
}

/** Kalkulator nilai gabungan jalur prestasi akademik; dihitung di browser tanpa server. */
export default function SpmbKalkulator() {
  const { t } = useTranslation();
  const [rapor, setRapor] = useState("");
  const [tka, setTka] = useState("");

  const nilaiRapor = bacaNilai(rapor);
  const nilaiTka = bacaNilai(tka);
  const gabungan = nilaiRapor !== null && nilaiTka !== null ? hitungGabungan(nilaiRapor, nilaiTka) : null;

  return (
    <div className="mt-8 rounded-2xl border border-line bg-card p-5 shadow-xs sm:p-6">
      <h3 className="flex items-center gap-2 text-base font-bold text-heading sm:text-lg">
        <Calculator size={20} className="shrink-0 text-primary" aria-hidden="true" />
        {t("Hitung Nilai Gabunganmu")}
      </h3>

      <div className="mt-5 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.3fr]">
        <NilaiInput label={t("Rata-rata rapor (60%)")} value={rapor} onChange={setRapor} />
        <NilaiInput label={t("Nilai TKA (40%)")} value={tka} onChange={setTka} />

        <div className="flex flex-col justify-center rounded-xl bg-tint/50 px-5 py-4 sm:col-span-2 lg:col-span-1" aria-live="polite">
          {gabungan === null ? (
            <p className="text-sm text-muted">{t("Isi kedua nilai, hasilnya muncul di sini.")}</p>
          ) : (
            <>
              <p className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-primary tabular-nums">{formatNilai(gabungan)}</span>
                <span className="text-sm font-semibold text-muted">{t("Nilai Gabungan")}</span>
              </p>
              <p className="mt-1 text-sm text-body">{t(KESIMPULAN[posisiNilai(gabungan)])}</p>
            </>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">{t("Hanya perkiraan dari data tahun lalu, bukan jaminan diterima.")}</p>
    </div>
  );
}
