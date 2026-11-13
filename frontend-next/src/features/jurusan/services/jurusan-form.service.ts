import type { MajorPayload, MajorRecord, MajorFacilityRecord } from "../types/jurusan.type";
import type { JurusanFormValues } from "../validation/jurusan.schema";

export const JURUSAN_FORM_EMPTY: JurusanFormValues = {
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
export function toFasilitasGroups(facilities: MajorFacilityRecord[] = []): JurusanFormValues["grupFasilitas"] {
  const groups: JurusanFormValues["grupFasilitas"] = [];
  facilities.forEach((item) => {
    const last = groups.at(-1);
    if (last && last.judul === item.title) last.foto.push(item.image);
    else groups.push({ judul: item.title ?? "", foto: [item.image] });
  });
  return groups.length ? groups : [{ judul: "", foto: [] }];
}

export function toJurusanFormValues(major: MajorRecord): JurusanFormValues {
  const partners = major.partners ?? [];
  return {
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
    mitra: partners.map((item) => item.logo),
    mitraNama: Object.fromEntries(partners.filter((item) => item.logo).map((item) => [item.logo as string, item.name])),
    fasilitasLabel: major.facility_title ?? "Fasilitas Belajar",
    grupFasilitas: toFasilitasGroups(major.facilities),
  };
}

export function toJurusanPayload(values: JurusanFormValues, draft: boolean): MajorPayload {
  return {
    code: values.code.trim(),
    name: values.name.trim(),
    tagline: values.tagline,
    accreditation: values.akreditasi,
    summary: values.shortDesc,
    description: values.longDesc,
    image: values.foto,
    accent_color: values.accent,
    competencies: values.kompetensi,
    careers: values.karir.map((item) => ({ icon: item.icon, title: item.title, description: item.desc })),
    partners: values.mitra.map((logo) => ({ logo, name: typeof logo === "string" ? values.mitraNama[logo] : undefined })),
    facility_title: values.fasilitasLabel,
    facilities: values.grupFasilitas.flatMap((grup) => grup.foto.map((image) => ({ title: grup.judul, image }))),
    is_published: !draft && values.status !== "Draf",
  };
}
