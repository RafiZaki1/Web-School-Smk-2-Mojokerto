import type { ComponentType } from "react";
import {
  OrnamentAward,
  OrnamentBell,
  OrnamentBook,
  OrnamentBot,
  OrnamentBriefcase,
  OrnamentBubble,
  OrnamentBurst,
  OrnamentCalendar,
  OrnamentCamera,
  OrnamentCap,
  OrnamentChecklist,
  OrnamentChefHat,
  OrnamentClock,
  OrnamentCode,
  OrnamentCoins,
  OrnamentCookingPot,
  OrnamentFactory,
  OrnamentFingerprint,
  OrnamentFlag,
  OrnamentFlask,
  OrnamentFlower,
  OrnamentGear,
  OrnamentGift,
  OrnamentHandshake,
  OrnamentHourglass,
  OrnamentKey,
  OrnamentLandmark,
  OrnamentLaptop,
  OrnamentLeaf,
  OrnamentLightbulb,
  OrnamentLinkedRings,
  OrnamentLock,
  OrnamentMail,
  OrnamentMedal,
  OrnamentMusic,
  OrnamentNewspaper,
  OrnamentNotebook,
  OrnamentPackage,
  OrnamentPalette,
  OrnamentPencil,
  OrnamentPenTool,
  OrnamentPiggyBank,
  OrnamentPuzzle,
  OrnamentQuestion,
  OrnamentRing,
  OrnamentRocket,
  OrnamentRoute,
  OrnamentScroll,
  OrnamentSearch,
  OrnamentShirt,
  OrnamentShoppingBag,
  OrnamentSparkle,
  OrnamentSprout,
  OrnamentStamp,
  OrnamentStar,
  OrnamentTrophy,
  OrnamentUtensils,
  OrnamentVolleyball,
  OrnamentWave,
  OrnamentWheat,
  OrnamentWrench,
  OrnamentZigzag,
} from "@/shared/components/ui/Ornaments";

type Ornament = ComponentType<{ className?: string }>;
type Placement = readonly [Ornament, string];

/** Di samping judul halaman yang rata kiri, masih di dalam lebar konten. */
const HEAD = "hidden lg:block";
/** Di samping konten yang lebih sempit dari kolom halaman (form, kartu tengah); butuh layar xl. */
const WIDE = "hidden xl:block";
/** Di luar kolom `page-container` (1350px), hanya muncul saat sisi kiri/kanan layar cukup lega. */
const GUTTER_L = "hidden min-[1600px]:block left-[calc(50%-675px-7rem)]";
const GUTTER_R = "hidden min-[1600px]:block right-[calc(50%-675px-7rem)]";
const SPIN = "motion-safe:animate-[spin_40s_linear_infinite]";
const SPIN_REVERSE = "motion-safe:animate-[spin_24s_linear_infinite_reverse]";

/** Tiga ikon khas tiap jurusan: dipakai di tepi halaman dan di sudut foto hero jurusan. */
const JURUSAN_ICONS: Record<string, readonly [Ornament, Ornament, Ornament]> = {
  rpl: [OrnamentCode, OrnamentLaptop, OrnamentBot],
  dkv: [OrnamentPalette, OrnamentPenTool, OrnamentCamera],
  boga: [OrnamentChefHat, OrnamentCookingPot, OrnamentUtensils],
  aphp: [OrnamentLeaf, OrnamentWheat, OrnamentSprout],
  lps: [OrnamentLandmark, OrnamentCoins, OrnamentPiggyBank],
};
const JURUSAN_FALLBACK: readonly [Ornament, Ornament, Ornament] = [OrnamentGear, OrnamentCap, OrnamentStar];

export function getJurusanIcons(id: string) {
  return JURUSAN_ICONS[id] ?? JURUSAN_FALLBACK;
}

