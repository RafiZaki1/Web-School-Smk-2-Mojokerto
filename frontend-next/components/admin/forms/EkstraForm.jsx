"use client";

import { Plus, Trash2 } from "lucide-react";
import AdminButton from "../ui/AdminButton";
import StepForm from "../ui/StepForm";
import ListEditor from "../ui/ListEditor";
import LoadErrorNotice from "../ui/LoadErrorNotice";
import { InputLongText, InputText } from "../ui/Fields";
import { IconPicker } from "../ui/TagIconInput";
import UnggahGambar, { GaleriUnggah } from "../ui/UnggahGambar";
import useAdminForm from "./useAdminForm";
import { adminApi } from "@/lib/api/adminApi";

const EMPTY = {
  ikon: "Sparkles",
  nama: "",
  fokus: "",
  deskripsi: "",
  sampul: null,
  jadwal: "",
  lokasi: "",
  anggota: "",
  tentangJudul: "",
  tentang: "",
  galeriJudul: "Momen latihan & Event",
  galeri: [],
  pencapaian: [""],
  pencapaianIkon: [],
  testimoni: [{ kutipan: "", nama: "" }],
};

const fromApi = (item) => ({
  ikon: item.icon ?? "Sparkles",
  nama: item.name,
  fokus: item.tagline ?? "",
  deskripsi: item.summary ?? "",
  sampul: item.cover_image,
  jadwal: item.schedule ?? "",
  lokasi: item.location ?? "",
  anggota: item.members ?? "",
  tentangJudul: item.about_title ?? "",
  tentang: item.about ?? "",
  galeriJudul: item.gallery_title ?? "Momen latihan & Event",
  galeri: item.gallery ?? [],
  pencapaian: item.achievements?.length ? item.achievements.map((achievement) => achievement.text) : [""],
  // Ikon pencapaian lama (piala/medali) dipertahankan per baris
  pencapaianIkon: (item.achievements ?? []).map((achievement) => achievement.icon),
  testimoni: item.testimonials?.length ? item.testimonials.map((testi) => ({ kutipan: testi.quote, nama: testi.author ?? "" })) : [{ kutipan: "", nama: "" }],
});

