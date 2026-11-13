import { fetchPublic } from "@/shared/lib/http/client";
import type { MajorRecord } from "../types/jurusan.type";

// Daftar jurusan publik. null = API tidak bisa dihubungi.
export const getMajorsApi = () => fetchPublic<MajorRecord[]>("/majors");
