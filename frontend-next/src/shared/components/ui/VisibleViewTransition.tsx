"use client";

import { useLayoutEffect, useState, ViewTransition, type ComponentProps } from "react";

/**
 * <ViewTransition> yang hanya memakai `name` selama halamannya tampil.
 * Cache Components menyembunyikan halaman lama dengan <Activity> alih-alih membongkarnya,
 * sehingga beranda yang tersembunyi dan halaman detail bisa memasang nama yang sama
 * bersamaan. Efek dibersihkan saat disembunyikan, jadi nama ikut dilepas.
 */
export default function VisibleViewTransition({ name, ...props }: ComponentProps<typeof ViewTransition>) {
  // Mulai true agar morph saat halaman pertama kali dipasang tetap jalan
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    setVisible(true);
    return () => setVisible(false);
  }, []);

  return <ViewTransition name={visible ? name : undefined} {...props} />;
}
