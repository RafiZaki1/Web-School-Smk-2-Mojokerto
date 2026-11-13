import Image from "next/image";
import { getAssetUrl } from "@/shared/lib/http/client";
import { formatActivityDate } from "../utils/format-date";
import type { InternshipDocumentation } from "../types/kemitraan.type";

/** Grid foto dokumentasi PKL: foto, judul, dan jurusan/mitra/waktu. */
export function PklGallery({ items }: { items: InternshipDocumentation[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const image = getAssetUrl(item.image);
        const meta = [item.major_label, item.industry_partner, formatActivityDate(item.activity_date)].filter(Boolean).join(" · ");
        return (
          <li key={item.id} className="overflow-hidden rounded-2xl border border-line bg-card">
            <div className="relative aspect-[4/3] bg-[var(--color-surface-alt)]">
              {image ? <Image src={image} alt={item.title} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="object-cover" /> : null}
            </div>
            <div className="px-4 py-4">
              <h3 className="text-[16px] leading-snug font-semibold text-heading">{item.title}</h3>
              {meta ? <p className="mt-1 text-[13px] text-muted">{meta}</p> : null}
              {item.description ? <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-body">{item.description}</p> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
