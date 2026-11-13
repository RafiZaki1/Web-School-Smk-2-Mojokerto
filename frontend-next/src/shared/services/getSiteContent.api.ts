import { fetchPublic } from "@/shared/lib/http/client";

export interface SiteContentRecord<T> {
  key: string;
  value: T;
}

// Konten halaman yang dikelola admin (mis. mitra, spmb, produk). null = API tidak bisa dihubungi.
export const getSiteContentApi = <T>(key: string) => fetchPublic<SiteContentRecord<T>>(`/contents/${encodeURIComponent(key)}`);
