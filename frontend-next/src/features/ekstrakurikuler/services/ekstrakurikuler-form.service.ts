import type { ExtracurricularPayload, ExtracurricularRecord } from "../types/ekstrakurikuler.type";
import type { EkstrakurikulerFormValues } from "../validation/ekstrakurikuler.schema";

export const EKSTRAKURIKULER_FORM_EMPTY: EkstrakurikulerFormValues = {
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

export function toEkstrakurikulerFormValues(item: ExtracurricularRecord): EkstrakurikulerFormValues {
  return {
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
    testimoni: item.testimonials?.length
      ? item.testimonials.map((testi) => ({ kutipan: testi.quote, nama: testi.author ?? "" }))
      : [{ kutipan: "", nama: "" }],
  };
}

export function toEkstrakurikulerPayload(values: EkstrakurikulerFormValues, draft: boolean): ExtracurricularPayload {
  return {
    icon: values.ikon,
    name: values.nama.trim(),
    tagline: values.fokus,
    summary: values.deskripsi,
    cover_image: values.sampul,
    schedule: values.jadwal,
    location: values.lokasi,
    members: values.anggota,
    about_title: values.tentangJudul,
    about: values.tentang,
    gallery_title: values.galeriJudul,
    gallery: values.galeri,
    achievements: values.pencapaian
      .map((text, index) => ({ text: text.trim(), icon: values.pencapaianIkon[index] ?? "trophy" }))
      .filter((item) => item.text),
    testimonials: values.testimoni.filter((item) => item.kutipan.trim()).map((item) => ({ quote: item.kutipan, author: item.nama })),
    is_published: !draft,
  };
}
