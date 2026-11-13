// 5 jurusan dan 12 kelas XII, sama persis dengan MajorCodeEnum dan SchoolClassEnum di backend.
export const MAJORS = [
  { code: "RPL", label: "Rekayasa Perangkat Lunak" },
  { code: "LPS", label: "Layanan Perbankan Syariah" },
  { code: "DKV", label: "Desain Komunikasi Visual" },
  { code: "APHP", label: "Agribisnis Pengolahan Hasil Pertanian" },
  { code: "KULINER", label: "Kuliner" },
] as const;

export type MajorCode = (typeof MAJORS)[number]["code"];

export const SCHOOL_CLASSES = [
  "XII RPL 1",
  "XII RPL 2",
  "XII RPL 3",
  "XII LPS 1",
  "XII LPS 2",
  "XII DKV 1",
  "XII DKV 2",
  "XII APHP 1",
  "XII APHP 2",
  "XII Kuliner 1",
  "XII Kuliner 2",
  "XII Kuliner 3",
] as const;

export type SchoolClass = (typeof SCHOOL_CLASSES)[number];

export const majorLabel = (code: string | null | undefined): string => MAJORS.find((major) => major.code === code)?.label ?? code ?? "";

/** Kelas XII milik satu jurusan, mis. "KULINER" -> XII Kuliner 1..3. */
export const classesOfMajor = (code: MajorCode): SchoolClass[] =>
  SCHOOL_CLASSES.filter((name) => name.split(" ")[1].toUpperCase() === code);
