"use client";

import { useMutation } from "@tanstack/react-query";
import { submitQuiz } from "../services/kuis.service";
import { saveRiwayat } from "../utils/riwayat-kuis";

// Kirim jawaban kuis dari chat. Hasil disimpan ke riwayat perangkat; error ditampilkan di chat.
export function useSubmitKuis() {
  return useMutation({
    mutationFn: submitQuiz,
    meta: { skipGlobalError: true },
    onSuccess: saveRiwayat,
  });
}
