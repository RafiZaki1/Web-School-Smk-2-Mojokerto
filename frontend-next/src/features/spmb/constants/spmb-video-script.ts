import { CONTACT, SOCIAL_LINKS } from "@/shared/constants/navigation";
import type { Jurusan } from "@/features/jurusan";

/**
 * Naskah video alur SPMB. Semua isi adegan diambil dari konten SPMB (sumber yang
 * sama dengan tabel jadwal) dan daftar jurusan, jadi video ikut berubah saat data
 * diperbarui. Durasi tiap adegan menyesuaikan banyaknya data.
 */

export interface SpmbJadwalBaris {
  kegiatan: string;
  tanggal: string;
  jam: string;
  tempat: string;
}

export interface SpmbJalur {
  id: string;
  label: string;
  jadwal: SpmbJadwalBaris[];
}

// Jalur prestasi akademik: nilai akhir = 60% rata-rata rapor + 40% nilai TKA
export interface SpmbNilaiBaris {
  kompetensi: string;
  rapor: string;
  tka: string;
  rata: string;
  terendah: string;
  tertinggi: string;
  di_atas_90: number;
}

export interface SpmbDomisili {
  label: string;
  value: number;
  color: string;
}

export interface SpmbContent {
  jalur: SpmbJalur[];
  nilai: SpmbNilaiBaris[];
  nilai_tahun: number | string;
  domisili: SpmbDomisili[];
}

// Data per adegan (sudah ditambah `langkah` saat tersusun)
export interface JurusanItem {
  id: string;
  kode: string;
  nama: string;
  gambar: string | null;
  muncul: number;
  sorot: number;
}

export interface JurusanData {
  hintPada: number;
  daftar: JurusanItem[];
}

export interface PraBaris {
  key: string;
  judul: string;
  info: string;
  tanggal: string;
  jam: string;
  muncul: number;
  centang: number;
}

export interface PraData {
  judul: string;
  baris: PraBaris[];
  pin: { titik: number[]; selesai: number } | null;
}

export interface JalurItem {
  id: string;
  label: string;
  bulan: string;
  daftar: string;
  pengumuman: string;
  titik: number;
  garis: number;
  garisDurasi: number;
}

export interface JalurData {
  daftar: JalurItem[];
  catatan: { online: boolean; buka: string; tutup: string } | null;
  catatanPada: number;
}

export interface AkhirItem {
  key: string;
  judul: string;
  info: string;
  muncul: number;
}

export interface AkhirData {
  daftar: AkhirItem[];
  catatanPada: number;
}

export interface BatangItem {
  nama: string;
  teks: string;
  angka: number;
  kode?: string;
  persen?: number;
}

export interface IrisanItem extends SpmbDomisili {
  nilai: number;
  warna: string;
  panjang: number;
  mulai: number;
  tunda: number;
}

export interface DataData {
  tahun: string;
  batang: BatangItem[];
  skala: { dari: number; sampai: number } | null;
  irisan: IrisanItem[];
  keliling: number;
}

export interface AjakanData {
  tahun: number | string;
  menit: number;
}

export interface PenutupData {
  kontak: { label: string; nilai: string }[];
}

interface AdeganDasar<TId extends string, TData> {
  id: TId;
  judul: string;
  label: string;
  hud: boolean;
  durasi: number;
  mulai: number;
  data: TData & { langkah: number };
}

export type Adegan =
  | AdeganDasar<"pembuka", Record<string, never>>
  | AdeganDasar<"ajakan", AjakanData>
  | AdeganDasar<"jurusan", JurusanData>
  | AdeganDasar<"pra", PraData>
  | AdeganDasar<"jalur", JalurData>
  | AdeganDasar<"akhir", AkhirData>
  | AdeganDasar<"data", DataData>
  | AdeganDasar<"penutup", PenutupData>;

// Hasil satu adegan sebelum diberi posisi waktu
interface Isi<TData> {
  durasi: number;
  data: TData;
}

const BULAN = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
const WARNA_IRISAN = ["var(--sv-sun)", "var(--sv-tint)", "var(--sv-lime)", "var(--sv-blue)"];

const LANGKAH_AKHIR: { key: string; judul: string; pola: RegExp; kecuali?: RegExp }[] = [
  { key: "pengumuman", judul: "Pantau pengumuman", pola: /pengumuman/i, kecuali: /kuota/i },
  { key: "cetak", judul: "Cetak bukti penerimaan", pola: /cetak/i },
  { key: "daftar-ulang", judul: "Daftar ulang", pola: /daftar\s+ulang/i, kecuali: /latihan/i },
];

