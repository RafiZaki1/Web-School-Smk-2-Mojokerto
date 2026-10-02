import BeritaForm from "@/components/admin/forms/BeritaForm";

export const metadata = { title: "Ubah Berita" };

export default async function Page({ params }) {
  const { id } = await params;
  return <BeritaForm id={id} />;
}
