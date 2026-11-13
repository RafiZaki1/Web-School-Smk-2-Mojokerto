import type { Partner } from "@/shared/components/ui/LogoGrid";
import { MITRA_DAFTAR } from "@/shared/constants/mitra-data";
import { getSiteContentApi } from "@/shared/services/getSiteContent.api";

// Mitra untuk landing page dan detail jurusan yang belum punya mitra sendiri.
export async function getMitraLanding(): Promise<Partner[]> {
  const content = await getSiteContentApi<{ items: Partner[] }>("mitra");
  return content?.value?.items ?? MITRA_DAFTAR;
}
