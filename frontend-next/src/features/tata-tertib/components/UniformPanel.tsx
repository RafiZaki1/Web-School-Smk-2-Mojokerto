"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import { getAssetUrl } from "@/shared/lib/http/client";
import { usePracticeUniformsAdmin, useUniformSchedulesAdmin } from "../hooks/useTataTertibAdmin";
import { uniformImage } from "../services/tata-tertib.service";
import type { PracticeUniform, UniformSchedule } from "../types/tata-tertib.type";
import { UniformFormModal } from "./UniformFormModal";

type UniformItem = UniformSchedule | PracticeUniform;

const labelOf = (item: UniformItem) => ("day_label" in item ? item.day_label : item.major_label);

/**
 * Kartu seragam yang bisa diubah: 5 hari (Senin-Jumat) atau 5 jurusan.
 * Datanya tetap (dibuat seeder), jadi TU hanya mengubah isi, tidak menambah atau menghapus.
 */
export function UniformPanel({ kind }: { kind: "schedule" | "practice" }) {
  const schedules = useUniformSchedulesAdmin();
  const practices = usePracticeUniformsAdmin();
  const query = kind === "schedule" ? schedules : practices;
  const [editing, setEditing] = useState<UniformItem | null>(null);
  const title = kind === "schedule" ? "Seragam harian (Senin-Jumat)" : "Seragam praktik per jurusan";

  return (
    <section className="app-card p-5 sm:p-6" aria-label={title}>
      <h2 className="text-[18px] font-semibold text-[#0f172a]">{title}</h2>
      <div className="mt-4">
        {query.isPending ? <LoadingState label="Memuat seragam..." /> : null}
        {query.isError ? <ErrorState /> : null}
        {query.data ? (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {query.data.map((item: UniformItem) => {
              const src = getAssetUrl(uniformImage(item));
              return (
                <li key={item.id} className="overflow-hidden rounded-md border border-[#e5e7eb] bg-white">
                  <div className="relative aspect-[3/4] bg-[#f1f5f9]">
                    {src ? <Image src={src} alt="" fill sizes="(min-width: 1280px) 15vw, (min-width: 768px) 28vw, 45vw" className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-[12px] text-[#94a3b8]">Belum ada foto</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-[13px] font-semibold text-[#0c4a68]">{labelOf(item)}</p>
                    <p className="text-[14px] font-medium text-[#0f172a]">{item.name}</p>
                    <button type="button" className="adm-btn adm-btn--text mt-1 -ml-2" onClick={() => setEditing(item)}>
                      <Pencil aria-hidden="true" />
                      <span>Ubah</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {editing ? <UniformFormModal kind={kind} uniform={editing} label={labelOf(editing)} onClose={() => setEditing(null)} /> : null}
    </section>
  );
}
