// Bentuk resource Laravel (App\Http\Resources\AlumniResource).
export interface AlumniRecord {
  id: number;
  name: string;
  major_code: string;
  graduation_year: number;
  career: string | null;
  work_location: string | null;
  testimonial: string | null;
  rating: number | null;
  photo: string | null;
  is_featured: boolean;
  sort_order: number;
}

// Bentuk yang dipakai komponen publik dan admin.
export interface Lulusan {
  id: number | null;
  name: string;
  jurusan: string;
  angkatan: number;
  karier: string | null;
  lokasi: string;
  testimoni: string;
  jalur: string;
  skill: string[];
  rating: number | null;
  photo: string | null;
  featured: boolean;
}

// Muatan API saat membuat atau mengubah data lulusan.
export interface AlumniPayload {
  name: string;
  major_code: string;
  graduation_year: string;
  career: string;
  work_location: string;
  photo: File | string | null;
  is_featured: boolean;
  testimonial: string;
  rating: number | null;
}
