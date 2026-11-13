import type { ApiFieldErrors } from "@/shared/types/api.type";

// Error API yang sudah dinormalisasi. Status 0 berarti tidak ada respons (jaringan atau timeout).
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: ApiFieldErrors | null;

  constructor(message: string, status: number, fieldErrors: ApiFieldErrors | null = null, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