const teks = (nilai: unknown): string => String(nilai ?? "").trim();
const kosong = (nilai: unknown): boolean => !teks(nilai) || teks(nilai) === "-";
const kapital = (nilai: string): string => (nilai ? nilai[0].toUpperCase() + nilai.slice(1) : "");
const bulat = (detik: number): number => Math.round(detik * 100) / 100;
const normal = (nilai: string): string => teks(nilai).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** "18 - 23 Mei" → "18–23 Mei"; "-" atau kosong → "" */
const rentang = (nilai: unknown): string => (kosong(nilai) ? "" : teks(nilai).replace(/\s*-\s*/g, "–"));

/** Bulan pertama yang disebut: "28 Mei - 2 Juni" → "Mei" */
function bulanAwal(tanggal: string): string {
  const bulan = (teks(tanggal).toLowerCase().match(/[a-z]+/g) ?? []).find((kata) => BULAN.includes(kata));
  return kapital(bulan ?? "");
}

/** "Entry nilai rapor oleh kepala satuan pendidikan" → judul + pelaku */
function pecahKegiatan(kegiatan: string): { judul: string; pelaku: string } {
  const [judul, pelaku = ""] = teks(kegiatan).split(/\s+oleh\s+/i);
  return { judul: kapital(judul), pelaku: kapital(pelaku) };
}

const cari = (jadwal: SpmbJadwalBaris[] | undefined, pola: RegExp, kecuali?: RegExp): SpmbJadwalBaris | undefined =>
  (jadwal ?? []).find((baris) => pola.test(teks(baris.kegiatan)) && !kecuali?.test(teks(baris.kegiatan)));

/** Nilai yang sama di semua baris, atau "" bila berbeda-beda */
function nilaiSeragam<T extends object>(baris: T[], kunci: keyof T): string {
  const nilai = [...new Set(baris.map((item) => teks(item[kunci])).filter((item) => !kosong(item)))];
  return nilai.length === 1 ? nilai[0] : "";
}

/** Nama kompetensi di tabel nilai → kode jurusan ("Kuliner" → "Tata Boga") */
function kodeJurusan(nama: string, jurusan: Jurusan[]): string {
  const target = normal(nama);
  const cocok =
    jurusan.find((item) => normal(item.fullName) === target || normal(item.code) === target) ??
    jurusan.find((item) => normal(item.fullName).includes(target) || target.includes(normal(item.fullName)));
  if (cocok?.code) return cocok.code;
  const kata = teks(nama).split(/\s+/);
  return kata.length > 1 ? kata.map((item) => item[0]).join("").toUpperCase() : teks(nama);
}

function adeganJurusan(jurusan: Jurusan[]): Isi<JurusanData> | null {
  const daftar = jurusan.filter((item) => item?.code || item?.fullName).slice(0, 6);
  if (!daftar.length) return null;

  const sorotMulai = 1.6 + daftar.length * 0.2;
  const hintPada = bulat(sorotMulai + daftar.length * 0.6 + 0.4);
  return {
    durasi: hintPada + 2.6,
    data: {
      hintPada,
      daftar: daftar.map((item, index) => ({
        id: teks(item.id) || `${index}`,
        kode: teks(item.code) || teks(item.fullName),
        nama: teks(item.fullName),
        gambar: item.image,
        muncul: bulat(0.7 + index * 0.2),
        sorot: bulat(sorotMulai + index * 0.6),
      })),
    },
  };
}

function adeganPra(pra: SpmbJalur): Isi<PraData> {
  const jeda = Math.min(1.5, 6.5 / Math.min(pra.jadwal.length, 6));
  const baris: PraBaris[] = pra.jadwal.slice(0, 6).map((item, index) => {
    const { judul, pelaku } = pecahKegiatan(item.kegiatan);
    const muncul = 1 + index * jeda;
    return {
      key: `${index}-${judul}`,
      judul,
      info: [pelaku, teks(item.tempat)].filter((nilai) => !kosong(nilai)).join(" · "),
      tanggal: rentang(item.tanggal),
      jam: rentang(item.jam),
      muncul: bulat(muncul),
      centang: bulat(muncul + 0.8),
    };
  });

  // Animasi isi PIN di HP hanya muncul bila jadwal memang punya tahap pengambilan PIN
  let pin: PraData["pin"] = null;
  const indexPin = pra.jadwal.slice(0, 6).findIndex((item) => /\bpin\b/i.test(teks(item.kegiatan)));
  if (indexPin >= 0) {
    const mulai = baris[indexPin].muncul + 0.5;
    pin = { titik: Array.from({ length: 6 }, (_, index) => bulat(mulai + index * 0.15)), selesai: bulat(mulai + 1.1) };
    baris[indexPin].centang = bulat(pin.selesai + 0.3);
  }

  return {
    durasi: Math.max(...baris.map((item) => item.centang)) + 2.5,
    data: { judul: kapital(teks(pra.label).toLowerCase()) || "Pra pendaftaran", baris, pin },
  };
}

