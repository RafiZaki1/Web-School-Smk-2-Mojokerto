import PrestasiForm from "@/components/admin/forms/PrestasiForm";

export const metadata = { title: "Ubah Prestasi" };

export default async function Page({ params }) {
  const { id } = await params;
  return <PrestasiForm id={id} />;
}
