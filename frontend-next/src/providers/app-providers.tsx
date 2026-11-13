"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/shared/components/feedback/Toaster";
import { handleApiError } from "@/shared/utils/error-handler";

// Opsi `meta` pada mutasi: { skipGlobalError: true } bila form menangani error sendiri (mis. login).
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: { skipGlobalError?: boolean };
    // silent: query latar belakang (polling lonceng, pintasan navbar) yang tidak boleh memunculkan toast
    queryMeta: { silent?: boolean };
  }
}

function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (!query.meta?.silent) handleApiError(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (!mutation.meta?.skipGlobalError) handleApiError(error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function AppProviders({ children }: { children: ReactNode }) {
  // Satu QueryClient per tab browser, dibuat saat komponen pertama kali dirender
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
