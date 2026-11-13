export type PublishStatus = "Aktif" | "Draf";

// Label status publish yang tampil di panel admin.
export const publishLabel = (isPublished: boolean): PublishStatus => (isPublished ? "Aktif" : "Draf");
