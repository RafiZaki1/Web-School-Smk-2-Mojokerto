import { Camera, Code, Landmark, Leaf, Utensils } from "lucide-react";
import PublicPage from "@/components/layout/PublicPage";
import { getFasilitasGroups } from "@/lib/api/contentApi";

export const metadata = {
  title: "Fasilitas per Jurusan - SMKN 2 Kota Mojokerto",
  description: "Lab dan workshop yang mendukung praktik langsung tiap program keahlian.",
};

const ICONS = { code: Code, camera: Camera, bank: Landmark, leaf: Leaf, utensils: Utensils };

export default async function FasilitasPage() {
  const groups = await getFasilitasGroups();

  return (
    <PublicPage className="bg-page" contentClassName="font-ui">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-[40px] lg:mt-6 lg:text-5xl">Fasilitas per jurusan</h1>
        <p className="mt-3 text-base text-[#4b5563] sm:text-lg lg:text-xl">Lab dan workshop yang mendukung praktik langsung tiap program keahlian.</p>
      </div>

      <div className="mx-auto mt-12 max-w-[1242px] space-y-14 lg:mt-[86px] lg:space-y-[72px]">
        {groups.map((group) => {
          const Icon = ICONS[group.icon] ?? Code;
          const wide = group.items.length === 2;
          return (
            <section key={group.id} aria-labelledby={`fasilitas-${group.id}`}>
              <h2 id={`fasilitas-${group.id}`} className="flex items-center gap-3 text-lg font-semibold text-[#0f172a] sm:text-xl lg:text-2xl">
                <span className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg text-white ${group.tone}`}>
                  <Icon size={15} aria-hidden="true" />
                </span>
                {group.title}
              </h2>
              <ul className={`mt-4 grid gap-5 sm:grid-cols-2 lg:gap-[27px] ${wide ? "" : "lg:grid-cols-3"}`}>
                {group.items.map((item, index) => (
                  <li key={`${item.image}-${index}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className={`w-full rounded-xl object-cover ${wide ? "aspect-[608/216]" : "aspect-[396/216]"}`}
                    />
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
