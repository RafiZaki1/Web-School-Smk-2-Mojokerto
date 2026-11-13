"use client";

import { Fragment, memo, useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type HTMLAttributes } from "react";
import Image from "next/image";
import { Check, Clock, Maximize, Megaphone, Minimize, Pause, Play, Printer, RotateCcw, School, X, type LucideIcon } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { localizeDate } from "@/shared/lib/i18n/date";
import type { Adegan, AjakanData, AkhirData, DataData, JalurData, JurusanData, NaskahVideo, PenutupData, PraData } from "../constants/spmb-video-script";
// Gaya video SPMB hanya dimuat di halaman yang memakai komponen ini, tidak ikut di CSS semua halaman
import "@/styles/ui/spmb-video.css";

const UKURAN: Record<"landscape" | "portrait", [number, number]> = {
  landscape: [1280, 720],
  portrait: [720, 1080],
};
const LAYAR_HP = "(max-width: 767px)";
const EMBLEM = "/images/brand/emblem-smkn2.png";
const FOTO_AJAKAN = ["/carousel/foto-2.webp", "/carousel/foto-4.webp", "/carousel/foto-9.webp"];
const TAGLINE = ["Disiplin", "Berakhlak", "Berprestasi"];
const IKON_LANGKAH: Record<string, LucideIcon> = {
  pengumuman: Megaphone,
  cetak: Printer,
  "daftar-ulang": School,
};

// Browser lama (Safari/WebKit) masih memakai nama awalan webkit untuk layar penuh
type WebkitDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void>;
};
type WebkitElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

const jeda = (detik: number): CSSProperties => ({ "--d": `${detik}s` }) as CSSProperties;

// Teks naskah yang disusun dengan angka dari data dikembalikan ke kunci kamus bervariabel
const POLA_NASKAH: [RegExp, string][] = [
  [/^Langkah (\d+)$/, "Langkah {n}"],
  [/^(\d+) jalur pendaftaran$/, "{n} jalur pendaftaran"],
  [/^Data (\d{4})$/, "Data {n}"],
];

/** Terjemahan teks naskah video; gabungan "a · b" diterjemahkan per bagian, label tanggal ikut bahasa. */
function useTeksNaskah() {
  const { t, locale } = useTranslation();
  return useCallback(
    (teks: string) =>
      teks
        .split(" · ")
        .map((bagian) => {
          const pola = POLA_NASKAH.find(([regex]) => regex.test(bagian));
          if (pola)
            return t(pola[1], {
              n: bagian.match(pola[0])?.[1] ?? "",
            });
          return localizeDate(t(bagian), locale);
        })
        .join(" · "),
    [t, locale],
  );
}

