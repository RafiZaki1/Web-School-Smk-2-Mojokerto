"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { CONTACT } from "@/shared/constants/navigation";
import { contactLinks, type ContactInfo } from "@/shared/utils/contact-links";

interface ContactPanelProps {
  title?: string;
  description?: string;
  contact?: ContactInfo;
  className?: string;
}

/** Kotak kontak "Ada pertanyaan?" (SPMB, detail lowongan). */
export default function ContactPanel({
  title = "Ada pertanyaan?",
  description = "Hubungi panitia SPMB SMKN 2 Kota Mojokerto untuk bantuan lebih lanjut.",
  contact = CONTACT,
  className = "",
}: ContactPanelProps) {
  const { t } = useTranslation();
  const items = contactLinks(contact);

  return (
    <section className={`rounded-3xl bg-[var(--color-tint)] p-6 sm:p-10 lg:px-[54px] lg:py-[48px] ${className}`}>
      <h2 className="text-xl font-bold text-[var(--color-body)] sm:text-2xl lg:text-[28px]">{t(title)}</h2>
      <p className="mt-2 text-base text-[var(--color-muted)] sm:text-lg lg:text-xl">{t(description)}</p>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-8 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-bold text-[var(--color-muted)]">{t(item.label)}</dt>
            <dd className="mt-1">
              <a href={item.href} className="text-lg font-bold break-words text-[var(--color-body)] hover:text-blue sm:text-xl lg:text-2xl">
                {item.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
