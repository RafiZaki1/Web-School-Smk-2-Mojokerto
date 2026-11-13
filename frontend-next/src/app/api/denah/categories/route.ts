import { NextResponse } from "next/server";
import { fetchPublic } from "@/shared/lib/http/client";
import type { RoomCategory } from "@/features/denah/types/denah.type";

// Kategori denah, di-cache seperti daftar ruangan (lihat ../rooms/route.ts)
export async function GET() {
  const data = await fetchPublic<RoomCategory[]>("/map/categories");
  if (data === null) return NextResponse.json({ data: null }, { status: 502 });
  return NextResponse.json({ data: data ?? [] });
}
