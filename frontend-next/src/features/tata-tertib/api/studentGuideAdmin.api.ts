import { createAdminResource } from "@/shared/lib/http/admin-resource";
import { PRACTICE_PATH, RULE_PATH, SCHEDULE_PATH } from "../constants/tata-tertib-keys";
import type { PracticeUniform, SchoolRule, SchoolRulePayload, UniformPayload, UniformSchedule } from "../types/tata-tertib.type";

// Poin tata tertib: CRUD penuh. Jadwal seragam (Senin-Jumat) dan seragam praktik (5 jurusan): hanya daftar + ubah.
export const schoolRuleAdminApi = createAdminResource<SchoolRule, SchoolRulePayload>(RULE_PATH);
export const uniformScheduleAdminApi = createAdminResource<UniformSchedule, UniformPayload>(SCHEDULE_PATH);
export const practiceUniformAdminApi = createAdminResource<PracticeUniform, UniformPayload>(PRACTICE_PATH);
