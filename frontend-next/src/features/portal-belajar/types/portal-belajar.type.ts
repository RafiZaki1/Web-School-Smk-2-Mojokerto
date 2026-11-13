import type { LucideIcon } from "lucide-react";

export type TeacherGroupKey =
  | "semua"
  | "umum"
  | "rpl"
  | "dkv"
  | "kuliner"
  | "lps"
  | "aphp"
  | "bk-kik";

export interface TeacherGroupMeta {
  id: TeacherGroupKey;
  label: string;
  shortLabel: string;
  badgeClass: string;
  categoryId: number;
}

export interface ElearningTeacher {
  id: string;
  name: string;
  role: string;
  group: Exclude<TeacherGroupKey, "semua">;
  subjects: string[];
  categoryId: number;
  semesterInfo?: string;
}

export interface ElearningPillar {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
}

export interface ElearningStat {
  value: string;
  label: string;
  detail: string;
}

export interface PortalStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

