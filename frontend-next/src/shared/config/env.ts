// Satu-satunya tempat membaca environment variable. Next hanya meng-inline akses literal
// `process.env.NEXT_PUBLIC_*`, jadi nama variabel harus ditulis langsung seperti di bawah.
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
