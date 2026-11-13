import { fetchPublic } from "@/shared/lib/http/client";
import type { StudentGuide } from "../types/tata-tertib.type";

// Tata tertib dan panduan seragam untuk Server Component (ISR). null = API tidak bisa dihubungi.
export const getStudentGuideApi = (): Promise<StudentGuide | null | undefined> => fetchPublic<StudentGuide>("/student-guide", { revalidate: 60 });
