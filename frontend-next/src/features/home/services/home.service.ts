import { getSiteContentApi } from "@/shared/services/getSiteContent.api";
import { getHomeApi, getStatisticsApi } from "../api/home.api";
import { SAMBUTAN } from "../constants/sambutan-data";
import type { HomeRecord, SambutanContent } from "../types/home.type";

// Data beranda (profil sekolah, hero, statistik). null bila API tidak bisa dihubungi.
export async function getHomeData(): Promise<HomeRecord | null> {
  return (await getHomeApi()) ?? null;
}

export async function getStatistics() {
  return (await getStatisticsApi()) ?? null;
}

// Sambutan kepala sekolah dari konten admin; bila belum ada, dipakai data statis.
export async function getSambutanContent(): Promise<SambutanContent> {
  const content = await getSiteContentApi<SambutanContent>("sambutan");
  return content?.value ?? SAMBUTAN;
}
