<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\DocumentServiceInterface;
use App\Enums\DocumentCategoryEnum;
use App\Helpers\ResponseHelper;
use App\Http\Resources\Concerns\FormatsImageUrl;
use App\Http\Resources\DocumentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class DocumentPublicController extends PublicContentController
{
    use FormatsImageUrl;

    /** @var class-string */
    protected string $resource = DocumentResource::class;

    protected string $label = 'Berkas unduhan';

    protected DocumentServiceInterface $documents;

    /**
     * Inisialisasi DocumentPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  DocumentServiceInterface  $service
     */
    public function __construct(DocumentServiceInterface $service)
    {
        $this->service = $service;
        $this->documents = $service;
    }

    /**
     * Tampilkan daftar kategori unduhan.
     *
     * @return JsonResponse
     */
    public function categories(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                DocumentCategoryEnum::values(),
                trans('alert.fetch_success', ['resource' => 'Kategori unduhan'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Catat satu unduhan lalu arahkan ke berkas aslinya.
     *
     * @param  string  $slug
     * @return RedirectResponse
     */
    public function download(string $slug): RedirectResponse
    {
        try {
            $document = $this->documents->recordDownload($slug);
            $url = $this->formatImageUrl($document->file);

            abort_unless($url, 404);

            return redirect()->away(str_starts_with($url, '/') ? rtrim((string) config('app.frontend_url'), '/').$url : $url);
        } catch (Throwable $th) {
            Log::error($th);
            abort(404);
        }
    }
}