function formatWaktu(detik: number): string {
  const total = Math.max(0, Math.floor(detik));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

const elemenLayarPenuh = (): Element | null => (document as WebkitDocument).fullscreenElement ?? (document as WebkitDocument).webkitFullscreenElement ?? null;
const sedangLayarPenuh = (): boolean => Boolean(elemenLayarPenuh()?.classList.contains("sv-player"));

function langgananLayar(onChange: () => void): () => void {
  const media = window.matchMedia(LAYAR_HP);
  media.addEventListener("change", onChange);
  window.addEventListener("resize", onChange);
  document.addEventListener("fullscreenchange", onChange);
  document.addEventListener("webkitfullscreenchange", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("resize", onChange);
    document.removeEventListener("fullscreenchange", onChange);
    document.removeEventListener("webkitfullscreenchange", onChange);
  };
}

/** "portrait" (layar HP) atau "landscape", ditambah ":fs" saat layar penuh */
function bacaLayar(): string {
  if (sedangLayarPenuh()) return `${window.innerHeight > window.innerWidth ? "portrait" : "landscape"}:fs`;
  return window.matchMedia(LAYAR_HP).matches ? "portrait" : "landscape";
}

const tanpaLangganan = () => () => {};
const dukungLayarPenuh = (): boolean => Boolean((document as WebkitDocument).fullscreenEnabled || (document as WebkitDocument).webkitFullscreenEnabled);

function keluarLayarPenuh(): void {
  if (!sedangLayarPenuh()) return;
  const doc = document as WebkitDocument;
  Promise.resolve((doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(doc)).catch(() => {});
}

/* ---------- Adegan ---------- */

interface KepalaProps {
  chip?: string;
  eyebrow?: string;
  judul: string;
}

function Kepala({ chip, eyebrow, judul }: KepalaProps) {
  const tn = useTeksNaskah();
  return (
    <div className="sv-head">
      {chip && (
        <span className="sv-chip sv-wp" style={jeda(0.1)}>
          {tn(chip)}
        </span>
      )}
      {eyebrow && (
        <span className="sv-eyebrow sv-fi" style={jeda(0.1)}>
          {tn(eyebrow)}
        </span>
      )}
      <p className="sv-title sv-fu" style={jeda(0.3)}>
        {tn(judul)}
      </p>
    </div>
  );
}

function Logo({ kecil = false, ...props }: { kecil?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`sv-lockup${kecil ? " sv-lockup--sm" : ""} sv-pp`} {...props}>
      <Image src={EMBLEM} alt="" width={64} height={64} />
      <span>
        SMK Negeri 2<small>Kota Mojokerto</small>
      </span>
    </div>
  );
}

function Pembuka({ durasi }: { durasi: number }) {
  const { t } = useTranslation();
  return (
    <div className="sv-scene sv-opening" style={{ "--len": `${durasi}s` } as CSSProperties}>
      <div className="sv-deco sv-deco--photo" style={{ backgroundImage: "url(/hero-bg.webp)" }} />
      <div className="sv-deco sv-deco--radial" />
      <span className="sv-deco sv-ring" style={jeda(0.2)} />
      <span className="sv-deco sv-ring" style={jeda(0.55)} />
      <Logo style={jeda(0.35)} />
      <p className="sv-tagline">
        {TAGLINE.map((kata, index) => (
          <Fragment key={kata}>
            {index > 0 && <i className="sv-pp" style={jeda(1.15 + index * 0.45)} />}
            <span className="sv-fu" style={jeda(1.3 + index * 0.45)}>
              {t(kata)}
            </span>
          </Fragment>
        ))}
      </p>
      <span className="sv-sunbar" style={jeda(2.7)} />
    </div>
  );
}

function Ajakan({ data }: { data: AjakanData & { langkah: number } }) {
  const { t } = useTranslation();
  return (
    <div className="sv-scene sv-hook">
      <div className="sv-deco sv-deco--grid" />
      <div className="sv-deco sv-tiles">
        {FOTO_AJAKAN.map((foto, index) => (
          <span
            key={foto}
            className="sv-tile"
            style={{
              backgroundImage: `url(${foto})`,
              ...jeda(0.15 + index * 0.25),
            }}
          />
        ))}
      </div>
      <div className="sv-hook__text">
        <span className="sv-chip sv-wp" style={jeda(0.2)}>
          SPMB {data.tahun}
        </span>
        <p className="sv-title sv-fu" style={jeda(0.7)}>
          {t("Mau jadi bagian dari")}{" "}
          <span className="sv-hl">
            SMKN 2
            <svg viewBox="0 0 200 20" preserveAspectRatio="none">
              <path style={jeda(1.4)} d="M2 14 C 50 4, 120 4, 198 12" />
            </svg>
          </span>
          ?
        </p>
        <p className="sv-hook__lead sv-fu" style={jeda(1.7)}>
          {t("Ini alur pendaftarannya, cukup {menit} menit.", {
            menit: data.menit,
          })}
        </p>
      </div>
    </div>
  );
}

function Jurusan({ data }: { data: JurusanData & { langkah: number } }) {
  const { t } = useTranslation();
  return (
    <div className="sv-scene">
      <div className="sv-deco sv-deco--grid" />
      <Kepala
        eyebrow="Kompetensi keahlian"
        judul={t("Pilih 1 dari {jumlah} kompetensi keahlian", {
          jumlah: data.daftar.length,
        })}
      />
      <div className="sv-jurusan" style={{ "--n": data.daftar.length } as CSSProperties}>
        {data.daftar.map((item) => (
          <figure
            key={item.id}
            className="sv-jcard sv-fu"
            style={
              {
                ...jeda(item.muncul),
                "--d2": `${item.sorot}s`,
              } as CSSProperties
            }
          >
            <Image src={item.gambar ?? EMBLEM} alt="" width={400} height={300} />
            <figcaption>
              <b>{t(item.kode)}</b>
              <span>{t(item.nama)}</span>
            </figcaption>
            <i className="sv-jcard__glow" />
          </figure>
        ))}
      </div>
      <p className="sv-hint sv-fu" style={jeda(data.hintPada)}>
        <i>?</i>
        <span>
          {t("Masih bingung? Coba")} <b>{t("Kuis Jurusan")}</b> {t("di website sekolah")}
        </span>
      </p>
    </div>
  );
}

function Pra({ data }: { data: PraData & { langkah: number } }) {
  const { t } = useTranslation();
  const tn = useTeksNaskah();
  const { pin } = data;
  return (
    <div className="sv-scene">
      <div className="sv-deco sv-deco--grid" />
      <Kepala chip={`Langkah ${data.langkah}`} judul={data.judul} />
      <div className={`sv-pra${pin ? " has-phone" : ""}`}>
        {pin && (
          <div className="sv-phone sv-fu" style={jeda(0.7)}>
            <small>{t("PIN pendaftaran")}</small>
            <span className="sv-pin">
              {pin.titik.map((detik) => (
                <span key={detik}>
                  <i className="sv-pp" style={jeda(detik)} />
                </span>
              ))}
            </span>
            <span className="sv-phone__ok sv-pp" style={jeda(pin.selesai)}>
              <Check strokeWidth={3} />
              {t("PIN didapat")}
            </span>
          </div>
        )}
        <ol className={`sv-checklist${data.baris.length > 5 ? " is-dense" : ""}`}>
          {data.baris.map((item) => (
            <li key={item.key} className="sv-crow sv-fu" style={jeda(item.muncul)}>
              <span className="sv-tick">
                <svg viewBox="0 0 52 52" style={jeda(item.centang)}>
                  <circle cx="26" cy="26" r="26" />
                  <path d="M16 27l7 7 13-15" />
                </svg>
              </span>
              <span className="sv-crow__text">
                <span className="sv-crow__title">{tn(item.judul)}</span>
                {item.info && <span className="sv-crow__meta">{tn(item.info)}</span>}
              </span>
              <span className="sv-date">
                <span className="sv-date__day">{tn(item.tanggal)}</span>
                {item.jam && <span className="sv-date__time">{item.jam}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Jalur({ data }: { data: JalurData & { langkah: number } }) {
  const { t } = useTranslation();
  const tn = useTeksNaskah();
  const { daftar, catatan } = data;
  return (
    <div className="sv-scene">
      <div className="sv-deco sv-deco--grid" />
      <Kepala chip={`Langkah ${data.langkah}`} judul="Pilih jalur pendaftaran" />
      <ol className="sv-path" style={{ "--n": daftar.length } as CSSProperties}>
        {daftar.map((item, index) => (
          <li key={item.id} className="sv-path__item">
            <span className="sv-path__month sv-fi" style={jeda(item.titik - 0.1)}>
              {tn(item.bulan)}
            </span>
            <span className="sv-path__node" style={jeda(item.titik)} />
            {index < daftar.length - 1 && (
              <>
                <span className="sv-path__rail" />
                <span
                  className="sv-path__link"
                  style={
                    {
                      ...jeda(item.garis),
                      "--g": `${item.garisDurasi}s`,
                    } as CSSProperties
                  }
                />
              </>
            )}
            <div className="sv-path__card sv-fu" style={jeda(item.titik + 0.15)}>
              {item.bulan && <span className="sv-path__eyebrow">{tn(item.bulan)}</span>}
              <span className="sv-path__name">{tn(item.label)}</span>
              <span className="sv-path__when">
                <span className="sv-path__label">{t("Pendaftaran")}</span>
                <span className="sv-path__date">{tn(item.daftar)}</span>
              </span>
              {item.pengumuman && (
                <span className="sv-path__ann">
                  {t("Pengumuman")} <b>{tn(item.pengumuman)}</b>
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
      {catatan && (
        <p className="sv-note sv-fu" style={jeda(data.catatanPada)}>
          <Clock />
          <span>
            {t(catatan.online ? "Pendaftaran online dibuka pukul" : "Pendaftaran dibuka pukul")} <b>{catatan.buka}</b> {t("dan ditutup pukul")}{" "}
            <b>{catatan.tutup}</b>
          </span>
        </p>
      )}
    </div>
  );
}

function Akhir({ data }: { data: AkhirData & { langkah: number } }) {
  const { t } = useTranslation();
  const tn = useTeksNaskah();
  return (
    <div className="sv-scene">
      <div className="sv-deco sv-deco--grid" />
      <Kepala chip={`Langkah ${data.langkah}`} judul="Setelah mendaftar" />
      <ol className="sv-steps" style={{ "--n": data.daftar.length } as CSSProperties}>
        {data.daftar.map((item, index) => {
          const Ikon = IKON_LANGKAH[item.key];
          return (
            <li key={item.key} className="sv-steps__item">
              <span className="sv-steps__icon sv-pp" style={jeda(item.muncul)}>
                <Ikon />
              </span>
              {index < data.daftar.length - 1 && <span className="sv-steps__link" style={jeda(item.muncul + 0.7)} />}
              <span className="sv-steps__text sv-fu" style={jeda(item.muncul + 0.2)}>
                <span className="sv-steps__title">{t(item.judul)}</span>
                {item.info && <span className="sv-steps__meta">{tn(item.info)}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="sv-note sv-note--center sv-fu" style={jeda(data.catatanPada)}>
        <span>
          {t("Tanggal lengkap tiap jalur ada di")} <b>{t("tabel jadwal")}</b> {t("di bawah video ini")}
        </span>
      </p>
    </div>
  );
}

function Data({ data }: { data: DataData & { langkah: number } }) {
  const { t } = useTranslation();
  const { batang, irisan, skala } = data;
  const judul =
    batang.length && irisan.length ? "Nilai & domisili siswa yang diterima" : batang.length ? "Nilai siswa yang diterima" : "Domisili siswa yang diterima";
  return (
    <div className="sv-scene">
      <div className="sv-deco sv-deco--grid" />
      <Kepala eyebrow={data.tahun ? `Data tahun sebelumnya · ${data.tahun}` : "Data tahun sebelumnya"} judul={judul} />
      <div className={`sv-data${batang.length && irisan.length ? "" : " sv-data--single"}`}>
        {irisan.length > 0 && (
          <figure className="sv-donut sv-fu" style={jeda(0.4)}>
            <span className="sv-donut__ring">
              <svg viewBox="0 0 260 260">
                <circle className="sv-donut__base" cx="130" cy="130" r="100" />
                {irisan.map((item) => (
                  <circle
                    key={item.label}
                    className="sv-donut__arc"
                    cx="130"
                    cy="130"
                    r="100"
                    style={{
                      stroke: item.warna,
                      "--len": item.panjang,
                      "--c": data.keliling,
                      "--off": -item.mulai,
                      ...jeda(item.tunda),
                    }}
                  />
                ))}
              </svg>
              <span className="sv-donut__mid">
                <b className="sv-pp" style={jeda(1.3)}>
                  {irisan[0].nilai}%
                </b>
                <span>{t(irisan[0].label)}</span>
              </span>
            </span>
            <ul className="sv-legend">
              {irisan.map((item) => (
                <li key={item.label}>
                  <i style={{ background: item.warna }} />
                  {t(item.label)} · {item.nilai}%
                </li>
              ))}
            </ul>
          </figure>
        )}
        {batang.length > 0 && (
          <div className="sv-bars">
            <span className="sv-bars__cap sv-fi" style={jeda(0.6)}>
              {t("Rata-rata nilai akhir yang diterima")}
            </span>
            {batang.map((item, index) => (
              <div key={item.nama} className="sv-bar sv-fu" style={jeda(0.8 + index * 0.15)}>
                <span className="sv-bar__code">{t(item.kode)}</span>
                <span className="sv-bar__track">
                  <span
                    className="sv-bar__fill"
                    style={{
                      width: `${item.persen}%`,
                      ...jeda(1 + index * 0.15),
                    }}
                  />
                </span>
                <span className="sv-bar__val">{item.teks}</span>
              </div>
            ))}
            <div className="sv-axis sv-fi" style={jeda(1.6)}>
              <span />
              <span className="sv-axis__scale">
                <span>{skala?.dari}</span>
                <span>{skala?.sampai}</span>
              </span>
              <span />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Penutup({ durasi, data }: { durasi: number; data: PenutupData & { langkah: number } }) {
  const { t } = useTranslation();
  return (
    <div className="sv-scene sv-closing" style={{ "--len": `${durasi}s` } as CSSProperties}>
      <div
        className="sv-deco sv-deco--photo"
        style={{
          backgroundImage: "url(/carousel/foto-9.webp)",
          opacity: 0.16,
        }}
      />
      <span className="sv-deco sv-slash sv-slash--a sv-wp" style={jeda(0.1)} />
      <span className="sv-deco sv-slash sv-slash--b sv-wp" style={jeda(0.3)} />
      <Logo kecil style={jeda(0.2)} />
      <p className="sv-title sv-fu" style={jeda(0.6)}>
        {t("Sampai jumpa di SMKN 2 Kota Mojokerto!")}
      </p>
      {data.kontak.length > 0 && (
        <ul className="sv-contacts">
          {data.kontak.map((item, index) => (
            <li key={item.label} className="sv-fu" style={jeda(1.2 + index * 0.25)}>
              {item.label} <b>{item.nilai}</b>
            </li>
          ))}
        </ul>
      )}
      <p className="sv-tagline sv-tagline--sm sv-fi" style={jeda(2.4)}>
        {TAGLINE.map((kata, index) => (
          <Fragment key={kata}>
            {index > 0 && <i />}
            <span>{t(kata)}</span>
          </Fragment>
        ))}
      </p>
    </div>
  );
}

// Tiap adegan dirender sesuai id-nya; data sudah sesuai tipe karena union berdiskriminasi
const AdeganView = memo(function AdeganView({ adegan }: { adegan: Adegan }) {
  switch (adegan.id) {
    case "pembuka":
      return <Pembuka durasi={adegan.durasi} />;
    case "ajakan":
      return <Ajakan data={adegan.data} />;
    case "jurusan":
      return <Jurusan data={adegan.data} />;
    case "pra":
      return <Pra data={adegan.data} />;
    case "jalur":
      return <Jalur data={adegan.data} />;
    case "akhir":
      return <Akhir data={adegan.data} />;
    case "data":
      return <Data data={adegan.data} />;
    case "penutup":
      return <Penutup durasi={adegan.durasi} data={adegan.data} />;
  }
});

/* ---------- Lapisan di atas layar ---------- */

function Sampul({ naskah, onPlay }: { naskah: NaskahVideo; onPlay: () => void }) {
  const { t } = useTranslation();
  const tn = useTeksNaskah();
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={t("Putar video alur SPMB {tahun}, durasi {durasi}", {
        tahun: naskah.tahun,
        durasi: formatWaktu(naskah.total),
      })}
      className="group absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center overflow-hidden px-6 text-center text-white focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-sun"
    >
      <span className="absolute inset-0 block opacity-30">
        <Image src="/hero-bg.webp" alt="" fill sizes="100vw" className="object-cover" />
      </span>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(12,74,104,0.5)_0%,rgba(8,53,75,0.96)_72%)]" />
      <span className="relative flex flex-col items-center">
        <Image src={EMBLEM} alt="" width={64} height={64} className="h-12 w-12 sm:h-16 sm:w-16" />
        <span className="mt-4 rounded-md bg-sun px-3 py-1.5 font-ui text-[11px] font-bold text-[var(--color-sun-ink)] sm:text-xs">
          SPMB {naskah.tahun}
        </span>
        <span className="mt-3 max-w-[16ch] font-heading text-[26px] leading-tight font-bold sm:text-4xl lg:text-5xl">
          {t("Alur pendaftaran dalam {menit} menit", {
            menit: naskah.menit,
          })}
        </span>
        {naskah.ringkas && <span className="mt-3 text-sm text-white/80 sm:text-base">{tn(naskah.ringkas)}</span>}
        <span className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-sun text-navy-deep shadow-[0_0_0_10px_rgba(247,213,29,0.2)] transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
          <Play size={30} fill="currentColor" strokeWidth={0} className="translate-x-0.5" aria-hidden="true" />
        </span>
        <span className="mt-3 font-ui text-xs font-semibold text-white/75">
          {t("Putar")} · {formatWaktu(naskah.total)}
        </span>
      </span>
    </button>
  );
}

function Akhiran({ onReplay, onTutup }: { onReplay: () => void; onTutup: () => void }) {
  const { t } = useTranslation();
  const tutup = () => {
    keluarLayarPenuh();
    onTutup();
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-deep/85 px-6 text-center text-white backdrop-blur-[2px]">
      <p className="font-heading text-xl font-bold sm:text-3xl">{t("Sudah paham alurnya?")}</p>
      <p className="mt-2 max-w-[44ch] text-sm text-white/80 sm:text-base">
        {t("Cek tanggal tiap jalur di tabel jadwal, atau cari jurusan yang cocok lewat kuis.")}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button href="#jadwal" variant="accent" size="sm" onClick={tutup}>
          {t("Lihat jadwal lengkap")}
        </Button>
        <Button href="/kuis-jurusan" variant="outline" size="sm" onClick={tutup}>
          {t("Coba Kuis Jurusan")}
        </Button>
      </div>
      <button
        type="button"
        onClick={onReplay}
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
      >
        <RotateCcw size={16} aria-hidden="true" />
        {t("Putar ulang")}
      </button>
    </div>
  );
}

/* ---------- Pemutar ---------- */

interface SpmbVideoProps {
  naskah: NaskahVideo;
  className?: string;
  bukaOtomatis?: boolean;
}

/**
 * Video animasi alur SPMB. Bukan file video: adegan digambar dengan HTML/CSS dari
 * naskah (lihat spmb-video-script.ts), jadi isinya selalu sama dengan data jadwal.
 * Dengan bukaOtomatis, video hanya tampil sebagai popup: langsung diputar menutupi
 * seluruh layar saat halaman dibuka, tanpa kontrol, dan hilang setelah dilewati atau ditutup.
 */
export default function SpmbVideo({ naskah, className = "", bukaOtomatis = false }: SpmbVideoProps) {
  const { t } = useTranslation();
  const tn = useTeksNaskah();
  const { adegan, total } = naskah;
  const playerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const babRef = useRef<HTMLOListElement>(null);
  const isiRef = useRef<(HTMLSpanElement | null)[]>([]);
  const posisi = useRef({ waktu: 0, aktif: 0, detik: 0 });

  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "ended">(bukaOtomatis ? "playing" : "idle");
  const [aktif, setAktif] = useState(0);
  const [detik, setDetik] = useState(0);
  const [putaran, setPutaran] = useState(0);
  const [menutupi, setMenutupi] = useState(bukaOtomatis);

  const tutupLayar = useCallback(() => {
    setMenutupi(false);
    setStatus((nilai) => (nilai === "playing" ? "paused" : nilai));
  }, []);

  const layar = useSyncExternalStore<string | null>(langgananLayar, bacaLayar, () => null);
  const orientasi = layar?.split(":")[0] ?? null;
  const layarPenuh = layar?.endsWith(":fs") ?? false;
  const bisaLayarPenuh = useSyncExternalStore(tanpaLangganan, dukungLayarPenuh, () => false);

  const diputar = status !== "idle";
  const sekarang = adegan[aktif];

  const lukisProgres = useCallback(
    (waktu: number) => {
      adegan.forEach((item, index) => {
        const isi = isiRef.current[index];
        if (isi) isi.style.width = `${Math.min(1, Math.max(0, (waktu - item.mulai) / item.durasi)) * 100}%`;
      });
    },
    [adegan],
  );

  const lompat = useCallback(
    (index: number) => {
      const waktu = adegan[index].mulai;
      posisi.current = { waktu, aktif: index, detik: Math.floor(waktu) };
      setAktif(index);
      setDetik(Math.floor(waktu));
      setPutaran((nilai) => nilai + 1);
      setStatus("playing");
      lukisProgres(waktu);
    },
    [adegan, lukisProgres],
  );

  const putar = () => (status === "playing" ? setStatus("paused") : status === "paused" ? setStatus("playing") : lompat(0));

  const pilihBab = (index: number) => {
    lompat(index);
    const layarEl = screenRef.current;
    if (!layarEl) return;
    const kotak = layarEl.getBoundingClientRect();
    if (kotak.bottom < 80 || kotak.top > window.innerHeight - 80) {
      const halus = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      layarEl.scrollIntoView({
        behavior: halus ? "smooth" : "auto",
        block: "center",
      });
    }
  };

  const alihLayarPenuh = () => {
    if (sedangLayarPenuh()) return keluarLayarPenuh();
    const player = playerRef.current as WebkitElement | null;
    if (!player) return;
    Promise.resolve((player.requestFullscreen ?? player.webkitRequestFullscreen)?.call(player)).catch(() => {});
  };

  // Selama video menutupi layar: halaman tidak bisa digulir, navbar disembunyikan
  // (main ber-isolate, jadi z-index video tidak bisa melampaui navbar), dan Esc menutup video
  useEffect(() => {
    if (!menutupi) return undefined;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    root.setAttribute("data-sv-overlay", "");
    const tekan = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !sedangLayarPenuh()) tutupLayar();
    };
    window.addEventListener("keydown", tekan);
    return () => {
      root.style.overflow = overflow;
      root.removeAttribute("data-sv-overlay");
      window.removeEventListener("keydown", tekan);
    };
  }, [menutupi, tutupLayar]);

  // Jam pemutar: maju tiap frame selama diputar, berhenti di akhir video
  useEffect(() => {
    if (status !== "playing") return undefined;
    let frame = 0;
    let sebelumnya = performance.now();
    const maju = (kini: number) => {
      // Cap waktu frame pertama bisa lebih awal dari performance.now(), jadi selisihnya dijaga tidak negatif
      const waktu = Math.min(total, posisi.current.waktu + Math.min(0.25, Math.max(0, kini - sebelumnya) / 1000));
      sebelumnya = kini;
      posisi.current.waktu = waktu;

      const index = Math.max(
        0,
        adegan.findLastIndex((item) => waktu >= item.mulai),
      );
      if (index !== posisi.current.aktif) {
        posisi.current.aktif = index;
        setAktif(index);
      }
      if (Math.floor(waktu) !== posisi.current.detik) {
        posisi.current.detik = Math.floor(waktu);
        setDetik(Math.floor(waktu));
      }
      lukisProgres(waktu);

      if (waktu >= total) setStatus("ended");
      else frame = requestAnimationFrame(maju);
    };
    frame = requestAnimationFrame(maju);
    return () => cancelAnimationFrame(frame);
  }, [status, adegan, total, lukisProgres]);

  // Skalakan panggung ke ukuran layar pemutar
  useEffect(() => {
    const layarEl = screenRef.current;
    const panggung = stageRef.current;
    if (!layarEl || !panggung) return undefined;
    const [lebar, tinggi] = UKURAN[(orientasi ?? "landscape") as "landscape" | "portrait"];
    const pas = () => {
      const w = layarEl.clientWidth;
      const h = layarEl.clientHeight;
      const skala = Math.min(w / lebar, h / tinggi);
      panggung.style.transform = `translate(${(w - lebar * skala) / 2}px, ${(h - tinggi * skala) / 2}px) scale(${skala})`;
    };
    pas();
    const observer = new ResizeObserver(pas);
    observer.observe(layarEl);
    return () => observer.disconnect();
  }, [orientasi]);

  // Jeda otomatis saat pemutar digulir keluar layar
  useEffect(() => {
    const layarEl = screenRef.current;
    if (status !== "playing" || !layarEl) return undefined;
    let pernahTerlihat = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.2) pernahTerlihat = true;
        else if (pernahTerlihat) setStatus("paused");
      },
      { threshold: [0, 0.2] },
    );
    observer.observe(layarEl);
    return () => observer.disconnect();
  }, [status]);

  // Di HP daftar bagian bisa digeser; jaga bagian yang diputar tetap terlihat
  useEffect(() => {
    const daftar = babRef.current;
    const bab = daftar?.children[aktif] as HTMLElement | undefined;
    if (!daftar || !bab || daftar.scrollWidth <= daftar.clientWidth) return;
    daftar.scrollTo({
      left: bab.offsetLeft - (daftar.clientWidth - bab.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [aktif]);

  // Mode popup tidak punya tempat di halaman, jadi selesai begitu ditutup
  if (bukaOtomatis && !menutupi) return null;

  return (
    <div className={`grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-6 ${className}`}>
      <div ref={playerRef} className={`sv-player rounded-3xl border border-[var(--color-line)] bg-card p-2 sm:p-3${menutupi ? " sv-player--overlay" : ""}`}>
        <p className="sr-only">{t("Video animasi tanpa suara. Informasi yang sama tersedia di tabel jadwal dan data di bawah video.")}</p>
        <div ref={screenRef} className="sv-screen" data-orient={orientasi ?? undefined}>
          <div ref={stageRef} className={`sv-stage${status === "paused" ? " is-paused" : ""}`} aria-hidden="true">
            {diputar && <AdeganView key={`${aktif}-${putaran}`} adegan={sekarang} />}
            <Image src={EMBLEM} alt="" width={64} height={64} className={`sv-hud${diputar && sekarang.hud ? "" : " is-hidden"}`} />
          </div>

          {(status === "playing" || status === "paused") && (
            <button
              type="button"
              onClick={menutupi ? tutupLayar : putar}
              aria-label={t(menutupi ? "Lewati video" : status === "playing" ? "Jeda video" : "Lanjutkan video")}
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
            >
              {status === "paused" && (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-deep/70 text-white backdrop-blur-sm sm:h-20 sm:w-20">
                  <Play size={30} fill="currentColor" strokeWidth={0} className="translate-x-0.5" aria-hidden="true" />
                </span>
              )}
            </button>
          )}
          {status === "idle" && <Sampul naskah={naskah} onPlay={() => lompat(0)} />}
          {status === "ended" && <Akhiran onReplay={() => lompat(0)} onTutup={tutupLayar} />}
          {menutupi && (
            <button
              type="button"
              onClick={tutupLayar}
              autoFocus
              className="absolute top-3 right-3 z-30 flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 font-ui text-sm font-bold text-navy-deep shadow-lg transition-transform hover:scale-105 sm:top-4 sm:right-4"
            >
              {t(status === "ended" ? "Tutup" : "Lewati")}
              <X size={16} strokeWidth={2.75} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Kontrol tetap di DOM saat menutupi layar agar ref bilah progres tidak hilang */}
        <div className={`px-1 pt-3 pb-1 sm:px-2${menutupi ? " hidden" : ""}`}>
          <div className="flex gap-1">
            {adegan.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => lompat(index)}
                title={tn(item.judul)}
                aria-label={t("Putar bagian {nomor}: {judul}", {
                  nomor: index + 1,
                  judul: tn(item.judul),
                })}
                className="group relative h-4 min-w-0 cursor-pointer"
                style={{ flex: `${item.durasi} 1 0` }}
              >
                <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-[var(--sv-ui-track)] transition-[height] group-hover:h-2.5">
                  <span
                    ref={(el) => {
                      isiRef.current[index] = el;
                    }}
                    className="absolute inset-y-0 left-0 w-0 bg-[var(--sv-ui-fill)]"
                  />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={putar}
              aria-label={t(status === "playing" ? "Jeda" : "Putar")}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
            >
              {status === "playing" ? (
                <Pause size={20} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              ) : (
                <Play size={20} fill="currentColor" strokeWidth={0} className="translate-x-px" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => lompat(0)}
              aria-label={t("Putar dari awal")}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--sv-ui-fg)] transition-colors hover:bg-[var(--sv-ui-btn)]"
            >
              <RotateCcw size={18} aria-hidden="true" />
            </button>
            <span className="font-ui text-sm text-[var(--sv-ui-muted)] tabular-nums">
              {formatWaktu(detik)} / {formatWaktu(total)}
            </span>
            <span className="ml-auto hidden min-w-0 truncate text-sm font-semibold text-[var(--sv-ui-fg)] sm:block">
              {diputar
                ? tn([sekarang.label, sekarang.judul].filter(Boolean).join(" · "))
                : t("{jumlah} bagian", {
                    jumlah: adegan.length,
                  })}
            </span>
            {bisaLayarPenuh && (
              <button
                type="button"
                onClick={alihLayarPenuh}
                aria-label={t(layarPenuh ? "Keluar dari layar penuh" : "Layar penuh")}
                className="ml-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--sv-ui-fg)] transition-colors hover:bg-[var(--sv-ui-btn)] sm:ml-0"
              >
                {layarPenuh ? <Minimize size={18} aria-hidden="true" /> : <Maximize size={18} aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {!bukaOtomatis && (
        <nav aria-label={t("Bagian video")} className="min-w-0 xl:rounded-3xl xl:border xl:border-[var(--color-line)] xl:bg-card xl:p-5">
          <div className="hidden xl:block">
            <p className="font-heading text-lg font-bold text-ink">{t("Isi video")}</p>
            <p className="mt-0.5 text-sm text-[var(--color-muted)]">
              {t("{jumlah} bagian", { jumlah: adegan.length })} · {formatWaktu(total)}
            </p>
          </div>
          <ol
            ref={babRef}
            className="relative flex snap-x gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0 xl:mt-4 xl:grid-cols-1 xl:gap-1"
          >
            {adegan.map((item, index) => {
              const sedang = diputar && index === aktif && status !== "ended";
              const lewat = diputar && (index < aktif || status === "ended");
              return (
                <li key={item.id} className="w-[210px] shrink-0 snap-start sm:w-auto">
                  <button
                    type="button"
                    onClick={() => pilihBab(index)}
                    aria-current={sedang ? "step" : undefined}
                    className={`flex h-full w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      sedang
                        ? "border-primary bg-[var(--color-tint)]"
                        : "border-[var(--color-line)] bg-card hover:bg-[var(--color-surface-alt)] xl:border-transparent"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-ui text-xs font-bold ${
                        sedang
                          ? "bg-primary text-white"
                          : lewat
                            ? "bg-[var(--color-tint-strong)] text-primary-dark"
                            : "bg-[var(--color-surface)] text-[var(--color-body)]"
                      }`}
                    >
                      {lewat ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{tn(item.judul)}</span>
                      <span className="block font-ui text-xs text-[var(--color-muted)] tabular-nums">
                        {[tn(item.label), formatWaktu(item.mulai)].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </div>
  );
}
