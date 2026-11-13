import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { AuthUser } from "@/shared/types/user.type";

export const getProfileApi = async (): Promise<AuthUser> => {
  const { data } = await http.get<ApiEnvelope<AuthUser>>("/api/v1/admin/auth/me");
  return data.data;
};
