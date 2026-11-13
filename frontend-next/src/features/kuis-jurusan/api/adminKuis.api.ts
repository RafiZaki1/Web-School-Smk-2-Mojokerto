import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { QuizAdminRecord, QuizReviewPayload } from "../types/kuis.type";

const ADMIN_SUBMISSIONS = "/api/v1/admin/major-quiz-submissions";

// Daftar log kuis untuk admin. Respons berbentuk { items: [...] }.
export const listQuizSubmissionsAdminApi = async (): Promise<QuizAdminRecord[]> => {
  const { data } = await http.get<ApiEnvelope<{ items: QuizAdminRecord[] }>>(ADMIN_SUBMISSIONS);
  return data.data.items;
};

export const getQuizSubmissionAdminApi = async (id: string): Promise<QuizAdminRecord> => {
  const { data } = await http.get<ApiEnvelope<QuizAdminRecord>>(`${ADMIN_SUBMISSIONS}/${encodeURIComponent(id)}`);
  return data.data;
};

export const reviewQuizSubmissionAdminApi = async (id: string, payload: QuizReviewPayload): Promise<QuizAdminRecord> => {
  const { data } = await http.put<ApiEnvelope<QuizAdminRecord>>(`${ADMIN_SUBMISSIONS}/${encodeURIComponent(id)}`, payload);
  return data.data;
};

export const removeQuizSubmissionAdminApi = async (id: number | string): Promise<void> => {
  await http.delete(`${ADMIN_SUBMISSIONS}/${encodeURIComponent(String(id))}`);
};

export const adminKuisApi = {
  list: listQuizSubmissionsAdminApi,
  get: getQuizSubmissionAdminApi,
  review: reviewQuizSubmissionAdminApi,
  remove: removeQuizSubmissionAdminApi,
};
