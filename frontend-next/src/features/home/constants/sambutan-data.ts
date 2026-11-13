import type { SambutanContent } from "../types/home.type";

// Sambutan beranda; diganti lewat konten "sambutan" di API.
// video: URL YouTube atau file .mp4 rekaman asli kepala sekolah; kosong = hanya foto.
export const SAMBUTAN: SambutanContent = {
  nama: "Bapak Iswahyudi, S.ST.",
  jabatan: "Kepala SMKN 2 Mojokerto",
  foto: "/images/kepala-sekolah.webp",
  kutipan:
    "Pendidikan vokasi adalah kunci kemandirian bangsa. Kami mendidik dengan hati, mengasah kompetensi, dan mencetak generasi yang tangguh menghadapi tantangan global.",
  video: "",
};
