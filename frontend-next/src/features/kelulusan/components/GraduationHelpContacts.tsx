import { Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { contactLinks, type ContactLink } from "@/shared/utils/contact-links";

const ICONS: Record<ContactLink["key"], LucideIcon> = { whatsapp: MessageCircle, telepon: Phone, email: Mail };

/** "Perlu bantuan? Hubungi sekolah": WhatsApp, telepon, dan email TU yang bisa langsung diklik. */
export function GraduationHelpContacts() {
  return (
    <div className="border-t border-line pt-6">
      <p className="text-[15px] font-semibold text-heading">Perlu bantuan? Hubungi sekolah</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-3">
        {contactLinks().map((link) => {
          const Icon = ICONS[link.key];
          const external = link.key === "whatsapp";
          return (
            <li key={link.key}>
              <a
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-line bg-card py-2.5 pr-5 pl-3 text-left transition-colors hover:bg-[var(--color-surface-alt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-accent">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[13px] text-muted">{link.label}</span>
                  <span className="block text-[16px] font-semibold text-heading">{link.value}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
