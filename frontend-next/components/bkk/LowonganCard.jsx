import Link from "next/link";

export function LowonganBanner({ banner, className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 text-center text-white uppercase ${className}`}
      style={{ backgroundColor: banner.bg }}
    >
      <p className="max-w-[240px] text-lg leading-tight font-semibold tracking-[0.08em]">{banner.headline}</p>
      <p className="mt-2 text-[11px] font-medium tracking-[0.14em] text-white/85">{banner.sub}</p>
    </div>
  );
}

export default function LowonganCard({ job }) {
  return (
    <Link
      href={`/bkk/lowongan/${job.slug}`}
      className="block overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]"
    >
      <div className="relative">
        <LowonganBanner banner={job.banner} className="h-[160px] lg:h-[180px]" />
        <span className={`absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-semibold ${job.status === "Tutup" ? "text-[#64748b]" : "text-[#15803d]"}`}>{job.status}</span>
      </div>
      <div className="p-5 lg:px-6 lg:py-5">
        <h2 className="text-lg font-medium text-ink">{job.title}</h2>
        <p className="mt-1 text-[13px] text-[#4b5563]">
          {job.company} · {job.location}
        </p>
        <p className="mt-5 text-[13px] text-[#6b7280]">Tutup {job.tutup}</p>
      </div>
    </Link>
  );
}
