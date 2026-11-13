// Mengikuti App\Http\Resources\UserResource di backend.
export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  initials: string;
}

// Nilai RoleEnum di backend. admin_tu = satu akun bersama Tata Usaha.
export const ROLES = { admin: "admin", adminTu: "admin_tu" } as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Halaman awal panel sesuai role: akun TU langsung ke meja kerja TU. */
export const homePathFor = (role: string | null | undefined): string => (role === ROLES.adminTu ? "/admin/tu" : "/admin");
