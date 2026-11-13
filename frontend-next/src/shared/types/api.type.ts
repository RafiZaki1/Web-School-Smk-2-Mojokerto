// Amplop respons standar backend Laravel: { data, meta? }.
export interface ApiEnvelope<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiMeta {
  message?: string;
}

// Pesan error validasi (422) per field, mis. { name: ["Nama wajib diisi."] }.
export type ApiFieldErrors = Record<string, string[]>;

export interface ApiErrorBody {
  meta?: ApiMeta;
  data?: ApiFieldErrors | null;
}

// Data berhalaman dari ResponseHelper::paginate: { paginate, data } di dalam `data` amplop.
export interface PaginateMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  paginate: PaginateMeta;
  data: T[];
}
