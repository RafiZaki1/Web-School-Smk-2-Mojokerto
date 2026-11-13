import { fetchPublic } from "@/shared/lib/http/client";
import type { HomeRecord, HomeStatistics, SchoolProfileRecord } from "../types/home.type";

// Data beranda. null = API tidak bisa dihubungi.
export const getHomeApi = () => fetchPublic<HomeRecord>("/home", { revalidate: 60 });

export const getStatisticsApi = () => fetchPublic<HomeStatistics>("/statistics", { revalidate: 60 });

export const getSchoolProfileApi = () => fetchPublic<SchoolProfileRecord>("/school-profile", { revalidate: 60 });
