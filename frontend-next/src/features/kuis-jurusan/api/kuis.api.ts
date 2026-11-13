import { http } from "@/shared/lib/http/client";
import { fetchPublic } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { QuizQuestionsResponse, QuizSubmissionRecord, QuizSubmitPayload } from "../types/kuis.type";

// Soal kuis publik. null = API tidak bisa dihubungi.
export const getQuizQuestionsApi = () => fetchPublic<QuizQuestionsResponse>("/major-quiz/questions");

// Hasil kuis berdasarkan kode. undefined = kode tidak ada, null = API tidak bisa dihubungi.
export const getQuizSubmissionApi = (code: string) =>
  fetchPublic<QuizSubmissionRecord>(`/major-quiz/submissions/${encodeURIComponent(code)}`, { revalidate: 0 });

// Kirim jawaban dari browser. Nama dan email boleh kosong.
export const postQuizSubmissionApi = async (payload: QuizSubmitPayload): Promise<QuizSubmissionRecord> => {
  const { data } = await http.post<ApiEnvelope<QuizSubmissionRecord>>("/api/v1/public/major-quiz/submissions", {
    name: payload.name || undefined,
    email: payload.email || undefined,
    answers: payload.answers,
    website: payload.website || undefined,
  });
  return data.data;
};
