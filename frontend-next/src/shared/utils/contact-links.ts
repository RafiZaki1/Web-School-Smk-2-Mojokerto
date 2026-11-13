import { CONTACT } from "@/shared/constants/navigation";

export interface ContactInfo {
  telepon: string;
  whatsapp: string;
  email: string;
}

export interface ContactLink {
  key: "telepon" | "whatsapp" | "email";
  label: string;
  value: string;
  href: string;
}

/** Tautan kontak sekolah siap klik: telepon (tel:), WhatsApp (wa.me, kode 62), dan email (mailto:). */
export function contactLinks(contact: ContactInfo = CONTACT): ContactLink[] {
  return [
    { key: "telepon", label: "Telepon", value: contact.telepon, href: `tel:${contact.telepon.replace(/[^0-9+]/g, "")}` },
    { key: "whatsapp", label: "WhatsApp", value: contact.whatsapp, href: `https://wa.me/62${contact.whatsapp.replace(/\D/g, "").replace(/^0/, "")}` },
    { key: "email", label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  ];
}
