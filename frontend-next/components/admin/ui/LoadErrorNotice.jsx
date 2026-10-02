import { AlertCircle } from "lucide-react";
import AdminButton from "./AdminButton";

/** Pesan saat data yang akan diubah gagal dimuat (mis. sudah dihapus). */
export default function LoadErrorNotice({ message, backHref }) {
  return (
    <section className="app-card flex flex-col items-center gap-4 px-6 py-14 text-center">
      <AlertCircle size={32} className="text-[#dc2626]" aria-hidden="true" />
      <p className="text-[16px] font-medium text-[#0f172a]">{message}</p>
      <AdminButton href={backHref} variant="ghost">
        Kembali ke daftar
      </AdminButton>
    </section>
  );
}
