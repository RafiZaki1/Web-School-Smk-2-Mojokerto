import { redirect } from "next/navigation";
import { env } from "@/shared/config/env";

// Pintu masuk menu Kesiswaan > Pembayaran SPP. Portal SPP & Bank Mini dilayani backend
// Laravel (Blade + sesi login NISN), jadi halaman ini hanya meneruskan ke sana.
export default function PembayaranSppPage(): never {
  redirect(`${env.apiBaseUrl.replace(/\/+$/, "")}/bank-mini/login`);
}
