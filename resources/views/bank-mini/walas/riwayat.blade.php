@php
    use App\Enums\BankMini\MetodeBayarEnum;
    use App\Helpers\BankMiniFormat as F;
@endphp
@extends('bank-mini.layouts.app', ['area' => 'walas', 'judul' => 'Riwayat Pembayaran '.$kelas, 'aktif' => 'riwayat'])

@section('konten')
    <section class="rounded-2xl border border-garis bg-white" aria-label="Riwayat pembayaran kelas {{ $kelas }}">
        @if ($transaksi->isEmpty())
            <div class="px-5 py-14 text-center">
                <x-bank-mini.icon name="history" class="mx-auto h-8 w-8 text-slate-300" />
                <p class="mt-3 text-sm font-semibold text-slate-700">Belum ada pembayaran dari siswa {{ $kelas }}</p>
                <p class="mt-1 text-sm text-slate-500">Pembayaran tunai di loket maupun online akan muncul di sini.</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full min-w-[760px] text-sm">
                    <caption class="sr-only">Transaksi pembayaran SPP siswa {{ $kelas }}</caption>
                    <thead>
                        <tr class="border-b border-garis bg-kanvas text-left text-xs font-semibold text-slate-500">
                            <th scope="col" class="px-5 py-2.5">Tanggal</th>
                            <th scope="col" class="px-3 py-2.5">Siswa</th>
                            <th scope="col" class="px-3 py-2.5">Bulan dibayar</th>
                            <th scope="col" class="px-3 py-2.5">Metode</th>
                            <th scope="col" class="px-3 py-2.5 text-right">Total</th>
                            <th scope="col" class="px-3 py-2.5">Status</th>
                            <th scope="col" class="px-5 py-2.5 text-right"><span class="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-garis">
                        @foreach ($transaksi as $trx)
                            <tr x-show="$store.cari.cocok(@js($trx->order_id.' '.$trx->siswa?->nama.' '.$trx->siswa?->nisn.' '.$trx->ringkasanBulan()))">
                                <td class="whitespace-nowrap px-5 py-3 text-slate-600">{{ F::tanggal($trx->paid_at ?? $trx->created_at) }}</td>
                                <td class="px-3 py-3">
                                    <span class="block font-semibold text-slate-900">{{ $trx->siswa?->nama }}</span>
                                    <span class="text-xs text-slate-500">{{ $trx->siswa?->nisn }}</span>
                                </td>
                                <td class="px-3 py-3 text-slate-600">{{ $trx->ringkasanBulan() }}</td>
                                <td class="px-3 py-3 text-slate-600">{{ $trx->metode === MetodeBayarEnum::TUNAI ? 'Tunai' : ($trx->channel_nama ?? 'Online') }}</td>
                                <td class="px-3 py-3 text-right font-semibold text-slate-900">{{ F::rupiah($trx->total_nominal) }}</td>
                                <td class="px-3 py-3"><x-bank-mini.status-pill :status="$trx->status->value" /></td>
                                <td class="px-5 py-3 text-right">
                                    @if ($trx->isSettlement())
                                        <a href="{{ route('bank-mini.walas.kwitansi', $trx->order_id) }}" class="font-semibold text-navy hover:underline">Kwitansi</a>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
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
