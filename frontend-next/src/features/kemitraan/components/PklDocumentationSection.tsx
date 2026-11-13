import Link from "next/link";
import type { InternshipDocumentation } from "../types/kemitraan.type";
import { PklGallery } from "./PklGallery";

/** Section beranda: foto dokumentasi PKL terbaru dari TU. Tidak tampil bila belum ada foto. */
export function PklDocumentationSection({ items }: { items: InternshipDocumentation[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-page py-16 lg:py-24" aria-labelledby="judul-dokumentasi-pkl-beranda">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="judul-dokumentasi-pkl-beranda" className="text-2xl font-bold text-heading sm:text-[32px]">
              Dokumentasi PKL
            </h2>
            <p className="mt-2 max-w-[640px] text-base text-muted">Kegiatan siswa selama Praktik Kerja Lapangan di perusahaan mitra.</p>
          </div>
          <Link href="/kemitraan#dokumentasi-pkl" className="svc-link text-[15px] font-semibold">
            Lihat semua dokumentasi
          </Link>
        </div>
        <div className="mt-8">
          <PklGallery items={items} />
        </div>
      </div>
    </section>
  );
}
