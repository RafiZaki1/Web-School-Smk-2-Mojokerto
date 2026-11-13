import { getSiteContentApi } from "@/shared/services/getSiteContent.api";
import { FASILITAS_GROUPS } from "../constants/fasilitas-data";

export type FasilitasGroup = (typeof FASILITAS_GROUPS)[number];

// Konten fasilitas dari admin; bila belum ada, dipakai data statis.
export async function getFasilitasGroups(): Promise<FasilitasGroup[]> {
  const content = await getSiteContentApi<{ groups: FasilitasGroup[] }>("fasilitas");
  return content?.value?.groups ?? FASILITAS_GROUPS;
}
