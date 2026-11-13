<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\DocumentRepositoryInterface;
use App\Models\Document;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class DocumentRepository extends BaseRepository implements DocumentRepositoryInterface
{
    /** @var class-string<Document> */
    protected string $model = Document::class;

    /**
     * Terapkan filter kategori dan pencarian judul pada daftar berkas.
     *
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['category'] ?? null, fn (Builder $q, $category) => $q->where('category', $category))
            ->when($filters['search'] ?? null, fn (Builder $q, $search) => $q->where('title', 'like', '%'.trim($search).'%'));
    }

    /**
     * Tambah jumlah unduhan secara atomic tanpa mengubah waktu pembaruan terakhir.
     */
    public function incrementDownloads(Model $document): void
    {
        Document::withoutTimestamps(fn () => $document->increment('download_count'));
    }
}
