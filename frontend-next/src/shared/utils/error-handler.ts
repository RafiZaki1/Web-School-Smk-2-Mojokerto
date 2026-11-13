import { ApiError } from "@/shared/lib/http/api-error";
import { toast } from "@/shared/lib/toast";
import { useAuthStore } from "@/shared/stores/auth.store";

const GENERIC_MESSAGE = "Terjadi kesalahan pada server. Coba lagi beberapa saat.";
const FORBIDDEN_PATH = "/forbidden";

interface HandleOptions {
  // True bila form sudah menampilkan error 422 per field, jadi toast tidak perlu muncul.
  fieldErrorsHandled?: boolean;
}

const redirect = (path: string) => {
  if (typeof window !== "undefined") window.location.replace(path);
};

// Satu tempat untuk menangani error API. Dipanggil dari QueryCache dan MutationCache,
// sehingga setiap halaman tidak perlu menangani status yang sama secara berbeda.
//
// 422 -> error per field (ditangani form), 400/409/404 -> toast pesan dari server,
// 401 -> sesi dihapus lalu kembali ke login, 403 -> halaman Forbidden,
// 5xx dan jaringan -> toast pesan umum.
export function handleApiError(error: unknown, { fieldErrorsHandled = false }: HandleOptions = {}): void {
  if (!(error instanceof ApiError)) {
    toast.error(error instanceof Error && error.message ? error.message : GENERIC_MESSAGE);
    return;
  }

  switch (error.status) {
    case 401: {
      useAuthStore.getState().clearSession();
      const next = typeof window !== "undefined" ? encodeURIComponent(window.location.pathname) : "";
      redirect(`/login?next=${next}&expired=1`);
      return;
    }
    case 403:
      redirect(FORBIDDEN_PATH);
      return;
    case 422:
      if (!fieldErrorsHandled) toast.error(error.message);
      return;
    case 400:
    case 404:
    case 409:
      toast.error(error.message);
      return;
    case 0:
      toast.error(error.message);
      return;
    default:
      toast.error(error.status >= 500 ? GENERIC_MESSAGE : error.message);
  }
}
