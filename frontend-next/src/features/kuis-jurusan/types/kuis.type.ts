// Soal kuis dari API atau cadangan lokal.
export interface QuizQuestion {
  id: number;
  question: string;
  hint: string;
  required: boolean;
}

export interface QuizMajorRecord {
  slug: string;
  code: string;
  name: string;
  tagline: string | null;
  image: string | null;
  why_match: string | null;
  alternative_why_match: string | null;
  careers: string[];
}

export interface QuizScoreRecord {
  major: QuizMajorRecord;
  percentage: number;
  reason: string | null;
  evidence: number[];
  points: number | null;
  max_points: number | null;
  breakdown: { question_id: number; points: number }[];
}

export interface QuizAnswerRecord {
  question_id: number;
  question: string;
  answer: string;
}

// Bentuk resource Laravel (App\Http\Resources\MajorQuizSubmissionResource).
export interface QuizSubmissionRecord {
  code: string;
  name: string | null;
  email: string | null;
  status: "new" | "reviewed";
  created_at: string | null;
  created_label: string;
  created_time_label: string;
  reviewed_label: string | null;
  total_answered: number;
  analysis: string | null;
  match_method: string;
  is_corrected: boolean;
  public_note: string | null;
  primary: QuizScoreRecord | null;
  system_recommendation: QuizScoreRecord | null;
  alternative: QuizScoreRecord | null;
  all_scores: QuizScoreRecord[];
  answers: QuizAnswerRecord[];
}

export interface QuizMajor {
  id: string;
  code: string;
  fullName: string;
  tagline: string | null;
  image: string;
  whyMatch: string | null;
  alternativeWhyMatch: string | null;
  careers: string[];
}

export interface QuizScore {
  major: QuizMajor;
  percentage: number;
  reason: string | null;
  evidence: number[];
  points: number | null;
  maxPoints: number | null;
  breakdown: { questionId: number; points: number }[];
}

export interface QuizResult {
  code: string;
  name: string | null;
  status: "new" | "reviewed";
  createdAt: string | null;
  createdLabel: string;
  reviewedLabel: string | null;
  totalAnswered: number;
  analysis: string | null;
  matchMethod: string;
  isCorrected: boolean;
  publicNote: string | null;
  primary: QuizScore | null;
  systemRecommendation: QuizScore | null;
  alternative: QuizScore | null;
  allScores: QuizScore[];
  answers: { questionId: number; question: string; answer: string }[];
}

export interface QuizQuestionsResponse {
  questions: QuizQuestion[];
  estimated_minutes: string;
  answer_max_length: number;
}

export interface QuizQuestionsState {
  questions: QuizQuestion[];
  estimatedMinutes: string;
  maxLength: number;
  offline: boolean;
}

// Muatan kirim jawaban dari chat.
export interface QuizSubmitPayload {
  name?: string;
  email?: string;
  answers: Record<number, string>;
  website?: string;
}

export interface QuizAdminScoreRecord {
  slug: string;
  code: string;
  name: string;
  percentage: number;
  points?: number | null;
  max_points?: number | null;
  reason?: string | null;
}

export interface QuizAdminAnswerRecord {
  question_id: number;
  question: string;
  answer: string;
  points?: Record<string, number> | null;
  majors?: string[] | null;
}

// Log kuis untuk panel admin (respons berbeda dari bentuk publik).
export interface QuizAdminRecord {
  id: number;
  code: string;
  name: string | null;
  email: string | null;
  status: "new" | "reviewed";
  created_label: string;
  created_time_label: string;
  analysis: string | null;
  match_method: string;
  answers: QuizAdminAnswerRecord[];
  scores: QuizAdminScoreRecord[];
  recommended_major: string | null;
  alternative_major: string | null;
  final_major: string | null;
  result_major: string | null;
  public_note: string | null;
  admin_note: string | null;
}

// Muatan tinjauan admin untuk satu log kuis.
export interface QuizReviewPayload {
  final_major: string | null;
  public_note: string | null;
  admin_note: string | null;
}
