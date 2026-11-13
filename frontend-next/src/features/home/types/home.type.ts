// Statistik sekolah dari endpoint /public/statistics (dan ikut di /public/home).
export interface HomeStatistics {
  total_students?: number;
  total_teachers?: number;
  established_year?: number;
  total_majors?: number;
  total_alumni?: number;
}

// Profil sekolah dari endpoint /public/school-profile.
export interface SchoolProfileRecord {
  school_name: string;
  description: string | null;
}

export interface HeroRecord {
  school_name: string | null;
}

// Data gabungan beranda dari endpoint /public/home.
export interface HomeRecord {
  school_profile: SchoolProfileRecord | null;
  hero: HeroRecord | null;
  statistics: HomeStatistics | null;
}

// Kontent sambutan kepala sekolah (konten "sambutan" dari admin, bila ada).
export interface SambutanContent {
  nama: string;
  jabatan: string;
  foto: string;
  kutipan: string;
  video?: string;
}
