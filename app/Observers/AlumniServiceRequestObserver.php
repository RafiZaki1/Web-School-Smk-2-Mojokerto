<?php

namespace App\Observers;

use App\Enums\SchoolClassEnum;
use App\Helpers\TicketCodeHelper;
use App\Models\AlumniServiceRequest;

class AlumniServiceRequestObserver
{
    /**
     * Isi kode tiket dan kode jurusan (dari kelas) sebelum pengajuan disimpan.
     *
     * @param  AlumniServiceRequest  $request
     * @return void
     */
    public function creating(AlumniServiceRequest $request): void
    {
        $request->ticket_code ??= TicketCodeHelper::generate();

        if (empty($request->major_code)) {
            $request->major_code = SchoolClassEnum::fromInput($request->class_name)?->major()->value;
        }
    }
}
