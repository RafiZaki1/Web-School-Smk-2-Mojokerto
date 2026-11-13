@php use App\Helpers\BankMiniFormat as F; @endphp
@extends('bank-mini.layouts.app', ['area' => 'siswa', 'judul' => 'Riwayat Transaksi', 'aktif' => 'riwayat'])

@section('konten')
    <section class="rounded-2xl border border-garis bg-white" aria-label="Daftar transaksi">
        @if ($transaksi->isEmpty())
            <div class="px-5 py-14 text-center">
                <x-bank-mini.icon name="history" class="mx-auto h-8 w-8 text-slate-300" />
                <p class="mt-3 text-sm font-semibold text-slate-700">Belum ada transaksi</p>
                <p class="mt-1 text-sm text-slate-500">Pembayaran tunai di loket maupun online akan tercatat di sini.</p>
                <a href="{{ route('bank-mini.dashboard') }}#tagihan" class="mt-4 inline-flex h-10 items-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-600">Lihat tagihan</a>
            </div>
        @else
            <div class="hidden grid-cols-[8rem_1.6fr_1fr_8rem_8rem_7rem] gap-4 border-b border-garis bg-kanvas px-5 py-2.5 text-xs font-semibold text-slate-500 lg:grid">
                <span>Tanggal</span><span>Bulan dibayar</span><span>Metode</span><span class="text-right">Total</span><span>Status</span><span class="text-right">Aksi</span>
            </div>
            <ul class="divide-y divide-garis">
                @foreach ($transaksi as $trx)
                    <li class="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 px-5 py-4 lg:grid-cols-[8rem_1.6fr_1fr_8rem_8rem_7rem] lg:items-center"
                        x-show="$store.cari.cocok(@js($trx->order_id.' '.$trx->ringkasanBulan().' '.$trx->status->label().' '.$trx->channel_nama))">
                        <span class="text-xs text-slate-500 lg:text-sm lg:text-slate-600">{{ F::tanggal($trx->paid_at ?? $trx->created_at) }}</span>
                        <span class="row-start-2 min-w-0 text-sm font-semibold text-slate-900 lg:row-start-auto">
                            {{ $trx->ringkasanBulan() }}
                            <span class="block truncate text-xs font-normal text-slate-500">{{ $trx->order_id }}</span>
                        </span>
                        <span class="row-start-3 text-xs text-slate-500 lg:row-start-auto lg:text-sm lg:text-slate-600">{{ $trx->channel_nama ?? $trx->metode->label() }}</span>
                        <span class="col-start-2 row-start-2 text-right text-sm font-bold text-slate-900 lg:col-start-auto lg:row-start-auto">{{ F::rupiah($trx->totalBayar()) }}</span>
                        <span class="col-start-2 row-start-1 text-right lg:col-start-auto lg:row-start-auto lg:text-left"><x-bank-mini.status-pill :status="$trx->status->value" /></span>
                        <span class="col-start-2 row-start-3 text-right lg:col-start-auto lg:row-start-auto">
                            @if ($trx->isSettlement())
                                <a href="{{ route('bank-mini.kwitansi', $trx->order_id) }}" class="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:underline"><x-bank-mini.icon name="printer" class="h-4 w-4" />Kwitansi</a>
                            @else
                                <a href="{{ route('bank-mini.transaksi.show', $trx->order_id) }}" class="text-sm font-semibold text-navy hover:underline">Detail</a>
                            @endif
                        </span>
                    </li>
                @endforeach
            </ul>
            @if ($transaksi->hasPages())
                <div class="flex items-center justify-between border-t border-garis px-5 py-3 text-sm">
                    <span class="text-slate-500">Halaman {{ $transaksi->currentPage() }} dari {{ $transaksi->lastPage() }}</span>
                    <span class="flex gap-2">
                        @if ($transaksi->previousPageUrl())<a href="{{ $transaksi->previousPageUrl() }}" class="rounded-lg border border-garis px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50">Sebelumnya</a>@endif
                        @if ($transaksi->nextPageUrl())<a href="{{ $transaksi->nextPageUrl() }}" class="rounded-lg border border-garis px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50">Berikutnya</a>@endif
                    </span>
                </div>
            @endif
        @endif
    </section>
@endsection
