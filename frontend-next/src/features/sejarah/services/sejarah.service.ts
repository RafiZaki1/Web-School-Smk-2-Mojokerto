import { getSiteContentApi } from "@/shared/services/getSiteContent.api";
import { KEPALA_SEKOLAH, SEJARAH_INTRO, SEJARAH_TIMELINE } from "../constants/sejarah-data";

// Bentuk konten sejarah mengikuti data statis (constants/sejarah-data.ts).
export interface SejarahContent {
  intro: typeof SEJARAH_INTRO;
  timeline: typeof SEJARAH_TIMELINE;
  kepala_sekolah: typeof KEPALA_SEKOLAH;
}

export async function getSejarahContent(): Promise<SejarahContent> {
  const content = await getSiteContentApi<SejarahContent>("sejarah");
  return content?.value ?? { intro: SEJARAH_INTRO, timeline: SEJARAH_TIMELINE, kepala_sekolah: KEPALA_SEKOLAH };
}
