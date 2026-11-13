// Query key admin. Semua daftar dan detail modul berada di bawah ["admin", <modul>].
export const adminKeys = {
  summary: () => ["admin", "summary"] as const,
  resource: (resource: string) => ["admin", resource] as const,
  list: (resource: string) => ["admin", resource, "list"] as const,
  detail: (resource: string, id: number | string) => ["admin", resource, "detail", String(id)] as const,
};
