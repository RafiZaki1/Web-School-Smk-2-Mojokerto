"use client";

import StepForm from "../ui/StepForm";
import LoadErrorNotice from "../ui/LoadErrorNotice";
import { ChoiceChips, InputLongText, InputText, SelectInput } from "../ui/Fields";
import UnggahGambar, { GaleriUnggah } from "../ui/UnggahGambar";
import useAdminForm from "./useAdminForm";
import { adminApi } from "@/lib/api/adminApi";

const PREDIKAT = ["Juara 1", "Juara 2", "Juara 3", "Medali", "Harapan"];
const TINGKAT = ["Lokal", "Regional", "Provinsi", "Nasional", "Internasional"];
const KATEGORI = ["Akademik", "Non-akademik", "Olahraga", "Seni"];

const EMPTY = {
  judul: "",
  predikat: "Juara 1",
  tingkat: "Provinsi",
  kategori: "Akademik",
  siswa: "",
  kelas: "",
  fotoProfil: null,
  sampul: null,
  mulai: "",
  selesai: "",
  lokasi: "",
  penyelenggara: "",
  ringkasan: "",
  deskripsi: "",
  dokumen: null,
  testimoni: "",
  testiNama: "",
  testiJabatan: "",
  galeriJudul: "Galeri Momen",
  galeriDesc: "",
  galeri: [],
};

const fromApi = (item) => ({
  judul: item.title,
  predikat: item.rank,
  tingkat: item.level,
  kategori: item.category ?? "Akademik",
  siswa: item.student_name,
  kelas: item.student_class ?? "",
  fotoProfil: item.student_photo,
  sampul: item.cover_image,
  mulai: item.start_date ?? "",
  selesai: item.end_date ?? "",
  lokasi: item.location ?? "",
  penyelenggara: item.organizer ?? "",
  ringkasan: item.summary ?? "",
  deskripsi: item.description ?? "",
  dokumen: item.document,
  testimoni: item.testimonial?.quote ?? "",
  testiNama: item.testimonial?.name ?? "",
  testiJabatan: item.testimonial?.position ?? "",
  galeriJudul: item.gallery_title ?? "Galeri Momen",
  galeriDesc: item.gallery_description ?? "",
  galeri: item.gallery ?? [],
});

