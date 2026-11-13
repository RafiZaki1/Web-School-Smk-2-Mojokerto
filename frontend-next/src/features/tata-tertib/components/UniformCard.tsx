import Image from "next/image";
import { getAssetUrl } from "@/shared/lib/http/client";

interface UniformCardProps {
  label: string;
  name: string;
  description: string | null;
  image: string | null;
}

/** Kartu seragam: foto, hari/jurusan, nama seragam, dan keterangan. */
export function UniformCard({ label, name, description, image }: UniformCardProps) {
  const src = getAssetUrl(image);
  return (
    <li className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="relative aspect-[3/4] bg-[var(--color-surface-alt)]">
        {src ? (
          <Image src={src} alt={`${label}: ${name}`} fill sizes="(min-width: 1024px) 19vw, (min-width: 640px) 30vw, 46vw" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center px-3 text-center text-[13px] text-muted">Foto belum tersedia</span>
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-[13px] font-semibold text-accent">{label}</p>
        <h3 className="mt-0.5 text-[15px] leading-snug font-semibold text-heading">{name}</h3>
        {description ? <p className="mt-1 text-[13px] leading-relaxed text-body">{description}</p> : null}
      </div>
    </li>
  );
}
