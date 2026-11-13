<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\SchoolEventServiceInterface;
use App\Enums\SchoolEventCategoryEnum;
use App\Helpers\ResponseHelper;
use App\Http\Resources\SchoolEventResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class SchoolEventPublicController extends PublicContentController
{
    /** @var class-string */
    protected string $resource = SchoolEventResource::class;

    protected string $label = 'Agenda';

    /** @var array<int, string> ?when=upcoming|past */
    protected array $extraFilters = ['when'];

    /**
     * Inisialisasi SchoolEventPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SchoolEventServiceInterface  $service
     */
    public function __construct(SchoolEventServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Tampilkan daftar kategori agenda.
     *
     * @return JsonResponse
     */
    public function categories(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                SchoolEventCategoryEnum::values(),
                trans('alert.fetch_success', ['resource' => 'Kategori agenda'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
