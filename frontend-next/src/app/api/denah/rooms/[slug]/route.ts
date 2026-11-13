import { NextResponse } from "next/server";
import { fetchPublic } from "@/shared/lib/http/client";
import type { Room } from "@/features/denah/types/denah.type";

const SLUG = /^[a-z0-9-]{1,100}$/;

// Detail ruangan, di-cache seperti daftar ruangan (lihat ../route.ts). Denah di beranda langsung
// membuka ruangan bawaan, jadi detail yang sama diminta oleh hampir setiap pengunjung.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Hanya slug/ID yang wajar yang diteruskan, agar isi cache tidak bisa dibanjiri alamat acak
  if (!SLUG.test(slug)) return NextResponse.json({ data: null }, { status: 404 });

  const data = await fetchPublic<Room>(`/rooms/${slug}`);
  if (data === undefined) return NextResponse.json({ data: null }, { status: 404 });
  if (data === null) return NextResponse.json({ data: null }, { status: 502 });
  return NextResponse.json({ data });
}
