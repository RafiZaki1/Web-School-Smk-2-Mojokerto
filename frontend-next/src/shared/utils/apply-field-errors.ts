import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/shared/lib/http/api-error";
import { handleApiError } from "@/shared/utils/error-handler";

/**
 * Tampilkan error 422 dari backend di field form React Hook Form. Status lain diteruskan ke
 * handler global (toast, redirect login, halaman Forbidden).
 * `fieldMap` memetakan nama field backend ke nama field form bila berbeda.
 */
export function applyFieldErrors<T extends FieldValues>(setError: UseFormSetError<T>, error: unknown, fieldMap: Record<string, string> = {}): void {
  if (error instanceof ApiError && error.status === 422 && error.fieldErrors) {
    Object.entries(error.fieldErrors).forEach(([key, messages]) => {
      const name = (fieldMap[key] ?? key.split(".")[0]) as Path<T>;
      setError(name, { type: "server", message: messages[0] });
    });
    handleApiError(error, { fieldErrorsHandled: true });
    return;
  }
  handleApiError(error);
}
