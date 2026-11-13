import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { AuthResponse, LoginRequest } from "../types/auth-response.type";

export const loginApi = async (payload: LoginRequest): Promise<AuthResponse> => {
  const { data } = await http.post<ApiEnvelope<AuthResponse>>("/api/v1/admin/auth/login", payload);
  return data.data;
};
