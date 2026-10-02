import { BookOpen, BriefcaseBusiness, CalendarDays, Medal, Presentation, UsersRound } from "lucide-react";
import StatCounter from "./StatCounter";

const QUOTE =
  "Pendidikan vokasi adalah kunci kemandirian bangsa. Kami mendidik dengan hati, mengasah kompetensi, dan mencetak generasi yang tangguh menghadapi tantangan global.";

export default function SambutanSection({ statistics = {} }) {
  const stats = [
    {
      label: "Siswa Aktif",
      target: statistics?.total_students || 1850,
      suffix: "+",
      icon: <UsersRound size={20} />,
      tone: "bg-[#1d5c7d] text-white",
    },
    {
      label: "Tenaga Pendidik",
      target: statistics?.total_teachers || 120,
      suffix: "+",
      icon: <Presentation size={20} />,
      tone: "bg-lime-soft text-green",
    },
    {
      label: "Tahun Berdiri",
      target: statistics?.established_year || 2014,
      formatThousands: false,
      icon: <CalendarDays size={20} />,
      tone: "bg-[#cbe6ff] text-primary",
    },
    {
      label: "Program Keahlian",
      target: statistics?.total_majors || 5,
      icon: <BookOpen size={20} />,
      tone: "bg-[#ffddb8] text-[#8a4b08]",
    },
    {
      label: "Alumni Kerja",
      target: statistics?.total_alumni || 1000,
      suffix: "+",
      icon: <BriefcaseBusiness size={20} />,
      tone: "bg-lime-soft text-green",
    },
  ];

  return (
    <section id="profil" className="pt-14 sm:pt-20 lg:pt-28">
      <div className="page-container">
        <div className="relative overflow-hidden rounded-3xl bg-navy lg:rounded-[36px]">
          <img
            src="/images/sambutan-bg.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02263f]/70 via-[#02263f]/30 to-transparent lg:hidden" />

          <div className="relative z-10 grid min-h-[520px] grid-cols-1 lg:min-h-[758px] lg:grid-cols-[1fr_minmax(0,548px)]">
            <div className="flex flex-col p-5 sm:p-8 lg:p-[26px]">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-4 py-2 text-[13px] font-bold uppercase tracking-wide text-gold-ink shadow-[0_6px_14px_rgba(0,0,0,0.1)]">
                <Medal size={15} strokeWidth={2.5} aria-hidden="true" />
                Terakreditasi &quot;A&quot;
              </span>

              <figure className="relative z-10 my-8 max-w-[631px] rounded-3xl border border-white/30 lg:w-[631px] lg:max-w-none bg-white/15 p-6 backdrop-blur-md sm:my-auto sm:p-9 lg:mt-[157px] lg:mb-auto lg:ml-[168px]">
                <blockquote className="font-heading text-lg leading-snug font-bold text-white sm:text-2xl lg:text-[30px] lg:leading-[1.23]">
                  &ldquo;{QUOTE}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-[#ffe58a]">
                  <p className="font-heading text-base font-medium sm:text-2xl">Bapak Iswahyudi, S.ST.</p>
                  <p className="mt-0.5 font-heading text-[13px] sm:text-[17px]">Kepala SMKN 2 Mojokerto</p>
                </figcaption>
              </figure>
            </div>

            <img
              src="/images/kepala-sekolah.png"
              alt="Bapak Iswahyudi, S.ST., Kepala SMKN 2 Mojokerto"
              className="pointer-events-none absolute right-0 bottom-0 w-[200px] opacity-60 sm:w-[340px] sm:opacity-100 lg:static lg:mt-auto lg:w-full lg:self-end"
            />
          </div>

          <div className="relative z-20 bg-[#02426a]/85 px-5 py-4 backdrop-blur-sm sm:px-8 lg:-mt-[102px] lg:px-12 lg:py-5">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0">
              {stats.map((stat, index) => (
                <li
                  key={stat.label}
                  className={`lg:flex lg:justify-center ${index > 0 ? "lg:border-l lg:border-white/50" : ""}`}
                >
                  <StatCounter {...stat} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
