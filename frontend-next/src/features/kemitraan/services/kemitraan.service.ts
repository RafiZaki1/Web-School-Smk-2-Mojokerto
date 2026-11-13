import { getIndustryPartnersApi, getInternshipDocumentationsApi } from "../api/kemitraanPublic.api";
import type { IndustryPartner, InternshipDocumentation } from "../types/kemitraan.type";

export interface KemitraanData {
  partners: IndustryPartner[];
  documentations: InternshipDocumentation[];
  // false bila API tidak bisa dihubungi, agar halaman menampilkan pesan gagal muat, bukan "kosong"
  available: boolean;
}

/** Mitra aktif dan dokumentasi PKL yang dipublikasikan untuk halaman /kemitraan. */
export async function getKemitraanData(): Promise<KemitraanData> {
  const [partners, documentations] = await Promise.all([getIndustryPartnersApi(), getInternshipDocumentationsApi()]);
  return { partners: partners ?? [], documentations: documentations ?? [], available: partners !== null && documentations !== null };
}

/** Beberapa dokumentasi PKL terbaru untuk beranda; kosong bila API gagal. */
export async function getPklDocumentationHighlights(limit = 6): Promise<InternshipDocumentation[]> {
  return (await getInternshipDocumentationsApi(limit)) ?? [];
}
