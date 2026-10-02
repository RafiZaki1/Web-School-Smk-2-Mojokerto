import { CONTACT } from "@/lib/data/navigation";

/** Kotak kontak "Ada pertanyaan?" (SPMB, Aspirasi, detail lowongan). */
export default function ContactPanel({
  title = "Ada pertanyaan?",
  description = "Hubungi panitia SPMB SMKN 2 Kota Mojokerto untuk bantuan lebih lanjut.",
  contact = CONTACT,
  className = "",
}) {
  const items = [
    { label: "Telepon", value: contact.telepon, href: `tel:${contact.telepon.replace(/[^0-9+]/g, "")}` },
    { label: "WhatsApp", value: contact.whatsapp, href: `https://wa.me/62${contact.whatsapp.replace(/\D/g, "").replace(/^0/, "")}` },
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <section className={`rounded-3xl bg-[#eef4ff] p-6 sm:p-10 lg:px-[54px] lg:py-[48px] ${className}`}>
      <h2 className="text-xl font-bold text-[#1f2937] sm:text-2xl lg:text-[28px]">{title}</h2>
      <p className="mt-2 text-base text-[#6b7280] sm:text-lg lg:text-xl">{description}</p>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-8 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-bold tracking-[0.08em] text-[#6b7280] uppercase">{item.label}</dt>
            <dd className="mt-1">
              <a href={item.href} className="text-lg font-bold break-words text-[#1f2937] hover:text-blue sm:text-xl lg:text-2xl">
                {item.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
