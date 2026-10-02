export default function JurusanHero({ jurusan }) {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:gap-10">
      <div>
        <h1 className="font-heading text-[32px] leading-[1.15] font-bold text-primary sm:text-[44px] lg:text-[56px]">
          {jurusan.fullName}
        </h1>
        <p className="mt-5 font-ui text-xl font-bold text-green sm:text-2xl lg:mt-12 lg:text-[26px]">{jurusan.code}</p>
        <p className="mt-4 max-w-[620px] text-base leading-relaxed text-body sm:text-lg lg:mt-10 lg:text-xl lg:leading-8">
          {jurusan.desc}
        </p>
      </div>

      <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-surface shadow-[0_8px_20px_rgba(15,42,70,0.1)] lg:rounded-[36px]">
        <img src={jurusan.image} alt={`Siswa jurusan ${jurusan.fullName}`} className="h-full w-full object-cover object-top" />
      </div>
    </section>
  );
}
