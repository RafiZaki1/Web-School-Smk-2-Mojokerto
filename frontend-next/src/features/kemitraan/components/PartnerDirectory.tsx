"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { EmptyState } from "@/shared/components/feedback/StatusState";
import { MAJORS } from "@/shared/constants/school-classes";
import { getAssetUrl } from "@/shared/lib/http/client";
import type { IndustryPartner } from "../types/kemitraan.type";

const FILTERS = [{ code: "", label: "Semua jurusan" }, ...MAJORS.map((major) => ({ code: major.code, label: major.label }))];

/** Daftar mitra DU/DI dengan filter 5 jurusan. Mitra tanpa jurusan dianggap mitra semua jurusan. */
export function PartnerDirectory({ partners }: { partners: IndustryPartner[] }) {
  const [major, setMajor] = useState("");
  const rows = major ? partners.filter((partner) => partner.major_codes.length === 0 || partner.major_codes.includes(major)) : partners;

  return (
    <div>
      <div role="group" aria-label="Filter jurusan" className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button key={item.code || "all"} type="button" className="svc-chip" aria-pressed={major === item.code} onClick={() => setMajor(item.code)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {rows.length === 0 ? (
          <EmptyState title="Belum ada mitra untuk jurusan ini" />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PartnerCard({ partner }: { partner: IndustryPartner }) {
  const logo = getAssetUrl(partner.logo);
  return (
    <li className="flex gap-4 rounded-2xl border border-line bg-card p-4">
      <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-line bg-white p-2">
        {logo ? (
          // unoptimized: logo dikirim utuh agar teks di dalamnya tetap tajam
          <Image src={logo} alt="" width={80} height={64} unoptimized className="max-h-12 w-auto object-contain" />
        ) : (
          <span className="text-center text-[12px] font-semibold text-muted">{partner.name.slice(0, 2).toUpperCase()}</span>
        )}
      </span>
      <div className="min-w-0">
        <h3 className="text-[16px] leading-snug font-semibold text-heading">{partner.name}</h3>
        {partner.city ? <p className="text-[13px] text-muted">{partner.city}</p> : null}
        <p className="mt-1.5 text-[13px] text-body">{partner.major_labels.length ? partner.major_labels.join(", ") : "Semua jurusan"}</p>
        {partner.website ? (
          <a href={partner.website} target="_blank" rel="noreferrer" className="svc-link mt-1.5 inline-flex items-center gap-1 text-[13px]">
            Situs web <ExternalLink size={13} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </li>
  );
}
