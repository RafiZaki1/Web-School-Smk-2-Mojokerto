import TindakAspirasi from "@/components/admin/forms/TindakAspirasi";

export const metadata = { title: "Tindak Aspirasi" };

export default async function Page({ params }) {
  const { id } = await params;
  return <TindakAspirasi id={id} />;
}