function jurusanPlacements(id: string): Placement[] {
  const [main, second, third] = getJurusanIcons(id);
  return [
    [main, `${GUTTER_L} top-[16%] w-20 -rotate-12 text-tint-strong`],
    [OrnamentGear, `${GUTTER_R} top-[24%] w-16 text-tint-strong ${SPIN}`],
    [OrnamentSparkle, `${GUTTER_R} top-[36%] w-7 text-sun`],
    [second, `${GUTTER_L} top-[46%] w-16 rotate-6 text-lime`],
    [third, `${GUTTER_R} top-[60%] w-16 -rotate-6 text-tint-strong`],
    [OrnamentBurst, `${GUTTER_R} top-[86%] w-12 rotate-[30deg] text-sun`],
  ];
}

const THEMES = {
  /** Daftar berita: judul rata kiri, ruang kanan atas kosong. */
  berita: [
    [OrnamentNewspaper, `${HEAD} top-[150px] right-[6%] w-20 rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${HEAD} top-[132px] right-[3%] w-6 text-sun`],
    [OrnamentWave, `${HEAD} top-[250px] right-[3%] w-20 text-lime`],
    [OrnamentPencil, `${GUTTER_L} top-[30%] w-16 -rotate-12 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_L} top-[64%] w-8 text-sun`],
    [OrnamentMail, `${GUTTER_R} top-[80%] w-16 rotate-6 text-tint-strong`],
  ],
  beritaDetail: [
    [OrnamentNewspaper, `${GUTTER_L} top-[200px] w-20 -rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[180px] w-8 text-sun`],
    [OrnamentPencil, `${GUTTER_R} top-[34%] w-16 rotate-12 text-tint-strong`],
    [OrnamentWave, `${GUTTER_L} top-[48%] w-20 text-lime`],
    [OrnamentFlower, `${GUTTER_L} top-[82%] w-10 text-sun`],
  ],
  bkk: [
    [OrnamentHandshake, `${GUTTER_L} top-[22%] w-20 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[18%] w-8 text-sun`],
    [OrnamentLinkedRings, `${GUTTER_R} top-[34%] w-20 text-tint-strong`],
    [OrnamentBriefcase, `${GUTTER_L} top-[50%] w-16 -rotate-6 text-lime`],
    [OrnamentRoute, `${GUTTER_R} top-[66%] w-24 text-tint-strong`],
  ],
  lowongan: [
    [OrnamentBriefcase, `${HEAD} top-[70px] right-[6%] w-20 rotate-6 text-tint-strong`],
    [OrnamentSearch, `${HEAD} top-[170px] right-[3%] w-10 text-sun`],
    [OrnamentSparkle, `${HEAD} top-[48px] right-[3%] w-6 text-lime`],
    [OrnamentRoute, `${GUTTER_L} top-[30%] w-24 text-tint-strong`],
    [OrnamentHandshake, `${GUTTER_L} top-[64%] w-16 text-lime`],
    [OrnamentSparkle, `${GUTTER_R} top-[80%] w-8 text-sun`],
  ],
  lowonganDetail: [
    [OrnamentBriefcase, `${GUTTER_L} top-[120px] w-20 -rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[110px] w-8 text-sun`],
    [OrnamentChecklist, `${GUTTER_R} top-[38%] w-16 rotate-6 text-tint-strong`],
    [OrnamentRoute, `${GUTTER_L} top-[54%] w-24 text-lime`],
    [OrnamentHandshake, `${GUTTER_L} top-[86%] w-16 text-tint-strong`],
  ],
  prestasi: [
    [OrnamentTrophy, `${HEAD} top-[60px] right-[6%] w-20 rotate-6 text-sun`],
    [OrnamentSparkle, `${HEAD} top-[44px] right-[3%] w-7 text-brand`],
    [OrnamentMedal, `${HEAD} top-[170px] right-[3%] w-12 -rotate-12 text-tint-strong`],
    [OrnamentBurst, `${GUTTER_L} top-[24%] w-14 -rotate-[20deg] text-sun`],
    [OrnamentAward, `${GUTTER_R} top-[40%] w-16 text-tint-strong`],
    [OrnamentStar, `${GUTTER_L} top-[58%] w-12 rotate-12 text-lime`],
    [OrnamentRing, `${GUTTER_R} top-[76%] w-20 text-tint-strong`],
  ],
  /** Hero prestasi selebar layar, jadi ornamen dimulai di bawahnya. */
  prestasiDetail: [
    [OrnamentMedal, `${GUTTER_L} top-[52%] w-16 -rotate-12 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[56%] w-8 text-sun`],
    [OrnamentStar, `${GUTTER_R} top-[68%] w-12 rotate-12 text-lime`],
    [OrnamentTrophy, `${GUTTER_L} top-[78%] w-16 text-sun`],
  ],
  lulusan: [
    [OrnamentCap, `${HEAD} top-[140px] right-[6%] w-24 -rotate-12 text-tint-strong`],
    [OrnamentSparkle, `${HEAD} top-[128px] right-[3%] w-7 text-sun`],
    [OrnamentRocket, `${HEAD} top-[232px] right-[3%] w-12 text-lime`],
    [OrnamentBriefcase, `${GUTTER_L} top-[28%] w-16 -rotate-6 text-tint-strong`],
    [OrnamentStar, `${GUTTER_R} top-[44%] w-12 text-sun`],
    [OrnamentCap, `${GUTTER_L} top-[62%] w-20 rotate-12 text-lime`],
  ],
  /** Judul fasilitas di tengah, ornamen mengapit di kiri-kanan; tepi memakai ikon tiap kelompok jurusan. */
  fasilitas: [
    [OrnamentWrench, `${HEAD} top-[150px] left-[6%] w-16 -rotate-12 text-tint-strong`],
    [OrnamentFlask, `${HEAD} top-[236px] left-[13%] w-10 rotate-12 text-lime`],
    [OrnamentGear, `${HEAD} top-[140px] right-[6%] w-16 text-tint-strong ${SPIN}`],
    [OrnamentGear, `${HEAD} top-[214px] right-[12%] w-8 text-sun ${SPIN_REVERSE}`],
    [OrnamentCode, `${GUTTER_L} top-[26%] w-16 text-tint-strong`],
    [OrnamentCamera, `${GUTTER_R} top-[38%] w-16 rotate-6 text-tint-strong`],
    [OrnamentLandmark, `${GUTTER_L} top-[52%] w-16 text-lime`],
    [OrnamentLeaf, `${GUTTER_R} top-[66%] w-16 -rotate-12 text-lime`],
    [OrnamentUtensils, `${GUTTER_L} top-[80%] w-16 text-tint-strong`],
  ],
  kuis: [
    [OrnamentLightbulb, `${HEAD} top-[140px] right-[5%] w-16 rotate-12 text-sun`],
    [OrnamentSparkle, `${HEAD} top-[128px] right-[2.5%] w-6 text-brand`],
    [OrnamentQuestion, `${HEAD} top-[236px] right-[2.5%] w-10 -rotate-12 text-tint-strong`],
    [OrnamentBubble, `${GUTTER_L} top-[24%] w-20 -rotate-6 text-tint-strong`],
    [OrnamentPuzzle, `${GUTTER_R} top-[40%] w-16 rotate-12 text-lime`],
    [OrnamentQuestion, `${GUTTER_L} top-[58%] w-14 text-sun`],
    [OrnamentCap, `${GUTTER_R} top-[76%] w-20 -rotate-12 text-tint-strong`],
  ],
  /** Hasil kuis: suasana merayakan jurusan yang cocok. */
  kuisHasil: [
    [OrnamentBurst, `${HEAD} top-[110px] right-[5%] w-12 rotate-[25deg] text-sun`],
    [OrnamentSparkle, `${HEAD} top-[124px] right-[2.5%] w-5 text-lime`],
    [OrnamentCap, `${GUTTER_L} top-[22%] w-20 -rotate-12 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[30%] w-8 text-sun`],
    [OrnamentStar, `${GUTTER_R} top-[48%] w-12 text-lime`],
    [OrnamentLightbulb, `${GUTTER_L} top-[60%] w-14 text-sun`],
    [OrnamentFlower, `${GUTTER_R} top-[76%] w-10 text-brand`],
  ],
  portal: [
    [OrnamentLaptop, `${GUTTER_L} top-[18%] w-20 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[14%] w-8 text-sun`],
    [OrnamentBook, `${GUTTER_R} top-[32%] w-20 -rotate-6 text-tint-strong`],
    [OrnamentPencil, `${GUTTER_L} top-[48%] w-14 rotate-12 text-lime`],
    [OrnamentCalendar, `${GUTTER_R} top-[64%] w-16 text-tint-strong`],
  ],
  spmb: [
    [OrnamentCalendar, `${GUTTER_L} top-[18%] w-20 -rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[16%] w-8 text-sun`],
    [OrnamentPencil, `${GUTTER_R} top-[30%] w-16 rotate-12 text-lime`],
    [OrnamentRoute, `${GUTTER_L} top-[42%] w-24 text-tint-strong`],
    [OrnamentChecklist, `${GUTTER_R} top-[56%] w-16 text-tint-strong`],
    [OrnamentCap, `${GUTTER_L} top-[70%] w-20 rotate-12 text-sun`],
  ],
  sejarah: [
    [OrnamentScroll, `${GUTTER_L} top-[14%] w-20 -rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[12%] w-8 text-sun`],
    [OrnamentLandmark, `${GUTTER_R} top-[26%] w-20 text-tint-strong`],
    [OrnamentHourglass, `${GUTTER_L} top-[40%] w-14 rotate-12 text-sun`],
    [OrnamentBook, `${GUTTER_R} top-[64%] w-16 text-lime`],
    [OrnamentStar, `${GUTTER_L} top-[78%] w-12 text-tint-strong`],
  ],
  karya: [
    [OrnamentCode, `${GUTTER_L} top-[16%] w-16 -rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[14%] w-8 text-sun`],
    [OrnamentPalette, `${GUTTER_R} top-[28%] w-16 rotate-6 text-lime`],
    [OrnamentChefHat, `${GUTTER_L} top-[40%] w-16 text-sun`],
    [OrnamentLeaf, `${GUTTER_R} top-[54%] w-12 -rotate-12 text-tint-strong`],
    [OrnamentCoins, `${GUTTER_L} top-[68%] w-14 text-lime`],
    [OrnamentStar, `${GUTTER_R} top-[80%] w-10 text-tint-strong`],
  ],
  produk: [
    [OrnamentPackage, `${GUTTER_L} top-[18%] w-20 -rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[14%] w-8 text-sun`],
    [OrnamentShoppingBag, `${GUTTER_R} top-[30%] w-16 rotate-6 text-lime`],
    [OrnamentGift, `${GUTTER_L} top-[44%] w-16 text-sun`],
    [OrnamentStar, `${GUTTER_R} top-[58%] w-12 -rotate-12 text-tint-strong`],
  ],
  ekstra: [
    [OrnamentMusic, `${GUTTER_L} top-[16%] w-16 -rotate-12 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[14%] w-8 text-sun`],
    [OrnamentVolleyball, `${GUTTER_R} top-[28%] w-16 text-lime`],
    [OrnamentZigzag, `${GUTTER_L} top-[40%] w-24 text-lime`],
    [OrnamentFlag, `${GUTTER_R} top-[54%] w-16 rotate-6 text-tint-strong`],
    [OrnamentBurst, `${GUTTER_L} top-[66%] w-14 rotate-[25deg] text-sun`],
    [OrnamentMedal, `${GUTTER_R} top-[80%] w-14 text-tint-strong`],
  ],
  /** Buku tamu: judul dan form selebar 860px rata kiri, sisi kanan lega sampai bawah. */
  bukuTamu: [
    [OrnamentNotebook, `${HEAD} top-[116px] right-[7%] w-20 rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${HEAD} top-[102px] right-[3.5%] w-6 text-sun`],
    [OrnamentMail, `${HEAD} top-[212px] right-[3.5%] w-12 -rotate-12 text-lime`],
    [OrnamentBubble, `${WIDE} top-[44%] right-[8%] w-20 -rotate-6 text-tint-strong`],
    [OrnamentCalendar, `${WIDE} top-[68%] right-[4%] w-14 rotate-12 text-sun`],
    [OrnamentPencil, `${GUTTER_L} top-[34%] w-16 -rotate-12 text-tint-strong`],
    [OrnamentWave, `${GUTTER_L} top-[72%] w-20 text-lime`],
  ],
  /** Cek kelulusan: mengapit kartu pengumuman selebar 840px di tengah. */
  kelulusan: [
    [OrnamentCap, `${WIDE} top-[150px] left-[calc(50%-420px-9rem)] w-24 -rotate-12 text-tint-strong`],
    [OrnamentSparkle, `${WIDE} top-[124px] left-[calc(50%-420px-3.5rem)] w-6 text-sun`],
    [OrnamentBurst, `${WIDE} top-[118px] right-[calc(50%-420px-8rem)] w-14 rotate-[25deg] text-sun`],
    [OrnamentAward, `${WIDE} top-[250px] right-[calc(50%-420px-8.5rem)] w-16 rotate-6 text-tint-strong`],
    [OrnamentStar, `${WIDE} top-[360px] left-[calc(50%-420px-7rem)] w-12 rotate-12 text-lime`],
    [OrnamentFlower, `${WIDE} top-[440px] right-[calc(50%-420px-5.5rem)] w-10 text-lime`],
  ],
  kemitraan: [
    [OrnamentHandshake, `${HEAD} top-[112px] right-[7%] w-20 rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${HEAD} top-[100px] right-[3.5%] w-6 text-sun`],
    [OrnamentLinkedRings, `${HEAD} top-[206px] right-[3%] w-16 text-lime`],
    [OrnamentFactory, `${GUTTER_L} top-[26%] w-16 -rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${GUTTER_R} top-[22%] w-8 text-sun`],
    [OrnamentBriefcase, `${GUTTER_R} top-[40%] w-16 rotate-6 text-lime`],
    [OrnamentCamera, `${GUTTER_L} top-[60%] w-16 rotate-6 text-tint-strong`],
    [OrnamentRoute, `${GUTTER_R} top-[76%] w-24 text-tint-strong`],
  ],
  /** Layanan berkas alumni: ijazah, cap tiga jari, legalisir, lalu notifikasi status. */
  layananAlumni: [
    [OrnamentScroll, `${HEAD} top-[114px] right-[7%] w-20 -rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${HEAD} top-[102px] right-[3.5%] w-6 text-sun`],
    [OrnamentStamp, `${HEAD} top-[196px] right-[3.5%] w-12 rotate-12 text-lime`],
    [OrnamentFingerprint, `${GUTTER_L} top-[28%] w-16 text-tint-strong`],
    [OrnamentBell, `${GUTTER_R} top-[40%] w-14 rotate-12 text-sun`],
    [OrnamentCap, `${GUTTER_L} top-[58%] w-20 rotate-6 text-lime`],
    [OrnamentChecklist, `${GUTTER_R} top-[74%] w-14 -rotate-6 text-tint-strong`],
  ],
  /** Tata tertib & seragam: aturan, jam masuk, seragam harian, dan seragam praktik jurusan. */
  tataTertib: [
    [OrnamentChecklist, `${HEAD} top-[114px] right-[7%] w-20 rotate-6 text-tint-strong`],
    [OrnamentSparkle, `${HEAD} top-[102px] right-[3.5%] w-6 text-sun`],
    [OrnamentShirt, `${HEAD} top-[204px] right-[3%] w-14 -rotate-12 text-lime`],
    [OrnamentClock, `${GUTTER_L} top-[20%] w-14 -rotate-6 text-tint-strong`],
    [OrnamentFlag, `${GUTTER_R} top-[34%] w-16 rotate-6 text-tint-strong`],
    [OrnamentCalendar, `${GUTTER_L} top-[50%] w-16 text-sun`],
    [OrnamentWrench, `${GUTTER_R} top-[68%] w-14 -rotate-12 text-lime`],
    [OrnamentChefHat, `${GUTTER_L} top-[76%] w-14 text-tint-strong`],
  ],
  "jurusan-rpl": jurusanPlacements("rpl"),
  "jurusan-dkv": jurusanPlacements("dkv"),
  "jurusan-boga": jurusanPlacements("boga"),
  "jurusan-aphp": jurusanPlacements("aphp"),
  "jurusan-lps": jurusanPlacements("lps"),
  jurusan: jurusanPlacements(""),
  /** Ruang obrolan SADA lebarnya 760px, sisi kiri-kanannya sudah lega sejak layar lg. */
  sada: [
    [OrnamentBubble, "hidden lg:block top-[18%] left-[calc(50%-380px-8rem)] w-20 -rotate-6 text-brand/25"],
    [OrnamentSparkle, "hidden lg:block top-[14%] right-[calc(50%-380px-6rem)] w-8 text-sun"],
    [OrnamentBot, "hidden lg:block top-[34%] right-[calc(50%-380px-8rem)] w-20 text-brand/25"],
    [OrnamentLightbulb, "hidden lg:block top-[52%] left-[calc(50%-380px-7rem)] w-14 rotate-12 text-sun"],
    [OrnamentWave, "hidden lg:block top-[84%] left-[calc(50%-380px-8rem)] w-20 text-lime"],
  ],
  /** Halaman akses (403): mengapit kartu pesan selebar 36rem. */
  akses: [
    [OrnamentLock, "hidden md:block top-10 left-[calc(50%-18rem-7rem)] w-16 -rotate-12 text-tint-strong"],
    [OrnamentKey, "hidden md:block top-24 right-[calc(50%-18rem-7rem)] w-16 rotate-12 text-sun"],
    [OrnamentSparkle, "hidden md:block top-8 right-[calc(50%-18rem-3rem)] w-6 text-lime"],
  ],
  /** Login: di atas foto gedung yang diburamkan, mengapit kartu login selebar 448px. */
  login: [
    [OrnamentGear, `hidden md:block top-[18%] left-[calc(50%-224px-9rem)] w-20 text-white/40 ${SPIN}`],
    [OrnamentGear, `hidden md:block top-[30%] left-[calc(50%-224px-5rem)] w-9 text-sun ${SPIN_REVERSE}`],
    [OrnamentKey, "hidden md:block top-[58%] right-[calc(50%-224px-9rem)] w-16 rotate-12 text-white/50"],
    [OrnamentSparkle, "hidden md:block top-[22%] right-[calc(50%-224px-6rem)] w-8 text-sun"],
  ],
} satisfies Record<string, readonly Placement[]>;

