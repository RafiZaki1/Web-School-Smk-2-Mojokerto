"use client";

import { useSearchParams } from "next/navigation";
import { BeritaExplorer } from "./BeritaExplorer";
import type { Berita } from "../types/berita.type";

interface BeritaExplorerFromUrlProps {
  items: Berita[];
  categories: string[];
}

// Membaca filter dari URL (?cari=&kategori=) di sisi klien, sehingga halaman berita bisa dirender statis.
export default function BeritaExplorerFromUrl({ items, categories }: Readonly<BeritaExplorerFromUrlProps>) {
  const params = useSearchParams();
  const cari = params.get("cari") ?? "";
  const kategori = params.get("kategori") ?? "";

  return <BeritaExplorer key={`${cari}-${kategori}`} items={items} categories={categories} initialQuery={cari} initialCategory={kategori} />;
}
