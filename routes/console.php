<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Bank Mini: lepas transaksi Tripay yang kode bayarnya kedaluwarsa (cadangan bila callback EXPIRED tidak sampai).
Schedule::command('bank-mini:lepas-kedaluwarsa')->everyTenMinutes()->withoutOverlapping();
