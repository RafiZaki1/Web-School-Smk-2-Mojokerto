import type { Metadata } from "next";
import { SadaRoom } from "@/features/chatbot";
import { getTranslator } from "@/shared/lib/i18n/server";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = "SADA Roomchat - SMKN 2 Kota Mojokerto";
  const description = t("SADA siap membantu menjawab pertanyaan seputar SMKN 2 Mojokerto.");
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default function SadaPage() {
  return (
    <main className="relative isolate flex-1 bg-[var(--color-tint)]">
      <SadaRoom />
      <PageOrnaments theme="sada" />
    </main>
  );
}
