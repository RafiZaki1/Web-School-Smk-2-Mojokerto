<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\GraduateImportServiceInterface;
use App\Contracts\Interfaces\GraduationServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\GraduateImportRequest;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class GraduateImportController extends Controller
{
    /**
     * Inisialisasi GraduateImportController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GraduateImportServiceInterface  $importer
     * @param  GraduationServiceInterface  $graduation
     */
    public function __construct(
        protected GraduateImportServiceInterface $importer,
        protected GraduationServiceInterface $graduation,
    ) {}

    /**
     * Impor satu file Excel/CSV berisi seluruh kelas XII. Kolom tahun_lulus yang kosong memakai angkatan aktif.
     *
     * @param  GraduateImportRequest  $request
     * @return JsonResponse
     */
    public function store(GraduateImportRequest $request): JsonResponse
    {
        try {
            $summary = $this->importer->import($request->file('file'), (int) $this->graduation->settings()->active_year);

            return ResponseHelper::success($summary, trans('alert.graduates_imported', [
                'created' => $summary['created'],
                'updated' => $summary['updated'],
                'skipped' => $summary['skipped'],
            ]));
        } catch (InvalidArgumentException|RuntimeException $exception) {
            return ResponseHelper::error(['file' => [$exception->getMessage()]], $exception->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
