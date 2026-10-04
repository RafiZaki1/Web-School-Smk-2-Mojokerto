"use client";

import StepForm from "../ui/StepForm";
import ListEditor from "../ui/ListEditor";
import LoadErrorNotice from "../ui/LoadErrorNotice";
import { ChoiceChips, InputLongText, InputText, SelectInput } from "../ui/Fields";
import UnggahGambar from "../ui/UnggahGambar";
import useAdminForm from "./useAdminForm";
import { adminApi } from "@/lib/api/adminApi";
import { BKK_KATEGORI } from "@/lib/data/bkkData";

const EMPTY = {
  poster: null,
  judul: "",
  perusahaan: "",
  lokasi: "",
  kategori: BKK_KATEGORI[1],
  tipe: "Full-time",
  tutup: "",
  status: "Aktif",
  deskripsi: "",
  tanggungJawab: [""],
  kualifikasi: [""],
  kontak: "",
  email: "",
};

const fromApi = (job) => ({
  poster: job.poster,
  judul: job.title,
  perusahaan: job.company,
  lokasi: job.location ?? "",
  kategori: job.category ?? BKK_KATEGORI[1],
  tipe: job.employment_type ?? "Full-time",
  tutup: job.closes_at ?? "",
  status: job.status === "closed" ? "Tutup" : "Aktif",
  deskripsi: job.description ?? "",
  tanggungJawab: job.responsibilities?.length ? job.responsibilities : [""],
  kualifikasi: job.qualifications?.length ? job.qualifications : [""],
  kontak: job.contact_phone ?? "",
  email: job.contact_email ?? "",
});

export default function LokerForm({ id }) {
  const form = useAdminForm(adminApi.jobs, id, { empty: EMPTY, fromApi });
  const { data, set } = form;

  if (form.loadError) return <LoadErrorNotice message={form.loadError} backHref="/admin/bkk" />;

  const onSave = () =>
    form.save({
      poster: data.poster,
      title: data.judul.trim(),
      company: data.perusahaan.trim(),
      location: data.lokasi,
      category: data.kategori,
      employment_type: data.tipe,
      closes_at: data.tutup || null,
      status: data.status === "Tutup" ? "closed" : "open",
      description: data.deskripsi,
      responsibilities: data.tanggungJawab.filter((item) => item.trim()),
      qualifications: data.kualifikasi.filter((item) => item.trim()),
      contact_phone: data.kontak,
      contact_email: data.email,
    });

  const steps = [
    {
      label: "Info Dasar",
      title: "Info dasar",
      description: "Poster, judul posisi, perusahaan, dan info ringkas yang tampil di kartu lowongan.",
      validate: () => (!data.judul.trim() || !data.perusahaan.trim() ? "Judul posisi dan nama perusahaan wajib diisi." : null),
      content: (
        <>
          <UnggahGambar label="Poster lowongan" title="Unggah poster lowongan" hint="Potret/landscape, disarankan 800x600px, maks 5MB" value={data.poster} onChange={set("poster")} previewClassName="aspect-[4/3] w-full max-w-[420px]" />
          <InputText label="Judul posisi" placeholder="Contoh: Staff IT Support" value={data.judul} onChange={set("judul")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <InputText label="Nama perusahaan" placeholder="Contoh: PT Kita Lewati Berdua" value={data.perusahaan} onChange={set("perusahaan")} />
            <InputText label="Lokasi" placeholder="Contoh: Mojokerto" value={data.lokasi} onChange={set("lokasi")} />
          </div>
          <ChoiceChips label="Kategori bidang" options={BKK_KATEGORI} value={data.kategori} onChange={set("kategori")} />
          <div className="grid gap-5 sm:grid-cols-3">
            <SelectInput label="Tipe kerja" options={["Full-time", "Part-time", "Magang", "Kontrak"]} value={data.tipe} onChange={set("tipe")} />
            <InputText type="date" label="Tanggal tutup" value={data.tutup} onChange={set("tutup")} />
            <SelectInput label="Status" options={["Aktif", "Tutup"]} value={data.status} onChange={set("status")} />
          </div>
        </>
      ),
    },
    {
      label: "Detail Pekerjaan",
      title: "Detail pekerjaan",
      description: "Deskripsi, tanggung jawab, dan kualifikasi yang tampil di halaman detail lowongan.",
      validate: () => (data.email && !/^\S+@\S+\.\S+$/.test(data.email) ? "Format email pelamar tidak valid." : null),
      content: (
        <>
          <InputLongText label="Deskripsi pekerjaan" rows={5} value={data.deskripsi} onChange={set("deskripsi")} placeholder="Gambaran singkat posisi ini..." />
          <ListEditor label="Tanggung jawab" items={data.tanggungJawab} onChange={set("tanggungJawab")} />
          <ListEditor label="Kualifikasi" items={data.kualifikasi} onChange={set("kualifikasi")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <InputText label="Kontak pelamar (telepon/WA)" placeholder="0812-3456-7890" value={data.kontak} onChange={set("kontak")} />
            <InputText type="email" label="Email pelamar" placeholder="bkk.smkn2mr@gmail.com" value={data.email} onChange={set("email")} />
          </div>
        </>
      ),
    },
  ];

  return (
    <StepForm
      title={form.isEdit ? "Ubah Lowongan" : "Tambah Lowongan"}
      subtitle="Lengkapi data untuk kartu dan halaman detail lowongan di BKK"
      steps={steps}
      backHref="/admin/bkk"
      saveLabel="Simpan Lowongan"
      onSave={onSave}
      loading={form.loading}
    />
  );
}
