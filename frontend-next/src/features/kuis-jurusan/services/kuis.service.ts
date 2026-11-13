import { getAssetUrl } from "@/shared/lib/http/client";
import { getQuizQuestionsApi, getQuizSubmissionApi, postQuizSubmissionApi } from "../api/kuis.api";
import { ESTIMASI_MENIT, KUIS_JURUSAN, MAKS_JAWABAN } from "../constants/kuis-jurusan-data";
import type {
  QuizAdminRecord,
  QuizMajor,
  QuizMajorRecord,
  QuizQuestionsState,
  QuizResult,
  QuizScore,
  QuizScoreRecord,
  QuizSubmissionRecord,
  QuizSubmitPayload,
} from "../types/kuis.type";

const DEFAULT_MAJOR_IMAGE = "/images/sejarah/gedung.jpg";

const KUIS_STATUS_LABEL: Record<string, string> = { new: "Baru", reviewed: "Ditinjau" };

function toQuizMajor(major: QuizMajorRecord): QuizMajor {
  return {
    id: major.slug,
    code: major.code,
    fullName: major.name,
    tagline: major.tagline ?? null,
    image: getAssetUrl(major.image) || DEFAULT_MAJOR_IMAGE,
    whyMatch: major.why_match ?? null,
    alternativeWhyMatch: major.alternative_why_match ?? null,
    careers: major.careers ?? [],
  };
}

function toQuizScore(item: QuizScoreRecord): QuizScore {
  return {
    major: toQuizMajor(item.major),
    percentage: item.percentage,
    reason: item.reason ?? null,
    // Id pertanyaan yang jawabannya mengarah ke jurusan ini
    evidence: item.evidence ?? [],
    // Hitungan persentase: total poin ÷ poin maksimal (null untuk log versi lama)
    points: item.points ?? null,
    maxPoints: item.max_points ?? null,
    breakdown: (item.breakdown ?? []).map((row) => ({ questionId: row.question_id, points: row.points })),
  };
}

// Ubah respons hasil kuis menjadi bentuk yang dipakai halaman hasil dan chat.
export function toQuizResult(result: QuizSubmissionRecord): QuizResult {
  return {
    code: result.code,
    name: result.name,
    status: result.status,
    createdAt: result.created_at,
    createdLabel: result.created_label,
    reviewedLabel: result.reviewed_label,
    totalAnswered: result.total_answered,
    analysis: result.analysis,
    matchMethod: result.match_method,
    isCorrected: result.is_corrected,
    publicNote: result.public_note,
    primary: result.primary ? toQuizScore(result.primary) : null,
    systemRecommendation: result.system_recommendation ? toQuizScore(result.system_recommendation) : null,
    alternative: result.alternative ? toQuizScore(result.alternative) : null,
    allScores: result.all_scores.map((score) => toQuizScore(score)),
    answers: result.answers.map((item) => ({ questionId: item.question_id, question: item.question, answer: item.answer })),
  };
}

/** Soal untuk Server Component; bila API mati, pakai salinan lokal. */
export async function getQuizQuestions(): Promise<QuizQuestionsState> {
  const data = await getQuizQuestionsApi();
  if (data?.questions?.length) {
    return { questions: data.questions, estimatedMinutes: data.estimated_minutes, maxLength: data.answer_max_length, offline: false };
  }
  return { questions: KUIS_JURUSAN, estimatedMinutes: ESTIMASI_MENIT, maxLength: MAKS_JAWABAN, offline: true };
}

/** Hasil kuis berdasarkan kode. undefined = kode tidak ada, null = API tidak bisa dihubungi. */
export async function getQuizResult(code: string): Promise<QuizResult | null | undefined> {
  const data = await getQuizSubmissionApi(code);
  if (data === undefined) return undefined;
  return data ? toQuizResult(data) : null;
}

/** Kirim jawaban chat dari browser. */
export async function submitQuiz(payload: QuizSubmitPayload): Promise<QuizResult> {
  return toQuizResult(await postQuizSubmissionApi(payload));
}

export interface AdminKuis {
  id: number;
  kode: string;
  nama: string;
  adaNama: boolean;
  email: string | null;
  tanggal: string;
  waktu: string;
  status: string;
  statusKey: "new" | "reviewed";
  analisis: string;
  metode: string;
  jawaban: { id: number; soal: string; jawaban: string; jurusan: { code: string | null; points: number | null }[] }[];
  skor: QuizAdminRecord["scores"];
  rekomendasi: string | null;
  rekomendasiLabel: string | null;
  rekomendasiPersen: number;
  alternatifLabel: string | null;
  koreksi: string | null;
  hasilLabel: string | null;
  catatanSiswa: string;
  catatanInternal: string;
}

/** Log kuis jurusan untuk panel admin. */
export function toAdminKuis(item: QuizAdminRecord): AdminKuis {
  const scores = (item.scores ?? []).map((score) => ({ ...score }));
  const bySlug = Object.fromEntries(scores.map((score) => [score.slug, score]));
  const label = (slug: string | null): string | null => (slug ? (bySlug[slug]?.code ?? slug.toUpperCase()) : null);

  return {
    id: item.id,
    kode: item.code,
    nama: item.name || "Tanpa nama",
    adaNama: Boolean(item.name),
    email: item.email,
    tanggal: item.created_label,
    waktu: item.created_time_label,
    status: KUIS_STATUS_LABEL[item.status] ?? item.status,
    statusKey: item.status,
    analisis: item.analysis ?? "",
    metode: item.match_method === "ai" ? "AI" : "Kata kunci",
    jawaban: (item.answers ?? []).map((answer) => ({
      id: answer.question_id,
      soal: answer.question,
      jawaban: answer.answer,
      // [{ code, points }]; log versi lama hanya punya daftar slug tanpa poin
      jurusan: answer.points
        ? Object.entries(answer.points).map(([slug, points]) => ({ code: label(slug), points }))
        : (answer.majors ?? []).map((slug) => ({ code: label(slug), points: null })),
    })),
    skor: scores,
    rekomendasi: item.recommended_major,
    rekomendasiLabel: label(item.recommended_major),
    rekomendasiPersen: bySlug[item.recommended_major ?? ""]?.percentage ?? 0,
    alternatifLabel: label(item.alternative_major),
    koreksi: item.final_major,
    hasilLabel: label(item.result_major),
    catatanSiswa: item.public_note ?? "",
    catatanInternal: item.admin_note ?? "",
  };
}
