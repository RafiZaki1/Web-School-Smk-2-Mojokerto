import Image from "next/image";

export interface Partner {
  name: string;
  logo?: string | null;
  // Kelas tinggi logo (Tailwind), mis. "h-12 sm:h-14"
  height?: string;
}

/**
 * Deretan logo mitra yang tampil utuh di tengah dan turun baris bila sempit.
 * Tidak digulir, jadi tidak ada logo yang terpotong di tepi layar.
 * Mitra tanpa logo ditampilkan sebagai nama.
 */
export default function LogoGrid({ partners = [] }: { partners?: Partner[] }) {
  if (!partners.length) return null;

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 py-2 sm:gap-x-16">
      {partners.map((partner) => (
        <li key={partner.name} className="flex items-center">
          {partner.logo ? (
            // unoptimized: logo raster dikirim utuh agar teksnya tetap tajam, tidak diperkecil + dikompres seperti foto
            <Image src={partner.logo} alt={partner.name} width={240} height={80} unoptimized className={`${partner.height ?? "h-12"} w-auto object-contain`} />
          ) : (
            <span className="rounded-xl border border-[var(--color-navy)]/15 bg-card px-4 py-2 text-center text-sm font-semibold text-navy-ink">
              {partner.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
