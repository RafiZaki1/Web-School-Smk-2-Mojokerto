import { beritaMessages } from "./berita";
import { bkkMessages } from "./bkk";
import { chatbotMessages } from "./chatbot";
import { commonMessages } from "./common";
import { denahMessages } from "./denah";
import { ekstrakurikulerMessages } from "./ekstrakurikuler";
import { homeMessages } from "./home";
import { jurusanMessages } from "./jurusan";
import { karyaMessages } from "./karya";
import { kuisMessages } from "./kuis";
import { lulusanMessages } from "./lulusan";
import { portalMessages } from "./portal";
import { prestasiMessages } from "./prestasi";
import { ppdbMessages, spmbMessages } from "./spmb";

/**
 * Kamus Bahasa Inggris. Kunci = teks sumber Bahasa Indonesia (dicocokkan persis oleh createTranslator),
 * nilai = terjemahannya. Kamus dipecah per area agar mudah dirawat; teks yang belum ada tetap tampil
 * dalam Bahasa Indonesia.
 */
export const enMessages: Record<string, string> = {
  ...commonMessages,
  ...homeMessages,
  ...beritaMessages,
  ...jurusanMessages,
  ...ekstrakurikulerMessages,
  ...prestasiMessages,
  ...karyaMessages,
  ...lulusanMessages,
  ...bkkMessages,
  ...spmbMessages,
  ...ppdbMessages,
  ...portalMessages,
  ...kuisMessages,
  ...denahMessages,
  ...chatbotMessages,
};
