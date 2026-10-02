import SadaRoom from "@/components/chatbot/SadaRoom";

export const metadata = {
  title: "SADA Roomchat - SMKN 2 Kota Mojokerto",
  description: "SADA siap membantu menjawab pertanyaan seputar SMKN 2 Mojokerto.",
};

export default function SadaPage() {
  return (
    <main className="flex-1 bg-[#eef3fa]">
      <SadaRoom />
    </main>
  );
}
