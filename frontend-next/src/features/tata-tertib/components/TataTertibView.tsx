import { EmptyState, ErrorState } from "@/shared/components/feedback/StatusState";
import { groupRules, uniformImage } from "../services/tata-tertib.service";
import type { StudentGuide } from "../types/tata-tertib.type";
import { UniformCard } from "./UniformCard";

/** Isi halaman /tata-tertib: poin tata tertib per bagian, jadwal seragam harian, dan seragam praktik jurusan. */
export function TataTertibView({ guide }: { guide: StudentGuide | null }) {
  return (
    <>
      <header className="max-w-[760px]">
        <h1 className="text-3xl font-bold text-heading sm:text-[34px]">Tata Tertib & Seragam</h1>
        <p className="mt-3 text-base leading-relaxed text-body">Aturan yang berlaku bagi seluruh siswa SMKN 2 Kota Mojokerto, beserta jadwal seragam harian dan seragam praktik tiap jurusan.</p>
        <nav aria-label="Bagian halaman" className="mt-5 flex flex-wrap gap-2">
          <a href="#tata-tertib" className="svc-chip">
            Tata tertib
          </a>
          <a href="#seragam-harian" className="svc-chip">
            Seragam harian
          </a>
          <a href="#seragam-praktik" className="svc-chip">
            Seragam praktik
          </a>
        </nav>
      </header>

      {guide === null ? (
        <div className="mt-8">
          <ErrorState title="Tata tertib belum bisa dimuat" description="Coba muat ulang halaman beberapa saat lagi." />
        </div>
      ) : (
        <GuideBody guide={guide} />
      )}
    </>
  );
}

function GuideBody({ guide }: { guide: StudentGuide }) {
  const sections = groupRules(guide.rules);

  return (
    <>
      <section id="tata-tertib" className="mt-12 scroll-mt-28" aria-labelledby="judul-tata-tertib">
        <h2 id="judul-tata-tertib" className="text-2xl font-bold text-heading sm:text-[28px]">
          Tata Tertib Siswa
        </h2>
        {sections.length === 0 ? (
          <div className="mt-5">
            <EmptyState title="Poin tata tertib belum diisi" />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {sections.map((group) => (
              <article key={group.section} className="rounded-2xl border border-line bg-card px-5 py-5 sm:px-6">
                <h3 className="text-[17px] font-semibold text-heading">{group.section}</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-body marker:font-semibold marker:text-muted">
                  {group.rules.map((rule) => (
                    <li key={rule.id}>{rule.content}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="seragam-harian" className="mt-16 scroll-mt-28" aria-labelledby="judul-seragam-harian">
        <h2 id="judul-seragam-harian" className="text-2xl font-bold text-heading sm:text-[28px]">
          Seragam Harian
        </h2>
        <p className="mt-1 text-[15px] text-muted">Senin sampai Jumat.</p>
        {guide.uniform_schedules.length === 0 ? (
          <div className="mt-5">
            <EmptyState title="Jadwal seragam belum diisi" />
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {guide.uniform_schedules.map((item) => (
              <UniformCard key={item.id} label={item.day_label} name={item.name} description={item.description} image={item.image} />
            ))}
          </ul>
        )}
      </section>

      <section id="seragam-praktik" className="mt-16 scroll-mt-28" aria-labelledby="judul-seragam-praktik">
        <h2 id="judul-seragam-praktik" className="text-2xl font-bold text-heading sm:text-[28px]">
          Seragam Praktik Produktif
        </h2>
        <p className="mt-1 text-[15px] text-muted">Dipakai saat praktik di bengkel, laboratorium, atau dapur jurusan.</p>
        {guide.practice_uniforms.length === 0 ? (
          <div className="mt-5">
            <EmptyState title="Seragam praktik belum diisi" />
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {guide.practice_uniforms.map((item) => (
              <UniformCard key={item.id} label={item.major_label} name={item.name} description={item.description} image={uniformImage(item)} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