export default function EkstraForm({ id }) {
  const form = useAdminForm(adminApi.extracurriculars, id, { empty: EMPTY, fromApi });
  const { data, set, setData } = form;
  const setTestimoni = (index, key, value) =>
    setData((prev) => ({ ...prev, testimoni: prev.testimoni.map((item, i) => (i === index ? { ...item, [key]: value } : item)) }));

  if (form.loadError) return <LoadErrorNotice message={form.loadError} backHref="/admin/ekstrakurikuler" />;

  const onSave = ({ draft }) =>
    form.save({
      icon: data.ikon,
      name: data.nama.trim(),
      tagline: data.fokus,
      summary: data.deskripsi,
      cover_image: data.sampul,
      schedule: data.jadwal,
      location: data.lokasi,
      members: data.anggota,
      about_title: data.tentangJudul,
      about: data.tentang,
      gallery_title: data.galeriJudul,
      gallery: data.galeri,
      achievements: data.pencapaian
        .map((text, index) => ({ text: text.trim(), icon: data.pencapaianIkon[index] ?? "trophy" }))
        .filter((item) => item.text),
      testimonials: data.testimoni.filter((item) => item.kutipan.trim()).map((item) => ({ quote: item.kutipan, author: item.nama })),
      is_published: !draft,
    });

  const steps = [
    {
      label: "Info Dasar",
      title: "Info dasar",
      description: "Nama, deskripsi singkat, dan info ringkas yang tampil di bagian hero halaman detail.",
      validate: () => (!data.nama.trim() ? "Nama ekstrakurikuler wajib diisi." : null),
      content: (
        <>
          <IconPicker label="Ikon ekstrakurikuler" value={data.ikon} onChange={set("ikon")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <InputText label="Nama ekstrakurikuler" placeholder="Contoh: Paskibra" value={data.nama} onChange={set("nama")} />
            <InputText label="Fokus kegiatan" placeholder="Contoh: Disiplin & kepemimpinan" value={data.fokus} onChange={set("fokus")} />
          </div>
          <InputLongText label="Deskripsi singkat (hero)" rows={3} value={data.deskripsi} onChange={set("deskripsi")} placeholder="Satu-dua kalimat tentang kegiatan ini..." />
          <UnggahGambar label="Foto sampul (hero)" title="Unggah foto sampul" hint="Landscape, disarankan 1600×700px, maks 5MB" value={data.sampul} onChange={set("sampul")} />
          <div>
            <p className="field__label">Info ringkas (3 kartu di bawah hero)</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <InputText placeholder="Selasa & Jumat" aria-label="Jadwal latihan" value={data.jadwal} onChange={set("jadwal")} />
              <InputText placeholder="Lapangan Upacara" aria-label="Lokasi" value={data.lokasi} onChange={set("lokasi")} />
              <InputText placeholder="45 Siswa" aria-label="Anggota aktif" value={data.anggota} onChange={set("anggota")} />
            </div>
            <p className="field__hint">Label: Jadwal latihan · Lokasi · Anggota aktif</p>
          </div>
        </>
      ),
    },
    {
      label: "Tentang",
      title: "Tentang",
      description: 'Judul dan deskripsi lengkap yang tampil di bagian "Tentang" halaman detail.',
      content: (
        <>
          <InputText
            label="Judul section"
            placeholder="Contoh: Lebih dari sekadar baris-berbaris"
            hint='Label kecil di atasnya otomatis: "TENTANG [NAMA EKSTRAKURIKULER]"'
            value={data.tentangJudul}
            onChange={set("tentangJudul")}
          />
          <InputLongText label="Deskripsi lengkap" rows={6} value={data.tentang} onChange={set("tentang")} placeholder="Ceritakan kegiatan dan manfaatnya bagi siswa..." />
        </>
      ),
    },
    {
      label: "Dokumentasi & Prestasi",
      title: "Dokumentasi & prestasi",
      description: "Foto momen latihan/event, dan daftar pencapaian anggota.",
      content: (
        <>
          <InputText label="Judul galeri" value={data.galeriJudul} onChange={set("galeriJudul")} />
          <GaleriUnggah label="Foto dokumentasi" files={data.galeri} onChange={set("galeri")} />
          <ListEditor label="Pencapaian anggota" items={data.pencapaian} onChange={set("pencapaian")} placeholder="Contoh: Juara 1 Lomba Baris-Berbaris — 2024" addLabel="Tambah Pencapaian" />
        </>
      ),
    },
    {
      label: "Testimoni",
      title: "Testimoni",
      description: "Kutipan dari anggota yang tampil di bagian bawah halaman detail.",
      content: (
        <>
          {data.testimoni.map((item, index) => (
            <div key={index} className="space-y-4 rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] p-5">
              <div className="flex items-start gap-2">
                <InputLongText
                  className="flex-1"
                  label={`Testimoni ${data.testimoni.length > 1 ? index + 1 : ""}`.trim()}
                  rows={3}
                  placeholder="Masukkan testimoni anggota..."
                  value={item.kutipan}
                  onChange={(event) => setTestimoni(index, "kutipan", event.target.value)}
                />
                {data.testimoni.length > 1 ? (
                  <button type="button" className="adm-icon-btn adm-icon-btn--danger mt-8" onClick={() => set("testimoni")(data.testimoni.filter((_, i) => i !== index))} aria-label={`Hapus testimoni ${index + 1}`}>
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <InputText
                placeholder="Nama anggota (opsional) — misal: Anggota Paskibra, kelas 11"
                aria-label="Nama anggota"
                hint="Boleh dikosongkan kalau testimoni ditampilkan anonim."
                value={item.nama}
                onChange={(event) => setTestimoni(index, "nama", event.target.value)}
              />
            </div>
          ))}
          <AdminButton variant="ghost" icon={Plus} className="w-fit" onClick={() => set("testimoni")([...data.testimoni, { kutipan: "", nama: "" }])}>
            Tambah Testimoni Lainnya
          </AdminButton>
        </>
      ),
    },
  ];

  return (
    <StepForm
      title={form.isEdit ? "Ubah Ekstrakurikuler" : "Tambah Ekstrakurikuler"}
      subtitle="Lengkapi data untuk halaman detail ekstrakurikuler"
      steps={steps}
      backHref="/admin/ekstrakurikuler"
      draftLabel="Simpan sebagai draf"
      saveLabel="Simpan Ekstrakurikuler"
      onSave={onSave}
      loading={form.loading}
    />
  );
}
