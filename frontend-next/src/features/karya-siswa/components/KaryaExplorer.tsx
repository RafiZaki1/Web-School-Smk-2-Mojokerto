"use client";

import { useState } from "react";
import TabButtons from "@/shared/components/ui/TabButtons";
import { KARYA_JURUSAN, KARYA_SISWA, type KaryaJurusan } from "../constants/karya-data";
import { KaryaCard } from "./KaryaCard";

const SEMUA = "semua";

const TABS = [
  { id: SEMUA, label: "Semua Jurusan" },
  ...(Object.keys(KARYA_JURUSAN) as KaryaJurusan[])
    .filter((id) => KARYA_SISWA.some((karya) => karya.jurusan === id))
    .map((id) => ({ id, label: KARYA_JURUSAN[id] })),
];

/** Daftar semua karya dengan filter jurusan. */
export function KaryaExplorer() {
  const [jurusan, setJurusan] = useState(SEMUA);
  const items = jurusan === SEMUA ? KARYA_SISWA : KARYA_SISWA.filter((karya) => karya.jurusan === jurusan);

  return (
    <>
      <TabButtons
        tabs={TABS}
        activeId={jurusan}
        onChange={setJurusan}
        variant="outline"
        ariaLabel="Filter karya per jurusan"
        className="mt-8 flex-wrap lg:mt-10"
      />

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-8">
        {items.map((karya) => (
          <li key={karya.slug}>
            <KaryaCard karya={karya} />
          </li>
        ))}
      </ul>
    </>
  );
}

/** Karya lain selain yang sedang dibuka, untuk bagian bawah halaman detail. */
export function KaryaLainnya({ exclude }: { exclude: string }) {
  return (
    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {KARYA_SISWA.filter((karya) => karya.slug !== exclude)
        .slice(0, 3)
        .map((karya) => (
          <li key={karya.slug}>
            <KaryaCard karya={karya} />
          </li>
        ))}
    </ul>
  );
}
