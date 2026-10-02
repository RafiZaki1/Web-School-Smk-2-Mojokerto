import EkstraForm from "@/components/admin/forms/EkstraForm";

export const metadata = { title: "Ubah Ekstrakurikuler" };

export default async function Page({ params }) {
  const { id } = await params;
  return <EkstraForm id={id} />;
}
