// Query key denah. Semua data denah berada di bawah ["denah"].
export const denahKeys = {
  rooms: () => ["denah", "rooms"] as const,
  categories: () => ["denah", "categories"] as const,
  room: (key: string) => ["denah", "room", key] as const,
  search: (term: string) => ["denah", "search", term] as const,
  route: (from: string, to: string) => ["denah", "route", from, to] as const,
};
