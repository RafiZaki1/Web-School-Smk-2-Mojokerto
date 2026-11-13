"use client";

import { useState } from "react";
import Image from "next/image";
import { getJurusanIcons } from "@/shared/components/ui/PageOrnaments";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { KaryaJurusan } from "../constants/karya-data";

interface KaryaImageProps {
  src: string;
  alt: string;
  jurusan: KaryaJurusan;
  sizes: string;
  className?: string;
}

/** Foto karya (mode fill). Jika file belum ada, tampil latar jurusan sebagai pengganti. */
export function KaryaImage({ src, alt, jurusan, sizes, className = "" }: KaryaImageProps) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);

  if (failed) {
    const [Main, Second] = getJurusanIcons(jurusan);
    return (
      <div
        role="img"
        aria-label={t(alt)}
        className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,var(--color-navy-deep)_0%,var(--color-primary)_100%)]"
      >
        <Main className="absolute top-1/2 left-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 text-white/25" />
        <Second className="absolute -right-4 -bottom-4 w-[26%] -rotate-12 text-white/10" />
      </div>
    );
  }

  return <Image src={src} alt={t(alt)} fill sizes={sizes} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
