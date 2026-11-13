<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\SchoolRuleServiceInterface;
use App\Http\Requests\SchoolRuleRequest;
use App\Http\Resources\SchoolRuleResource;
use Illuminate\Http\JsonResponse;

class SchoolRuleController extends AdminRecordController
{
    /** @var class-string */
    protected string $resource = SchoolRuleResource::class;

    protected string $label = 'Tata tertib';

    /** @var array<int, string> */
    protected array $filters = ['section'];

    /**
     * Inisialisasi SchoolRuleController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SchoolRuleServiceInterface  $service
     */
    public function __construct(SchoolRuleServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan poin tata tertib baru.
     *
     * @param  SchoolRuleRequest  $request
     * @return JsonResponse
     */
    public function store(SchoolRuleRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui poin tata tertib.
     *
     * @param  SchoolRuleRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(SchoolRuleRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
