export interface StatusCount {
  new?: number;
  in_progress?: number;
  resolved?: number;
}

export type DashboardModule = "majors" | "achievements" | "extracurriculars" | "articles" | "jobs";

export interface DashboardActivity {
  icon: string;
  module: string;
  text: string;
  time: string | null;
}

// Mengikuti App\Services\Content\DashboardService di backend.
export interface AdminDashboardSummary {
  stats: Record<DashboardModule, number>;
  drafts: Partial<Record<DashboardModule, number>>;
  major_quiz: StatusCount;
  activities: DashboardActivity[];
}
