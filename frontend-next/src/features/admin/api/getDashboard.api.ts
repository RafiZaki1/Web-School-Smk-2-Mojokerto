import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { AdminDashboardSummary } from "../types/dashboard.type";

export const getDashboardApi = async (): Promise<AdminDashboardSummary> => {
  const { data } = await http.get<ApiEnvelope<AdminDashboardSummary>>("/api/v1/admin/dashboard");
  return data.data;
};
