<?php

namespace App\Services\SchoolAdministration;

use App\Enums\AlumniServiceStatusEnum;
use App\Enums\AlumniServiceTypeEnum;
use App\Models\AlumniServiceRequest;

/**
 * Menyusun isi notifikasi lonceng dan Web Push untuk perubahan status pengajuan alumni.
 */
class AlumniServiceNotificationComposer
{
    /** Status yang juga dikirim sebagai Web Push ke layar HP, bukan hanya isi lonceng. */
    private const PUSHED_STATUSES = [AlumniServiceStatusEnum::APPROVED, AlumniServiceStatusEnum::REJECTED];

    /**
     * Status yang menghasilkan notifikasi lonceng. Status kembali ke Menunggu tidak diberitahukan.
     *
     * @param  AlumniServiceStatusEnum  $status
     * @return bool
     */
    public function shouldNotify(AlumniServiceStatusEnum $status): bool
    {
        return $status !== AlumniServiceStatusEnum::PENDING;
    }

    /**
     * Status yang dikirim ke layar HP lewat Web Push.
     *
     * @param  string  $status
     * @return bool
     */
    public function shouldPush(string $status): bool
    {
        return in_array(AlumniServiceStatusEnum::tryFrom($status), self::PUSHED_STATUSES, true);
    }

    /**
     * Data baris device_notifications untuk status tertentu.
     *
     * @param  AlumniServiceRequest  $request
     * @param  AlumniServiceStatusEnum  $status
     * @return array<string, mixed>
     */
    public function compose(AlumniServiceRequest $request, AlumniServiceStatusEnum $status): array
    {
        $service = AlumniServiceTypeEnum::tryFrom((string) $request->service_type)?->label() ?? 'Layanan';
        $ticket = $request->ticket_code;
        $note = $request->admin_note ? ' Catatan TU: '.$request->admin_note : '';

        [$title, $body] = match ($status) {
            AlumniServiceStatusEnum::PENDING => ['Pengajuan diterima', "{$service} dengan kode {$ticket} sudah masuk antrean TU. Status: Menunggu."],
            AlumniServiceStatusEnum::PROCESSING => ['Pengajuan sedang diproses', "{$service} dengan kode {$ticket} sedang disiapkan oleh TU.{$note}"],
            AlumniServiceStatusEnum::APPROVED => ['Pengajuan disetujui, silakan ke ruang TU', "{$service} dengan kode {$ticket} sudah disetujui. Datang ke ruang TU SMKN 2 Kota Mojokerto pada jam kerja dan tunjukkan kode ini.{$note}"],
            AlumniServiceStatusEnum::REJECTED => ['Pengajuan belum dapat diproses', "{$service} dengan kode {$ticket} belum dapat diproses.{$note}"],
            AlumniServiceStatusEnum::COMPLETED => ['Layanan selesai', "{$service} dengan kode {$ticket} sudah selesai. Terima kasih."],
        };

        return [
            'device_token' => $request->device_token,
            'alumni_service_request_id' => $request->id,
            'title' => $title,
            'body' => $body,
            'url' => '/layanan-alumni?tiket='.$ticket,
        ];
    }
}