function adeganJalur(utama: SpmbJalur[]): Isi<JalurData> {
  const pilihan = utama.slice(0, 4);
  const daftar: JalurItem[] = pilihan.map((item, index) => {
    const pendaftaran = cari(item.jadwal, /pendaftaran/i, /latihan/i) ?? item.jadwal[0];
    const pengumuman = cari(item.jadwal, /pengumuman/i, /kuota/i);
    const titik = 1.2 + index * 2.6;
    return {
      id: teks(item.id) || `${index}`,
      label: teks(item.label),
      bulan: bulanAwal(pendaftaran.tanggal),
      daftar: rentang(pendaftaran.tanggal),
      pengumuman: pengumuman ? rentang(pengumuman.tanggal) : "",
      titik: bulat(titik),
      garis: bulat(titik + 0.35),
      garisDurasi: 2.25,
    };
  });

  // Catatan jam hanya ditampilkan bila semua jalur dibuka & ditutup di jam yang sama
  const barisDaftar = pilihan.map((item) => cari(item.jadwal, /pendaftaran/i, /latihan/i)).filter((item): item is SpmbJadwalBaris => Boolean(item));
  const jam = nilaiSeragam(barisDaftar, "jam").match(/(\d{1,2}[.:]\d{2})\s*-\s*(\d{1,2}[.:]\d{2})\s*(.*)$/);
  const catatan = jam
    ? { online: barisDaftar.every((item) => /^online$/i.test(teks(item.tempat))), buka: jam[1], tutup: `${jam[2]} ${jam[3]}`.trim() }
    : null;
  const catatanPada = bulat(daftar[daftar.length - 1].titik + 1.6);

  return { durasi: catatanPada + (catatan ? 4 : 2.5), data: { daftar, catatan, catatanPada } };
}

function adeganAkhir(utama: SpmbJalur[]): Isi<AkhirData> | null {
  const daftar: AkhirItem[] = LANGKAH_AKHIR.map(({ pola, kecuali, ...langkah }) => {
    const baris = utama.map((item) => cari(item.jadwal, pola, kecuali)).filter((item): item is SpmbJadwalBaris => Boolean(item));
    if (!baris.length) return null;
    const info = [nilaiSeragam(baris, "tempat"), rentang(nilaiSeragam(baris, "jam"))].filter(Boolean).join(" · ");
    return { ...langkah, info };
  })
    .filter((item): item is Omit<AkhirItem, "muncul"> & { info: string } => Boolean(item))
    .map((langkah, index) => ({ ...langkah, muncul: bulat(0.6 + index * 1.2) }));
  if (!daftar.length) return null;

  const catatanPada = bulat(daftar[daftar.length - 1].muncul + 1.2);
  return { durasi: catatanPada + 2.6, data: { daftar, catatanPada } };
}

function adeganData(spmb: SpmbContent, jurusan: Jurusan[]): Isi<DataData> | null {
  const batang: BatangItem[] = (Array.isArray(spmb?.nilai) ? spmb.nilai : [])
    .map((item) => ({ nama: teks(item.kompetensi), teks: teks(item.rata), angka: parseFloat(teks(item.rata).replace(",", ".")) }))
    .filter((item) => item.nama && Number.isFinite(item.angka))
    .sort((a, b) => b.angka - a.angka)
    .slice(0, 6);
  const domisili = (Array.isArray(spmb?.domisili) ? spmb.domisili : [])
    .map((item) => ({ ...item, label: teks(item.label).replace(/^domisili\s+/i, ""), nilai: Number(item.value) || 0 }))
    .filter((item) => item.label && item.nilai > 0)
    .slice(0, 4);
  if (!batang.length && !domisili.length) return null;

  let skala: DataData["skala"] = null;
  if (batang.length) {
    const dari = Math.max(0, Math.floor(Math.min(...batang.map((item) => item.angka))) - 2);
    const sampai = Math.ceil(Math.max(...batang.map((item) => item.angka))) + 1;
    skala = { dari, sampai };
    batang.forEach((item) => {
      item.kode = kodeJurusan(item.nama, jurusan);
      item.persen = bulat(((item.angka - dari) / (sampai - dari)) * 100);
    });
  }

  const keliling = 2 * Math.PI * 100;
  const jumlah = domisili.reduce((total, item) => total + item.nilai, 0);
  let kumulatif = 0;
  const irisan: IrisanItem[] = domisili.map((item, index) => {
    const panjang = (item.nilai / jumlah) * keliling;
    const hasil: IrisanItem = {
      label: item.label,
      value: item.value,
      color: item.color,
      nilai: item.nilai,
      warna: WARNA_IRISAN[index % WARNA_IRISAN.length],
      panjang: bulat(panjang),
      mulai: bulat(kumulatif),
      tunda: bulat(0.6 + index * 0.7),
    };
    kumulatif += panjang;
    return hasil;
  });

  return { durasi: 6, data: { tahun: teks(spmb?.nilai_tahun), batang, skala, irisan, keliling: bulat(keliling) } };
}

