import { createAdminResource } from "@/shared/lib/http/admin-resource";
import type { ArticlePayload, ArticleRecord } from "../types/berita.type";

export const adminBeritaApi = createAdminResource<ArticleRecord, ArticlePayload>("articles");