export default function PrestasiForm({ id }) {
  const form = useAdminForm(adminApi.achievements, id, { empty: EMPTY, fromApi });
  const { data, set } = form;

  if (form.loadError) return <LoadErrorNotice message={form.loadError} backHref="/admin/prestasi" />;

  const onSave = ({ draft }) =>
    form.save({
      title: data.judul.trim(),
      rank: data.predikat,
      level: data.tingkat,
      category: data.kategori,
      student_name: data.siswa.trim(),
      student_class: data.kelas,
      student_photo: data.fotoProfil,
      cover_image: data.sampul,
      start_date: data.mulai || null,
      end_date: data.selesai || null,
      location: data.lokasi,
      organizer: data.penyelenggara,
      summary: data.ringkasan,
      description: data.deskripsi,
      document: data.dokumen,
      testimonial: { quote: data.testimoni, name: data.testiNama, position: data.testiJabatan },
      gallery_title: data.galeriJudul,
      gallery_description: data.galeriDesc,
      gallery: data.galeri,
      is_published: !draft,
    });

  const steps = [
    {
      label: "Info Dasar",
      title: "Info dasar prestasi",
      description: "Judul, predikat, dan profil siswa yang tampil di bagian atas (hero) halaman detail.",
      validate: () => (!data.judul.trim() || !data.siswa.trim() ? "Judul prestasi dan nama siswa wajib diisi." : null),
      content: (
        <>
          <InputText label="Judul prestasi" placeholder="Contoh: Duta Koperasi Provinsi" value={data.judul} onChange={set("judul")} />
          <div className="grid gap-5 lg:grid-cols-2">
            <ChoiceChips label="Predikat" options={PREDIKAT} value={data.predikat} onChange={set("predikat")} />
            <SelectInput label="Tingkat" options={TINGKAT} value={data.tingkat} onChange={set("tingkat")} />
          </div>
          <ChoiceChips label="Kategori" options={KATEGORI} value={data.kategori} onChange={set("kategori")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <InputText label="Nama siswa" placeholder="Contoh: Carla Nur Parawansa" value={data.siswa} onChange={set("siswa")} />
            <InputText label="Kelas" placeholder="Contoh: XII LPS 2" value={data.kelas} onChange={set("kelas")} />
          </div>
          <UnggahGambar
            variant="inline"
            label="Foto profil siswa"
            title="Unggah foto profil"
            hint="Foto bulat kecil di sebelah nama siswa"
            value={data.fotoProfil}
            onChange={set("fotoProfil")}
          />
          <UnggahGambar label="Foto sampul (hero)" title="Unggah foto sampul" hint="Landscape, disarankan 1600×700px, maks 5MB" value={data.sampul} onChange={set("sampul")} />
        </>
      ),
    },
    {
      label: "Detail Acara",
      title: "Detail acara",
      description: "Informasi ini tampil sebagai kartu-kartu kecil di sisi kanan hero halaman detail.",
      validate: () => (data.mulai && data.selesai && data.selesai < data.mulai ? "Tanggal selesai tidak boleh sebelum tanggal mulai." : null),
      content: (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <InputText type="date" label="Tanggal mulai" value={data.mulai} onChange={set("mulai")} />
            <InputText type="date" label="Tanggal selesai" value={data.selesai} onChange={set("selesai")} />
          </div>
          <InputText label="Lokasi" placeholder="Contoh: Gedung Negara Grahadi, Surabaya" value={data.lokasi} onChange={set("lokasi")} />
          <InputText label="Penyelenggara" placeholder="Contoh: Dinas Koperasi dan UKM Prov. Jatim" value={data.penyelenggara} onChange={set("penyelenggara")} />
        </>
      ),
    },
    {
      label: "Konten & Testimoni",
      title: "Konten & testimoni",
      description: "Ringkasan, deskripsi lengkap, dokumen resmi, dan kutipan testimoni yang tampil di bagian isi halaman detail.",
      content: (
        <>
          <InputLongText label="Ringkasan singkat (highlight)" rows={3} value={data.ringkasan} onChange={set("ringkasan")} placeholder="Satu-dua kalimat inti tentang prestasi ini..." />
          <InputLongText label="Deskripsi lengkap" hint="Pisahkan paragraf dengan baris kosong." rows={6} value={data.deskripsi} onChange={set("deskripsi")} placeholder="Ceritakan proses dan makna prestasi ini..." />
          <UnggahGambar
            label="Dokumen resmi (opsional)"
            title="Unggah dokumen/sertifikat"
            hint="PDF/JPG/PNG, maks 5MB"
            accept="application/pdf,image/*"
            value={data.dokumen}
            onChange={set("dokumen")}
          />
          <div className="space-y-4 rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] p-5">
            <InputLongText label="Testimoni" rows={3} value={data.testimoni} onChange={set("testimoni")} placeholder="Kutipan dari kepala sekolah atau pembina..." />
            <div className="grid gap-4 sm:grid-cols-2">
              <InputText placeholder="Nama, mis: Bapak Iswahyudi, S.ST." aria-label="Nama pemberi testimoni" value={data.testiNama} onChange={set("testiNama")} />
              <InputText placeholder="Jabatan, mis: Kepala SMKN 2 Kota Mojokerto" aria-label="Jabatan pemberi testimoni" value={data.testiJabatan} onChange={set("testiJabatan")} />
            </div>
          </div>
        </>
      ),
    },
    {
      label: "Galeri Momen",
      title: "Galeri momen",
      description: "Kumpulan foto dokumentasi yang tampil di bagian bawah halaman detail.",
      content: (
        <>
          <InputText label="Judul galeri" value={data.galeriJudul} onChange={set("galeriJudul")} />
          <InputLongText label="Deskripsi singkat" rows={2} value={data.galeriDesc} onChange={set("galeriDesc")} placeholder="Kumpulan dokumentasi selama proses seleksi..." />
          <GaleriUnggah label="Foto-foto" files={data.galeri} onChange={set("galeri")} />
        </>
      ),
    },
  ];

  return (
    <StepForm
      title={form.isEdit ? "Ubah Prestasi" : "Tambah Prestasi"}
      subtitle="Lengkapi data untuk halaman detail prestasi"
      steps={steps}
      backHref="/admin/prestasi"
      draftLabel="Simpan sebagai draf"
      saveLabel="Simpan Prestasi"
      onSave={onSave}
      loading={form.loading}
    />
  );
}
