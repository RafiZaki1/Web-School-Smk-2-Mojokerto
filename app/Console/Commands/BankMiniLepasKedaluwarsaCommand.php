<?php

namespace App\Console\Commands;

use App\Contracts\Interfaces\BankMiniTransaksiServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Contracts\Interfaces\TripayServiceInterface;
use App\Traits\BankMini\MenerapkanStatusGateway;
use Illuminate\Console\Command;
use Throwable;

/**
 * Lepas transaksi Tripay pending yang kode bayarnya sudah lewat masa berlaku, agar bulannya
 * bisa dibayar lagi. Cadangan bila callback EXPIRED dari Tripay tidak sampai. Dijadwalkan di routes/console.php.
 */
class BankMiniLepasKedaluwarsaCommand extends Command
{
    use MenerapkanStatusGateway;

    /** @var string */
    protected $signature = 'bank-mini:lepas-kedaluwarsa';

    /** @var string */
    protected $description = 'Tandai transaksi gateway Bank Mini yang kedaluwarsa dan lepas kunci bulan tagihannya';

    /**
     * Inisialisasi command dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  TransaksiDetailBulanRepositoryInterface  $detail
     * @param  TagihanSppRepositoryInterface  $tagihan
     * @param  TripayServiceInterface  $tripay
     * @param  BankMiniTransaksiServiceInterface  $transaksiService
     */
    public function __construct(
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected TransaksiDetailBulanRepositoryInterface $detail,
        protected TagihanSppRepositoryInterface $tagihan,
        protected TripayServiceInterface $tripay,
        protected BankMiniTransaksiServiceInterface $transaksiService,
    ) {
        parent::__construct();
    }

    /**
     * Jalankan pelepasan.
     *
     * @return int
     */
    public function handle(): int
    {
        try {
            $jumlah = $this->lepasTransaksiKedaluwarsa();
        } catch (Throwable $th) {
            report($th);
            $this->error('Gagal: '.$th->getMessage());

            return self::FAILURE;
        }

        $this->info("{$jumlah} transaksi kedaluwarsa dilepas.");

        return self::SUCCESS;
    }
}
