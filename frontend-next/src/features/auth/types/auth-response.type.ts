import type { AuthUser } from "@/shared/types/user.type";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