export type PageOrnamentTheme = keyof typeof THEMES;

/** Ikon besar samar di kanan PageHero, sesuai topik halaman. */
export const HERO_ORNAMENTS: Partial<Record<PageOrnamentTheme, Ornament>> = {
  bkk: OrnamentBriefcase,
  karya: OrnamentLightbulb,
  produk: OrnamentShoppingBag,
  sejarah: OrnamentHourglass,
  spmb: OrnamentChecklist,
};

export function jurusanOrnamentTheme(id: string): PageOrnamentTheme {
  const theme = `jurusan-${id}`;
  return theme in THEMES ? (theme as PageOrnamentTheme) : "jurusan";
}

interface PageOrnamentsProps {
  theme: PageOrnamentTheme;
  /** `true` (bawaan): di belakang konten, induknya wajib `relative isolate`. */
  behind?: boolean;
}

/**
 * Lapisan ornamen bertema untuk satu halaman. Dipasang sebagai anak pertama elemen `relative`
 * (biasanya `<main>`); posisi tiap ornamen dihitung dari kotak induk itu.
 */
export default function PageOrnaments({ theme, behind = true }: PageOrnamentsProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${behind ? "-z-10" : ""}`}>
      {THEMES[theme].map(([Shape, className], index) => (
        <Shape key={index} className={`absolute ${className}`} />
      ))}
    </div>
  );
}
