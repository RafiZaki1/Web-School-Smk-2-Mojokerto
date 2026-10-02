"use client";

import StepForm from "../ui/StepForm";
import LoadErrorNotice from "../ui/LoadErrorNotice";
import { ChoiceChips, InputLongText, InputText } from "../ui/Fields";
import UnggahGambar, { GaleriUnggah } from "../ui/UnggahGambar";
import useAdminForm from "./useAdminForm";
import { adminApi } from "@/lib/api/adminApi";
import { BERITA_KATEGORI } from "@/lib/data/beritaData";

const EMPTY = {
  judul: "",
  kategori: BERITA_KATEGORI[0],
  penulis: "Admin Sekolah",
  tanggal: "",
  sampul: null,
  isi: "",
  galeri: [],
};

const fromApi = (item) => ({
  judul: item.title,
  kategori: item.category,
  penulis: item.author ?? "Admin Sekolah",
  tanggal: item.published_at ?? "",
  sampul: item.cover_image,
  isi: item.body ?? "",
  galeri: item.gallery ?? [],
});

export default function BeritaForm({ id }) {
  const form = useAdminForm(adminApi.articles, id, { empty: EMPTY, fromApi });
  const { data, set } = form;

  if (form.loadError) return <LoadErrorNotice message={form.loadError} backHref="/admin/berita" />;

  const onSave = ({ draft }) =>
    form.save({
      title: data.judul.trim(),
      category: data.kategori,
      author: data.penulis,
      published_at: data.tanggal || undefined,
      cover_image: data.sampul,
      body: data.isi,
      gallery: data.galeri,
      is_published: !draft,
    });

  const steps = [
    {
      label: "Info Dasar",
      title: "Info dasar",
      description: "Judul, kategori, penulis, dan foto sampul yang tampil di daftar dan bagian atas halaman berita.",
      validate: () => (!data.judul.trim() ? "Judul berita wajib diisi." : null),
      content: (
        <>
          <InputText label="Judul berita" placeholder="Tulis judul berita..." value={data.judul} onChange={set("judul")} />
          <ChoiceChips label="Kategori" options={BERITA_KATEGORI} value={data.kategori} onChange={set("kategori")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <InputText label="Penulis" value={data.penulis} onChange={set("penulis")} />
            <InputText type="date" label="Tanggal publish" hint="Kosongkan untuk memakai tanggal hari ini" value={data.tanggal} onChange={set("tanggal")} />
          </div>
          <UnggahGambar label="Foto sampul" title="Unggah foto sampul" hint="Landscape, disarankan 1200×720px, maks 5MB" value={data.sampul} onChange={set("sampul")} />
        </>
      ),
    },
    {
      label: "Konten & Galeri",
      title: "Konten & galeri",
      description: "Isi lengkap berita dan foto-foto tambahan yang tampil di bagian bawah artikel. Pisahkan paragraf dengan baris kosong.",
      validate: () => (data.isi.trim().length < 20 ? "Isi berita minimal 20 karakter." : null),
      content: (
        <>
          <InputLongText label="Isi berita" rows={10} value={data.isi} onChange={set("isi")} placeholder="Tulis isi berita lengkap..." />
          <GaleriUnggah label="Galeri foto tambahan" files={data.galeri} onChange={set("galeri")} />
        </>
      ),
    },
  ];

  return (
    <StepForm
      title={form.isEdit ? "Ubah Berita" : "Tambah Berita"}
      subtitle="Lengkapi data untuk halaman detail berita/artikel"
      steps={steps}
      backHref="/admin/berita"
      draftLabel="Simpan sebagai draf"
      saveLabel="Simpan & Publish"
      onSave={onSave}
      loading={form.loading}
    />
  );
}
