import { getSiteContentApi } from "@/shared/services/getSiteContent.api";
import { SPMB_DOMISILI, SPMB_JALUR, SPMB_NILAI_2025 } from "../constants/spmb-data";
import type { SpmbContent } from "../constants/spmb-video-script";

// Konten SPMB dari admin; bila belum ada atau format lama, dipakai data statis tahun berjalan.
export async function getSpmbContent(): Promise<SpmbContent> {
  const content = await getSiteContentApi<SpmbContent>("spmb");
  const raw = content?.value;
  const hasValidNilai =
    Array.isArray(raw?.nilai) &&
    raw.nilai.length > 0 &&
    raw.nilai.every((row) => Boolean(row.rapor && row.tka && row.rata));

  return {
    jalur: Array.isArray(raw?.jalur) && raw.jalur.length > 0 ? raw.jalur : SPMB_JALUR,
    nilai: hasValidNilai ? raw.nilai : SPMB_NILAI_2025,
    nilai_tahun: raw?.nilai_tahun ?? 2025,
    domisili: Array.isArray(raw?.domisili) && raw.domisili.length > 0 ? raw.domisili : SPMB_DOMISILI,
  };
}
