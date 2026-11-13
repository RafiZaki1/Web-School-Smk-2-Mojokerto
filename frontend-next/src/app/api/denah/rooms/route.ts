import { NextResponse } from "next/server";
import { fetchPublic } from "@/shared/lib/http/client";
import type { Room } from "@/features/denah/types/denah.type";

// Denah tampil di beranda, jadi daftar ruangan diminta hampir setiap pengunjung. Lewat sini
// Laravel cukup dipanggil sekali per menit (data cache Next), bukan sekali per pengunjung.
export async function GET() {
  const data = await fetchPublic<Room[]>("/rooms");
  if (data === null) return NextResponse.json({ data: null }, { status: 502 });
  return NextResponse.json({ data: data ?? [] });
}
