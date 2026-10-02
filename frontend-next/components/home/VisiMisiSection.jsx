import { Eye, Flag, Rocket } from "lucide-react";

const ITEMS = [
  {
    title: "Visi",
    icon: Eye,
    tone: "bg-[#e0f2fe] text-[#0284c7]",
    text: "Menjadi lembaga pendidikan dan pelatihan vokasi yang unggul, berkarakter, berwawasan lingkungan, dan berstandar internasional.",
  },
  {
    title: "Misi",
    icon: Rocket,
    tone: "bg-[#eef3e6] text-green",
    text: "Menyelenggarakan pembelajaran berbasis proyek industri, membekali peserta didik dengan kompetensi abad 21, dan membangun kemitraan strategis.",
  },
  {
    title: "Tujuan",
    icon: Flag,
    tone: "bg-[#fdf3e1] text-[#d97706]",
    text: "Menghasilkan lulusan yang kompeten, kompetitif, adaptif, dan siap kerja atau berwirausaha sesuai kebutuhan Dunia Usaha dan Dunia Industri (DUDI).",
  },
];

export default function VisiMisiSection() {
  return (
    <section id="visi-misi" aria-label="Visi, misi, dan tujuan" className="section">
      <div className="page-container grid gap-5 lg:grid-cols-3 lg:gap-9">
        {ITEMS.map(({ title, icon: Icon, tone, text }) => (
          <article
            key={title}
            className="rounded-3xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(15,42,70,0.06)] sm:p-8 lg:rounded-[36px] lg:p-[37px]"
          >
            <span className={`flex h-[54px] w-[54px] items-center justify-center rounded-full ${tone}`}>
              <Icon size={22} strokeWidth={2.25} aria-hidden="true" />
            </span>
            <h3 className="mt-6 font-sans text-2xl font-semibold text-ink lg:mt-[18px] lg:text-[28px] lg:leading-[47px]">
              {title}
            </h3>
            <p className="mt-3 text-base leading-7 text-[#4b5563] lg:mt-4 lg:text-[17px]">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
