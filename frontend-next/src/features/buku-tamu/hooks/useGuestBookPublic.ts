"use client";

import { useMutation } from "@tanstack/react-query";
import { requestGuestVisitApi, sendGuestMessageApi } from "../api/guestBookPublic.api";

// Error 422 ditampilkan per kolom oleh form, jadi handler global dilewati.
export const useSendGuestMessage = () => useMutation({ mutationFn: sendGuestMessageApi, meta: { skipGlobalError: true } });

export const useRequestGuestVisit = () => useMutation({ mutationFn: requestGuestVisitApi, meta: { skipGlobalError: true } });
