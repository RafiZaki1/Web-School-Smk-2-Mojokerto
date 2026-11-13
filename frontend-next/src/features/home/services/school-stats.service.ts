import type { HomeStatistics } from "../types/home.type";

export type SchoolStatIcon = "students" | "teachers" | "established" | "majors" | "alumni";

export interface SchoolStat {
  key: SchoolStatIcon;
  label: string;
  target: number;
  suffix?: string;
  formatThousands?: boolean;
}

// Fakta yang bersumber dari knowledge base sekolah (SK pendirian 24 Juni 2013, 5 program keahlian).
// Hitungan siswa, guru, dan alumni tidak punya sumber selain API, jadi tidak diberi angka cadangan.
const ESTABLISHED_YEAR = 2013;
const TOTAL_MAJORS = 5;

/**
 * Menyusun kartu "Sekolah dalam angka" dari statistik API.
 * Kartu dengan nilai kosong atau 0 dibuang supaya tidak ada angka tanpa sumber.
 */
export function buildSchoolStats(statistics: HomeStatistics = {}): SchoolStat[] {
  const stats: SchoolStat[] = [
    { key: "students", label: "Siswa Aktif", target: statistics.total_students ?? 0 },
    { key: "teachers", label: "Tenaga Pendidik", target: statistics.total_teachers ?? 0 },
    {
      key: "established",
      label: "Tahun Berdiri",
      target: statistics.established_year || ESTABLISHED_YEAR,
      formatThousands: false,
    },
    { key: "majors", label: "Program Keahlian", target: statistics.total_majors || TOTAL_MAJORS },
    { key: "alumni", label: "Alumni Tercatat", target: statistics.total_alumni ?? 0 },
  ];

  return stats.filter((stat) => stat.target > 0);
}
