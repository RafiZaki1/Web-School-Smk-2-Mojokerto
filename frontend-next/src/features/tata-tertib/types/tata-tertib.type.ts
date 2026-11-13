import type { UploadValue } from "@/shared/components/form/FormImageUpload";

// Mengikuti SchoolRuleResource, UniformScheduleResource, PracticeUniformResource, dan StudentGuidePublicController.
export interface SchoolRule {
  id: number;
  section: string;
  content: string;
  is_active: boolean;
  sort_order: number;
  updated_at: string | null;
}

export interface SchoolRulePayload {
  section: string;
  content: string;
  is_active: boolean;
  sort_order: number;
}

export interface UniformSchedule {
  id: number;
  day: string;
  day_label: string;
  name: string;
  description: string | null;
  image: string | null;
  updated_at: string | null;
}

export interface PracticeUniform {
  id: number;
  major_code: string;
  major_label: string;
  name: string;
  description: string | null;
  image: string | null;
  updated_at: string | null;
}

/** Jadwal seragam harian dan seragam praktik memakai bentuk ubah yang sama. */
export interface UniformPayload {
  name: string;
  description: string | null;
  image?: UploadValue;
}

export interface StudentGuide {
  rules: SchoolRule[];
  uniform_schedules: UniformSchedule[];
  practice_uniforms: PracticeUniform[];
}

export interface RuleSection {
  section: string;
  rules: SchoolRule[];
}
