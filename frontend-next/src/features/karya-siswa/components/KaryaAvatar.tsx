import Image from "next/image";
import type { KaryaSiswa } from "../constants/karya-data";

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const SIZES = {
  sm: { box: "h-10 w-10", text: "text-sm", px: 80 },
  lg: { box: "h-14 w-14", text: "text-lg", px: 112 },
} as const;

/** Foto pembuat karya dalam bingkai gradasi; inisial jika belum ada foto. */
export function KaryaAvatar({ pembuat, size = "sm" }: { pembuat: KaryaSiswa["pembuat"]; size?: keyof typeof SIZES }) {
  const s = SIZES[size];

  return (
    <span className={`relative flex shrink-0 rounded-full bg-gradient-to-tr from-primary via-brand to-sun p-[2.5px] ${s.box}`}>
      <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-navy ring-2 ring-card">
        {pembuat.foto ? (
          <Image src={pembuat.foto} alt="" width={s.px} height={s.px} className="h-full w-full object-cover object-top" />
        ) : (
          <span className={`font-heading font-bold tracking-wider text-white ${s.text}`}>{getInitials(pembuat.nama)}</span>
        )}
      </span>
    </span>
  );
}
