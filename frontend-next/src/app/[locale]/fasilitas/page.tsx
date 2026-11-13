import type { Metadata } from "next";
import Image from "next/image";
import { Camera, Code, Landmark, Leaf, Utensils, type LucideIcon } from "lucide-react";
import PublicPage from "@/shared/components/layout/PublicPage";
import { getFasilitasGroups } from "@/features/fasilitas";
import { getTranslator } from "@/shared/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = `${t("Fasilitas per Jurusan")} - SMKN 2 Kota Mojokerto`;
  const description = t("Lab dan workshop yang mendukung praktik langsung tiap program keahlian.");
  return { title, description, openGraph: { title, description, type: "website" } };
}

const ICONS: Record<string, LucideIcon> = { code: Code, camera: Camera, bank: Landmark, leaf: Leaf, utensils: Utensils };

export default async function FasilitasPage() {
  const [groups, t] = await Promise.all([getFasilitasGroups(), getTranslator()]);

  return (
    <PublicPage className="bg-page" contentClassName="font-ui" ornaments="fasilitas">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-heading)] sm:text-[40px] lg:mt-6 lg:text-5xl">{t("Fasilitas per jurusan")}</h1>
        <p className="mt-3 text-base text-[var(--color-body)] sm:text-lg lg:text-xl">{t("Lab dan workshop yang mendukung praktik langsung tiap program keahlian.")}</p>
      </div>

      <div className="mx-auto mt-12 max-w-[1242px] space-y-14 lg:mt-[86px] lg:space-y-[72px]">
        {groups.map((group) => {
          const Icon = ICONS[group.icon] ?? Code;
          const wide = group.items.length === 2;
          return (
            <section key={group.id} aria-labelledby={`fasilitas-${group.id}`}>
              <h2 id={`fasilitas-${group.id}`} className="flex items-center gap-3 text-lg font-semibold text-[var(--color-heading)] sm:text-xl lg:text-2xl">
                <span className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg text-white ${group.tone}`}>
                  <Icon size={15} aria-hidden="true" />
                </span>
                {t(group.title)}
              </h2>
              <ul className={`mt-4 grid gap-5 sm:grid-cols-2 lg:gap-[27px] ${wide ? "" : "lg:grid-cols-3"}`}>
                {group.items.map((item, index) => (
                  <li key={`${item.image}-${index}`}>
                    <span className={`relative block w-full overflow-hidden rounded-xl ${wide ? "aspect-[608/216]" : "aspect-[396/216]"}`}>
                      <Image src={item.image} alt={t(item.title)} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </PublicPage>
  );
}
