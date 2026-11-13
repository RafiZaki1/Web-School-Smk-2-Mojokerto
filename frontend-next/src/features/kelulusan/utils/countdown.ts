export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Pecah sisa detik menjadi hari, jam, menit, detik. Nilai negatif dianggap nol. */
export function splitSeconds(total: number): CountdownParts {
  const safe = Math.max(0, Math.floor(total));
  return {
    days: Math.floor(safe / 86_400),
    hours: Math.floor((safe % 86_400) / 3_600),
    minutes: Math.floor((safe % 3_600) / 60),
    seconds: safe % 60,
  };
}

const RELEASE_FORMAT = new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Jakarta" });

/** Waktu rilis untuk dibaca manusia, mis. "Senin, 28 Desember 2026 pukul 08.00". */
export function formatReleaseAt(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : `${RELEASE_FORMAT.format(date)} WIB`;
}

const BIRTH_FORMAT = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "UTC" });

/** "2008-05-10" -> "10 Mei 2008". */
export function formatBirthDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : BIRTH_FORMAT.format(date);
}
