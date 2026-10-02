"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import AdminButton from "../ui/AdminButton";
import Modal from "../ui/Modal";
import StepForm from "../ui/StepForm";
import { Field, InputLongText, InputText, SelectInput } from "../ui/Fields";
import TagIconInput, { IconPicker } from "../ui/TagIconInput";
import UnggahGambar, { GaleriUnggah } from "../ui/UnggahGambar";
import JurusanIcon from "@/components/jurusan/JurusanIcon";
import LoadErrorNotice from "../ui/LoadErrorNotice";
import useAdminForm from "./useAdminForm";
import { adminApi } from "@/lib/api/adminApi";

const ACCENTS = [
  { label: "Hijau", value: "#22c55e" },
  { label: "Biru", value: "#2563eb" },
  { label: "Merah", value: "#ef4444" },
  { label: "Kuning", value: "#eab308" },
];

function AccentPicker({ value, onChange }) {
  return (
    <Field label="Warna aksen jurusan" hint="Menentukan warna badge, tombol, dan ikon di halaman detail jurusan ini.">
      <div className="flex flex-wrap items-center gap-3" role="radiogroup" aria-label="Warna aksen jurusan">
        {ACCENTS.map((accent) => (
          <button
            key={accent.value}
            type="button"
            role="radio"
            aria-checked={value === accent.value}
            aria-label={accent.label}
            onClick={() => onChange(accent.value)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white ring-offset-2 aria-checked:ring-2 aria-checked:ring-[#0f172a]"
            style={{ backgroundColor: accent.value }}
          >
            {value === accent.value ? <Check size={18} aria-hidden="true" /> : null}
          </button>
        ))}
        <label className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-[#cbd5e1] text-[#64748b]" title="Warna kustom">
          <Plus size={18} aria-hidden="true" />
          <input type="color" className="absolute inset-0 cursor-pointer opacity-0" onChange={(event) => onChange(event.target.value)} aria-label="Warna kustom" />
        </label>
      </div>
    </Field>
  );
}

const emptyProspek = { title: "", desc: "", icon: "BriefcaseBusiness" };

const EMPTY = {
  foto: null,
  code: "",
  status: "Aktif",
  name: "",
  tagline: "",
  akreditasi: "A (Unggul)",
  shortDesc: "",
  longDesc: "",
  accent: "#2563eb",
  kompetensi: [],
  karir: [],
  mitra: [],
  mitraNama: {},
  fasilitasLabel: "Fasilitas Belajar",
  grupFasilitas: [{ judul: "", foto: [] }],
};

// Fasilitas API berupa daftar {title, image}; di form dikelompokkan per judul
const toGroups = (facilities = []) => {
  const groups = [];
  facilities.forEach((item) => {
    const last = groups[groups.length - 1];
    if (last && last.judul === item.title) last.foto.push(item.image);
    else groups.push({ judul: item.title ?? "", foto: [item.image] });
  });
  return groups.length ? groups : [{ judul: "", foto: [] }];
};

const fromApi = (major) => ({
  foto: major.image,
  code: major.code,
  status: major.is_published ? "Aktif" : "Draf",
  name: major.name,
  tagline: major.tagline ?? "",
  akreditasi: major.accreditation ?? "",
  shortDesc: major.summary ?? "",
  longDesc: major.description ?? "",
  accent: major.accent_color ?? "#2563eb",
  kompetensi: major.competencies ?? [],
  karir: (major.careers ?? []).map((item) => ({ title: item.title, desc: item.description ?? "", icon: item.icon })),
  mitra: (major.partners ?? []).map((item) => item.logo),
  mitraNama: Object.fromEntries((major.partners ?? []).map((item) => [item.logo, item.name])),
  fasilitasLabel: major.facility_title ?? "Fasilitas Belajar",
  grupFasilitas: toGroups(major.facilities),
});

export default function JurusanForm({ id }) {
  const form = useAdminForm(adminApi.majors, id, { empty: EMPTY, fromApi });
  const { data, setData } = form;
  const [prospek, setProspek] = useState(null); // { index, value }
  const set = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const onSave = ({ draft }) =>
    form.save({
      code: data.code.trim(),
      name: data.name.trim(),
      tagline: data.tagline,
      accreditation: data.akreditasi,
      summary: data.shortDesc,
      description: data.longDesc,
      image: data.foto,
      accent_color: data.accent,
      competencies: data.kompetensi,
      careers: data.karir.map((item) => ({ icon: item.icon, title: item.title, description: item.desc })),
      partners: data.mitra.map((logo) => ({ logo, name: typeof logo === "string" ? data.mitraNama[logo] : undefined })),
      facility_title: data.fasilitasLabel,
      facilities: data.grupFasilitas.flatMap((grup) => grup.foto.map((image) => ({ title: grup.judul, image }))),
      is_published: !draft && data.status !== "Draf",
    });

  const saveProspek = () => {
    if (!prospek.value.title.trim()) return;
    const list = [...data.karir];
    if (prospek.index === -1) list.push(prospek.value);
    else list[prospek.index] = prospek.value;
    set("karir", list);
    setProspek(null);
  };

  const steps = [
    {
      label: "Info Dasar",
      validate: () => (!data.code.trim() || !data.name.trim() ? "Kode dan nama jurusan wajib diisi." : null),
      content: (
        <>
          <UnggahGambar
            label="Foto/ilustrasi jurusan (untuk card & hero)"
            title="Klik untuk unggah foto"
            hint="atau seret dan lepas file di sini (JPG, PNG max 5MB)"
            value={data.foto}
            onChange={(file) => set("foto", file)}
            previewClassName="aspect-[3/4] w-full max-w-[280px]"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <InputText label="Kode jurusan" placeholder="Contoh: TB" value={data.code} onChange={(event) => set("code", event.target.value.toUpperCase())} />
            <SelectInput label="Status" placeholder="Pilih status" options={["Aktif", "Draf"]} value={data.status} onChange={(value) => set("status", value)} />
          </div>
          <InputText label="Nama jurusan" placeholder="Contoh: Tata Boga" value={data.name} onChange={(event) => set("name", event.target.value)} />
          <div className="grid gap-5 sm:grid-cols-2">
            <InputText label="Bidang / tagline" placeholder="Contoh: Pariwisata & Hospitaliti" value={data.tagline} onChange={(event) => set("tagline", event.target.value)} />
            <InputText label="Akreditasi" placeholder="Contoh: A (Unggul)" value={data.akreditasi} onChange={(event) => set("akreditasi", event.target.value)} />
          </div>
          <InputLongText
            label="Deskripsi singkat (tampil di card landing page)"
            placeholder="1-2 kalimat ringkas tentang jurusan ini..."
            rows={3}
            value={data.shortDesc}
            onChange={(event) => set("shortDesc", event.target.value)}
          />
          <InputLongText
            label='Deskripsi lengkap (tampil di halaman detail — "Apa yang dipelajari?")'
            placeholder="Jelaskan lebih detail materi, praktik, dan kerja sama industri jurusan ini..."
            rows={5}
            value={data.longDesc}
            onChange={(event) => set("longDesc", event.target.value)}
          />
          <AccentPicker value={data.accent} onChange={(value) => set("accent", value)} />
        </>
      ),
    },
    {
      label: "Kompetensi & Karier",
      content: (
        <>
          <div>
            <h2 className="stepform__section-title">Kompetensi utama</h2>
            <p className="stepform__section-desc">Tambahkan poin skill lengkap dengan ikon, akan tampil sebagai tag di halaman detail.</p>
          </div>
          <TagIconInput label="Kompetensi" items={data.kompetensi} onChange={(items) => set("kompetensi", items)} placeholder="Ketik nama kompetensi lalu tekan Enter..." />

          <div>
            <h2 className="stepform__section-title">Prospek karier</h2>
            <p className="stepform__section-desc">Tiap item jadi satu kartu profesi di halaman detail.</p>
          </div>
          <ul className="space-y-3">
            {data.karir.map((item, index) => (
              <li key={`${item.title}-${index}`} className="flex items-start gap-4 rounded-[14px] border border-[#e2e8f0] p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#b7f568] text-[#416900]">
                  <JurusanIcon name={item.icon} size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold text-[#0f172a]">{item.title}</span>
                  <span className="block text-[14px] text-[#475569]">{item.desc}</span>
                </span>
                <button type="button" className="adm-icon-btn" onClick={() => setProspek({ index, value: item })} aria-label={`Ubah ${item.title}`}>
                  <Pencil size={18} aria-hidden="true" />
                </button>
                <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => set("karir", data.karir.filter((_, i) => i !== index))} aria-label={`Hapus ${item.title}`}>
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <AdminButton variant="ghost" icon={Plus} className="w-full border-dashed" onClick={() => setProspek({ index: -1, value: emptyProspek })}>
            Tambah prospek karier
          </AdminButton>
        </>
      ),
    },
    {
      label: "Mitra Industri",
      title: "Logo mitra industri",
      description: "Unggah logo perusahaan/instansi yang bekerja sama dengan jurusan ini. Logo akan tampil sebagai galeri di halaman detail.",
      content: (
        <>
          <GaleriUnggah label="Logo mitra" files={data.mitra} onChange={(files) => set("mitra", files)} />
          <p className="field__hint">Format SVG, PNG, atau JPG. Ukuran maksimal 2MB per logo. Rekomendasi rasio 1:1 dengan latar transparan.</p>
        </>
      ),
    },
    {
      label: "Galeri Fasilitas",
      title: "Galeri fasilitas belajar",
      description: "Buat beberapa grup fasilitas. Tiap grup punya judul sendiri dan kumpulan fotonya, akan tampil sebagai galeri di halaman detail.",
      content: (
        <>
          <div className="rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] p-5">
            <InputText caps label="Label section (tampil sekali di atas galeri)" value={data.fasilitasLabel} onChange={(event) => set("fasilitasLabel", event.target.value)} />
            <p className="mt-4 text-[13px] text-[#64748b]">Pratinjau di halaman detail:</p>
            <p className="mt-1 text-[13px] font-bold tracking-[0.1em] text-[#416900] uppercase">{data.fasilitasLabel || "Fasilitas Belajar"}</p>
          </div>
          {data.grupFasilitas.map((grup, index) => (
            <div key={index} className="space-y-4 rounded-[14px] border border-[#e2e8f0] p-5">
              <div className="flex items-end gap-2">
                <InputText
                  caps
                  className="flex-1"
                  label="Judul grup"
                  placeholder="Contoh: Kunjungan industri & studi lapangan"
                  value={grup.judul}
                  onChange={(event) => set("grupFasilitas", data.grupFasilitas.map((item, i) => (i === index ? { ...item, judul: event.target.value } : item)))}
                />
                {data.grupFasilitas.length > 1 ? (
                  <button type="button" className="adm-icon-btn adm-icon-btn--danger mb-1.5" onClick={() => set("grupFasilitas", data.grupFasilitas.filter((_, i) => i !== index))} aria-label={`Hapus grup ${index + 1}`}>
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <GaleriUnggah
                label="Foto"
                files={grup.foto}
                onChange={(files) => set("grupFasilitas", data.grupFasilitas.map((item, i) => (i === index ? { ...item, foto: files } : item)))}
              />
            </div>
          ))}
          <AdminButton variant="ghost" icon={Plus} className="w-full border-dashed" onClick={() => set("grupFasilitas", [...data.grupFasilitas, { judul: "", foto: [] }])}>
            Tambah Grup Fasilitas
          </AdminButton>
        </>
      ),
    },
  ];

  if (form.loadError) return <LoadErrorNotice message={form.loadError} backHref="/admin/jurusan" />;

  return (
    <>
      <StepForm
        title={form.isEdit ? "Ubah Jurusan" : "Tambah Jurusan Baru"}
        savedLabel="Jurusan"
        subtitle="Lengkapi seluruh data untuk card & halaman detail jurusan"
        steps={steps}
        backHref="/admin/jurusan"
        draftLabel="Simpan sebagai draf"
        saveLabel="Simpan Jurusan"
        onSave={onSave}
        loading={form.loading}
      />

      <Modal
        open={Boolean(prospek)}
        onClose={() => setProspek(null)}
        title="Informasi Prospek Karier"
        maxWidth="max-w-[760px]"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setProspek(null)}>
              Batal
            </AdminButton>
            <AdminButton onClick={saveProspek}>Simpan Prospek</AdminButton>
          </>
        }
      >
        {prospek ? (
          <>
            <InputText
              caps
              label="Nama prospek karier"
              placeholder="Contoh: Staf Operasional Bank Syariah"
              value={prospek.value.title}
              onChange={(event) => setProspek({ ...prospek, value: { ...prospek.value, title: event.target.value } })}
            />
            <InputLongText
              caps
              label="Deskripsi singkat"
              placeholder="Jelaskan peran dan tanggung jawab utama..."
              rows={3}
              value={prospek.value.desc}
              onChange={(event) => setProspek({ ...prospek, value: { ...prospek.value, desc: event.target.value } })}
            />
            <IconPicker label="Pilih ikon representatif" value={prospek.value.icon} onChange={(icon) => setProspek({ ...prospek, value: { ...prospek.value, icon } })} />
          </>
        ) : null}
      </Modal>
    </>
  );
}