export interface NaskahVideo {
  adegan: Adegan[];
  total: number;
  menit: number;
  tahun: number | string;
  ringkas: string;
}

export function susunNaskah({ spmb, jurusan = [], tahun }: { spmb: SpmbContent; jurusan?: Jurusan[]; tahun: number | string }): NaskahVideo {
  const jalur = (Array.isArray(spmb?.jalur) ? spmb.jalur : []).filter((item) => Array.isArray(item?.jadwal) && item.jadwal.length);
  const pra = jalur.find((item) => /\bpra\b/i.test(`${item.id ?? ""} ${item.label ?? ""}`));
  const utama = jalur.filter((item) => item !== pra);

  const adegan: Adegan[] = [];
  let langkah = 0;
  const tambah = <TId extends Adegan["id"], TData>(
    id: TId,
    judul: string,
    isi: Isi<TData> | null,
    { hud = true, bertahap = false }: { hud?: boolean; bertahap?: boolean } = {},
  ) => {
    if (!isi) return;
    if (bertahap) langkah += 1;
    // Setiap adegan mendapat nomor langkah; tipe data sesuai id-nya
    adegan.push({
      id,
      judul,
      label: bertahap ? `Langkah ${langkah}` : "",
      hud,
      durasi: Math.ceil(isi.durasi),
      mulai: 0,
      data: { ...isi.data, langkah },
    } as Adegan);
  };

  tambah("pembuka", "Pembuka", { durasi: 5, data: {} }, { hud: false });
  tambah("ajakan", `SPMB ${tahun}`, { durasi: 5, data: { tahun, menit: 0 } }, { hud: false });
  tambah("jurusan", "Kompetensi keahlian", adeganJurusan(jurusan));
  if (pra) tambah("pra", kapital(teks(pra.label).toLowerCase()) || "Pra pendaftaran", adeganPra(pra), { bertahap: true });
  if (utama.length) {
    tambah("jalur", "Pilih jalur", adeganJalur(utama), { bertahap: true });
    tambah("akhir", "Setelah mendaftar", adeganAkhir(utama), { bertahap: true });
  }
  const data = adeganData(spmb, jurusan);
  tambah("data", data?.data.tahun ? `Data ${data.data.tahun}` : "Data tahun lalu", data);

  const instagram = SOCIAL_LINKS.find((item) => /instagram/i.test(item.label))?.href.match(/instagram\.com\/([^/?#]+)/i)?.[1];
  const kontak = [
    CONTACT.whatsapp && { label: "WhatsApp", nilai: CONTACT.whatsapp },
    instagram && { label: "Instagram", nilai: `@${instagram}` },
  ].filter((item): item is { label: string; nilai: string } => Boolean(item));
  tambah("penutup", "Kontak", { durasi: 5, data: { kontak } }, { hud: false });

  let mulai = 0;
  for (const item of adegan) {
    item.mulai = mulai;
    mulai += item.durasi;
  }

  // Panjang video baru diketahui setelah semua adegan tersusun; adegan ajakan menyebutkannya
  const menit = Math.max(1, Math.round(mulai / 60));
  const ajakan = adegan.find((item): item is Extract<Adegan, { id: "ajakan" }> => item.id === "ajakan");
  if (ajakan) ajakan.data.menit = menit;

  const jalurAdegan = adegan.find((item): item is Extract<Adegan, { id: "jalur" }> => item.id === "jalur");
  const bulanJalur = jalurAdegan?.data.daftar.map((item) => item.bulan).filter(Boolean) ?? [];
  const periode = bulanJalur.length ? [...new Set([bulanJalur[0], bulanJalur[bulanJalur.length - 1]])].join("–") : "";
  const ringkas = [utama.length ? `${utama.length} jalur pendaftaran` : "", periode ? `${periode} ${tahun}` : ""].filter(Boolean).join(" · ");

  return { adegan, total: mulai, menit, tahun, ringkas };
}
