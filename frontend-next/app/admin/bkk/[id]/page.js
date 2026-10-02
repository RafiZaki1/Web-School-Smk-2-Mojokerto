import LokerForm from "@/components/admin/forms/LokerForm";

export const metadata = { title: "Ubah Lowongan" };

export default async function Page({ params }) {
  const { id } = await params;
  return <LokerForm id={id} />;
}
