import JurusanForm from "@/components/admin/forms/JurusanForm";

export const metadata = { title: "Ubah Jurusan" };

export default async function Page({ params }) {
  const { id } = await params;
  return <JurusanForm id={id} />;
}
