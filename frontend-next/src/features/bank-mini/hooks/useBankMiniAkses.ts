"use client";

import { useMutation } from "@tanstack/react-query";
import { createBankMiniAksesApi } from "../api/bankMiniAdmin.api";
import type { BankMiniTujuan } from "../types/bank-mini.type";

/** Buka halaman panel Bank Mini di tab ini; sesi panel dibuat oleh tautan dari backend. */
export const useBankMiniAkses = () =>
  useMutation({
    mutationFn: (tujuan: BankMiniTujuan) => createBankMiniAksesApi(tujuan),
    onSuccess: ({ url }) => window.location.assign(url),
  });
