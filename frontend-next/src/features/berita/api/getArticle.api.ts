import { fetchPublic } from "@/shared/lib/http/client";
import type { ArticleRecord } from "../types/berita.type";

// Detail berita publik. undefined = tidak ditemukan, null = API tidak bisa dihubungi.
export const getArticleApi = (slug: string) => fetchPublic<ArticleRecord>(`/articles/${encodeURIComponent(slug)}`);
