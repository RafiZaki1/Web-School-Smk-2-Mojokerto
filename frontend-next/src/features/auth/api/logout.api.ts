import { http } from "@/shared/lib/http/client";

export const logoutApi = async (): Promise<void> => {
  await http.post("/api/v1/admin/auth/logout");
};
