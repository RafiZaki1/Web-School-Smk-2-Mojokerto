// Bentuk resource Laravel (App\Http\Resources\ArticleResource).
export interface ArticleRecord {
  id: number;
  slug: string;
  title: string;
  category: string;
  author: string | null;
  published_at: string | null;
  published_label: string | null;
  cover_image: string | null;
  excerpt: string;
  body: string;
  paragraphs: string[];
  gallery: string[];
  is_published: boolean;
  updated_at: string | null;
}

// Bentuk yang dipakai komponen publik dan admin.
export interface Berita {
  id: number | null;
  slug: string;
  category: string;
  title: string;
  date: string;
  publishedAt: string | null;
  thumb: string | null;
  hero: string | null;
  gradient: string;
  author: string;
  excerpt: string;
  paragraphs: string[];
  gallery: string[];
  status: "Aktif" | "Draf";
  updatedAt: string | null;
}

// Satu berita di kolom "Berita Terbaru" pada sidebar detail.
export interface BeritaTeaser {
  title: string;
  tag: string;
  gradient: string;
  thumb: string | null;
  href: string;
}

// Muatan yang dikirim ke API saat membuat atau mengubah berita.
export interface ArticlePayload {
  title: string;
  category: string;
  author: string;
  published_at?: string;
  cover_image: File | string | null;
  body: string;
  gallery: (File | string)[];
  is_published: boolean;
}
