"use client";

import { useState } from "react";
import { Map } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=SMK+Negeri+2+Kota+Mojokerto,+Jl.+Raya+Pulorejo,+Kota+Mojokerto&t=&z=16&ie=UTF8&iwloc=&output=embed";

/**
 * Peta lokasi di footer. Embed Google Maps memuat ±400 KB skrip, padahal footer ada di setiap
 * halaman, jadi iframe baru dipasang setelah pengunjung menekan tombol.
 */
export default function FooterMap() {
  const { t } = useTranslation();
  const [shown, setShown] = useState(false);

  if (shown) {
    return (
      <iframe
        title={t("Lokasi SMK Negeri 2 Kota Mojokerto")}
        src={MAP_EMBED_URL}
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-32 w-full border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShown(true)}
      className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 font-ui text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
    >
      <Map size={26} aria-hidden="true" />
      {t("Tampilkan peta lokasi")}
    </button>
  );
}
