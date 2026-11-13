import { getSiteContentApi } from "@/shared/services/getSiteContent.api";
import { PRODUK, PRODUK_KEUNGGULAN, PRODUK_WHATSAPP } from "../constants/produk-data";

// Bentuk konten produk mengikuti data statis (constants/produk-data.ts).
export interface ProdukContent {
  whatsapp: string;
  items: typeof PRODUK;
  keunggulan: typeof PRODUK_KEUNGGULAN;
}

export async function getProdukContent(): Promise<ProdukContent> {
  const content = await getSiteContentApi<ProdukContent>("produk");
  return content?.value ?? { whatsapp: PRODUK_WHATSAPP, items: PRODUK, keunggulan: PRODUK_KEUNGGULAN };
}
