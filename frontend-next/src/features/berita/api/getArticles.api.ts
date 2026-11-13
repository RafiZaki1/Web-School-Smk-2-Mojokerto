import { fetchPublic } from "@/shared/lib/http/client";
import type { ArticleRecord } from "../types/berita.type";

// Daftar berita publik. null = API tidak bisa dihubungi.
export const getArticlesApi = ({ limit }: { limit?: number } = {}) =>
  fetchPublic<ArticleRecord[]>(`/articles${limit ? `?limit=${limit}` : ""}`);
