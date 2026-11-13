import { NextResponse, type NextRequest } from "next/server";
import { http } from "@/shared/lib/http/client";
import { ApiError } from "@/shared/lib/http/api-error";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { MapRouteRecord } from "@/features/denah/types/denah.type";

const SLUG = /^[a-z0-9-]{1,100}$/;

// Rute antar dua ruangan, di-cache 60 detik per pasangan asal-tujuan. Rute bawaan denah di beranda
// (gerbang utama ke Lab TEFA) sama untuk semua pengunjung, jadi cukup dihitung Laravel sekali per menit.
export async function GET(request: NextRequest) {
  const from = request.nextUrl.searchParams.get("from") ?? "";
  const to = request.nextUrl.searchParams.get("to") ?? "";
  // Hanya slug yang wajar yang diteruskan, agar isi cache tidak bisa dibanjiri alamat acak
  if (!SLUG.test(from) || !SLUG.test(to)) {
    return NextResponse.json({ data: null, meta: { message: "Origin dan destination wajib ditentukan." } }, { status: 422 });
  }

  try {
    const { data } = await http.get<ApiEnvelope<MapRouteRecord>>("/api/v1/public/map/route", {
      params: { from, to },
      adapter: "fetch",
      fetchOptions: { next: { revalidate: 60 } },
      timeout: 8_000,
    });
    return NextResponse.json({ data: data.data });
  } catch (error) {
    // Status dan pesan Laravel diteruskan apa adanya, karena UI denah menampilkan pesannya
    const status = error instanceof ApiError && error.status ? error.status : 502;
    const message = error instanceof Error ? error.message : "Rute gagal dihitung.";
    return NextResponse.json({ data: null, meta: { message } }, { status });
  }
}
