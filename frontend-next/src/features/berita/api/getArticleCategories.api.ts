import { fetchPublic } from "@/shared/lib/http/client";

export const getArticleCategoriesApi = () => fetchPublic<string[]>("/articles/categories");
