"use client";

import { useAdminDelete, useAdminList, useAdminSave } from "@/features/admin";
import { practiceUniformAdminApi, schoolRuleAdminApi, uniformScheduleAdminApi } from "../api/studentGuideAdmin.api";
import { PRACTICE_RESOURCE, RULE_RESOURCE, SCHEDULE_RESOURCE } from "../constants/tata-tertib-keys";
import type { AdminResource } from "@/shared/lib/http/admin-resource";
import type { PracticeUniform, SchoolRule, UniformPayload, UniformSchedule } from "../types/tata-tertib.type";

export const useSchoolRulesAdmin = () => useAdminList(RULE_RESOURCE, schoolRuleAdminApi.list);
export const useSaveSchoolRule = (id: number | null) => useAdminSave(RULE_RESOURCE, id ? String(id) : undefined, schoolRuleAdminApi);
export const useDeleteSchoolRule = () => useAdminDelete<SchoolRule>(RULE_RESOURCE, (row) => schoolRuleAdminApi.remove(row.id));

export const useUniformSchedulesAdmin = () => useAdminList(SCHEDULE_RESOURCE, uniformScheduleAdminApi.list);
export const usePracticeUniformsAdmin = () => useAdminList(PRACTICE_RESOURCE, practiceUniformAdminApi.list);

/** Simpan jadwal seragam harian ("schedule") atau seragam praktik jurusan ("practice"). */
export function useSaveUniform(kind: "schedule" | "practice", id: number) {
  const api: AdminResource<UniformSchedule | PracticeUniform, UniformPayload> = kind === "schedule" ? uniformScheduleAdminApi : practiceUniformAdminApi;
  return useAdminSave(kind === "schedule" ? SCHEDULE_RESOURCE : PRACTICE_RESOURCE, String(id), api);
}
