import { EmptyState, ErrorState } from "@/shared/components/feedback/StatusState";
import type { KemitraanData } from "../services/kemitraan.service";
import { PartnerDirectory } from "./PartnerDirectory";
import { PklGallery } from "./PklGallery";

/** Isi halaman /kemitraan: mitra DU/DI per jurusan dan galeri dokumentasi PKL. */
export function KemitraanView({ data }: { data: KemitraanData }) {
  return (
    <>
      <header className="max-w-[760px]">
        <h1 className="text-3xl font-bold text-heading sm:text-[34px]">Kemitraan & PKL</h1>
        <p className="mt-3 text-base leading-relaxed text-body">Perusahaan dan instansi mitra tempat siswa SMKN 2 Kota Mojokerto menjalani Praktik Kerja Lapangan, beserta dokumentasi kegiatannya.</p>
      </header>

      {!data.available ? (
        <div className="mt-8">
          <ErrorState title="Data kemitraan belum bisa dimuat" description="Coba muat ulang halaman beberapa saat lagi." />
        </div>
      ) : (
        <>
          <section className="mt-10" aria-labelledby="judul-mitra">
            <h2 id="judul-mitra" className="text-2xl font-bold text-heading sm:text-[28px]">
              Mitra DU/DI
            </h2>
            <p className="mt-1 text-[15px] text-muted">{data.partners.length} mitra aktif</p>
            <div className="mt-5">{data.partners.length ? <PartnerDirectory partners={data.partners} /> : <EmptyState title="Daftar mitra belum diisi" />}</div>
          </section>

          <section id="dokumentasi-pkl" className="mt-16 scroll-mt-28" aria-labelledby="judul-pkl">
            <h2 id="judul-pkl" className="text-2xl font-bold text-heading sm:text-[28px]">
              Dokumentasi PKL
            </h2>
            <div className="mt-5">{data.documentations.length ? <PklGallery items={data.documentations} /> : <EmptyState title="Belum ada dokumentasi PKL" />}</div>
          </section>
        </>
      )}
    </>
  );
}
