import { getStudentGuideApi } from "../api/studentGuidePublic.api";
import { PRACTICE_UNIFORM_PHOTOS } from "../constants/practice-uniform-photos";
import type { RuleFormValues, UniformFormValues } from "../validation/tata-tertib.schema";
import type { PracticeUniform, RuleSection, SchoolRule, SchoolRulePayload, StudentGuide, UniformPayload, UniformSchedule } from "../types/tata-tertib.type";

/** Data halaman /tata-tertib; null bila API tidak bisa dihubungi. */
export async function getStudentGuide(): Promise<StudentGuide | null> {
  return (await getStudentGuideApi()) ?? null;
}

/** Kelompokkan poin aturan per bagian, urutan bagian mengikuti poin pertama yang muncul. */
export function groupRules(rules: SchoolRule[]): RuleSection[] {
  const sections = new Map<string, SchoolRule[]>();
  [...rules]
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .forEach((rule) => sections.set(rule.section, [...(sections.get(rule.section) ?? []), rule]));
  return Array.from(sections, ([section, items]) => ({ section, rules: items }));
}

/** Foto unggahan TU; bila kosong, seragam praktik memakai foto jurusan yang sudah ada. */
export function uniformImage(item: UniformSchedule | PracticeUniform): string | null {
  if (item.image) return item.image;
  return "major_code" in item ? (PRACTICE_UNIFORM_PHOTOS[item.major_code] ?? null) : null;
}

export const toRuleFormValues =(rule: SchoolRule | null, defaultSection = ""): RuleFormValues => ({
  section: rule?.section ?? defaultSection,
  content: rule?.content ?? "",
  is_active: rule?.is_active ?? true,
  sort_order: String(rule?.sort_order ?? 0),
});

export const toRulePayload = (values: RuleFormValues): SchoolRulePayload => ({
  section: values.section.trim(),
  content: values.content.trim(),
  is_active: values.is_active,
  sort_order: Number(values.sort_order || 0),
});

export const toUniformFormValues = (uniform: UniformSchedule | PracticeUniform): UniformFormValues => ({
  name: uniform.name,
  description: uniform.description ?? "",
  image: uniform.image,
});

// Foto lama (URL) tidak dikirim ulang; hanya file baru atau null (hapus).
export const toUniformPayload = (values: UniformFormValues): UniformPayload => ({
  name: values.name.trim(),
  description: values.description.trim() || null,
  image: typeof values.image === "string" ? undefined : values.image,
});
