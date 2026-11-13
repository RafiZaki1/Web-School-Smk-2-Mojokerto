import path from "path";

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Halaman lain yang dibuka dari situs ini tidak bisa mengendalikan tab ini (window.opener)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  // Hanya berlaku saat situs dibuka lewat HTTPS; diabaikan browser di HTTP lokal
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

// Gambar unggahan admin disajikan Laravel di /storage; host-nya mengikuti alamat API
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8001");
const isLocalApi = ["127.0.0.1", "localhost", "::1", "[::1]"].includes(apiUrl.hostname);

const nextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  experimental: {
    // Root layout ada di app/[locale], jadi alamat yang tidak dikenal memakai app/global-not-found.tsx
    globalNotFound: true,
  },
  turbopack: {
    root: path.resolve("."),
  },
  images: {
    // Gambar diperkecil sesuai ukuran tampil dan dikirim sebagai WebP, bukan file aslinya
    minimumCacheTTL: 60 * 60 * 24,
    // Next menolak mengambil gambar dari IP lokal; diizinkan hanya bila API memang berjalan lokal
    dangerouslyAllowLocalIP: isLocalApi,
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", ""),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Aset statis di public/ jarang berubah, simpan di cache browser sehari agar tidak diunduh ulang
      {
        source: "/:all*(webp|png|jpg|jpeg|svg|ico|gif|avif)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
