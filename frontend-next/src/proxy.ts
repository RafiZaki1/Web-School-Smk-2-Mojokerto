import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, isIndonesianOnlyPath, isLocale } from "@/shared/lib/i18n/config";

// Proxy hanya menyaring halaman. Aset statis dan gambar dikecualikan lewat matcher
// agar tidak menambah beban tiap request. API dibatasi sendiri oleh Laravel (throttle).
//
// Bahasa: halaman berada di app/[locale]. URL di browser tetap tanpa awalan (/berita), proxy
// meneruskannya ke /id/berita atau /en/berita sesuai cookie. Dengan begitu tiap halaman cukup
// dirender sekali per bahasa lalu disajikan dari cache.

// Situs ini tidak punya PHP, WordPress, atau berkas dotfile, jadi permintaan ke path ini
// pasti pemindai celah keamanan. Langsung ditolak tanpa merender halaman.
const SCANNER_PATH =
  /(\.(php\d?|asp|aspx|jsp|cgi|env|ini|sql|bak|old|swp|log|yml|yaml)$)|(^\/(\.git|\.env|\.aws|\.ssh|\.vscode|\.DS_Store|wp-|wordpress|xmlrpc|phpmyadmin|pma|cgi-bin|vendor\/|storage\/logs|server-status|actuator|HNAP1|boaform))/i;

// Alat serang otomatis. Crawler mesin pencari dan pratinjau tautan (Google, Bing, WhatsApp,
// Facebook, Telegram) sengaja tidak masuk daftar agar SEO dan share link tetap jalan.
const ATTACK_TOOL_UA =
  /(sqlmap|nikto|nmap|masscan|zgrab|wpscan|acunetix|nessus|nuclei|openvas|dirbuster|gobuster|feroxbuster|ffuf|wfuzz|hydra|netsparker|jorgee|w3af|havij|commix|xsstrike|censysinspect|zmeu)/i;

// Batas permintaan halaman per IP. Dibuat longgar karena satu jaringan sekolah sering berbagi
// satu IP publik, tapi tetap menghentikan bot yang membanjiri server.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 300;
const RATE_MAX_TRACKED_IPS = 10_000;

const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest): string | null {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
}

function isRateLimited(ip: string, now: number): boolean {
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    // Bersihkan entri kedaluwarsa agar memori tidak terus bertambah
    if (hits.size >= RATE_MAX_TRACKED_IPS) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
      if (hits.size >= RATE_MAX_TRACKED_IPS) hits.clear();
    }
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX_REQUESTS;
}

const LOCALE_PREFIX = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`);
const ONE_YEAR = 60 * 60 * 24 * 365;

function isPrefetch(request: NextRequest): boolean {
  return request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SCANNER_PATH.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  if (ATTACK_TOOL_UA.test(request.headers.get("user-agent") ?? "")) {
    return new NextResponse(null, { status: 403 });
  }

  // Tautan berawalan bahasa (/en/berita) dialihkan ke alamat biasa dan bahasanya disimpan,
  // supaya setiap halaman hanya punya satu alamat.
  const prefixed = pathname.match(LOCALE_PREFIX);
  if (prefixed) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(prefixed[0].length) || "/";
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, prefixed[1], { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    return response;
  }

  // Prefetch tetap diteruskan ke halaman berbahasa yang benar, tapi tidak dihitung rate limit
  const ip = isPrefetch(request) ? null : clientIp(request);
  if (ip) {
    const now = Date.now();
    if (isRateLimited(ip, now)) {
      const retryAfter = Math.ceil((hits.get(ip)!.resetAt - now) / 1000);
      return new NextResponse("Terlalu banyak permintaan. Coba lagi sebentar.", {
        status: 429,
        headers: { "Retry-After": String(retryAfter), "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isIndonesianOnlyPath(pathname) || !isLocale(saved) ? DEFAULT_LOCALE : saved;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    {
      // Lewati internal Next, route API (src/app/api), metadata, dan semua berkas berekstensi
      // gambar/font/media dari public/, kecuali ekstensi yang memang dipakai pemindai (ditangkap SCANNER_PATH di atas).
      source:
        "/((?!_next/static|_next/image|api/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:webp|png|jpe?g|gif|svg|ico|avif|woff2?|ttf|otf|mp4|webm|mp3|pdf|css|js|map|txt|json|csv)$).*)",
    },
  ],
};
