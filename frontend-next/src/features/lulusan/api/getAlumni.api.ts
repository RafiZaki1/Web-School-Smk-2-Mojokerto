import { fetchPublic } from "@/shared/lib/http/client";
import type { AlumniRecord } from "../types/lulusan.type";

// Daftar alumni publik. featured = true hanya mengambil lulusan terbaik. null = API tidak bisa dihubungi.
export const getAlumniApi = ({ featured = false }: { featured?: boolean } = {}) => fetchPublic<AlumniRecord[]>(`/alumni${featured ? "?featured=1" : ""}`);
