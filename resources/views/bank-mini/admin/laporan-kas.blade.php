@php
    use App\Enums\BankMini\MetodeBayarEnum;
    use App\Helpers\BankMiniFormat as F;

    $tunai = $ringkasan[MetodeBayarEnum::TUNAI->value];
    $gateway = $ringkasan[MetodeBayarEnum::GATEWAY->value];
@endphp
@extends('bank-mini.layouts.app', ['area' => 'admin', 'judul' => 'Laporan Kas', 'aktif' => 'laporan'])

@section('aksi-header')
    <button type="button" onclick="window.print()" class="no-print inline-flex h-10 items-center gap-2 self-start rounded-lg border border-garis bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        <x-bank-mini.icon name="printer" class="h-4 w-4" /> Cetak
    </button>
@endsection

@section('konten')
    <form method="GET" class="no-print mb-6 grid gap-3 rounded-2xl border border-garis bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
        <div>
            <label for="dari" class="mb-1.5 block text-xs font-semibold text-slate-500">Dari tanggal</label>
            <input id="dari" type="date" name="dari" value="{{ $dari->toDateString() }}" class="h-10 w-full rounded-lg border border-garis px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
        </div>
        <div>
            <label for="sampai" class="mb-1.5 block text-xs font-semibold text-slate-500">Sampai tanggal</label>
            <input id="sampai" type="date" name="sampai" value="{{ $sampai->toDateString() }}" class="h-10 w-full rounded-lg border border-garis px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
        </div>
        <div>
            <label for="metode" class="mb-1.5 block text-xs font-semibold text-slate-500">Metode</label>
            <select id="metode" name="metode" class="h-10 w-full rounded-lg border border-garis bg-white px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
                <option value="">Semua</option>
                @foreach (MetodeBayarEnum::cases() as $m)
                    <option value="{{ $m->value }}" @selected($metode === $m->value)>{{ $m->label() }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="h-10 rounded-lg bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-600">Terapkan</button>
    </form>

    <p class="mb-3 text-sm text-slate-500">Periode {{ F::tanggal($dari) }} sampai {{ F::tanggal($sampai) }} · hanya transaksi berhasil (settlement).</p>

    <section aria-label="Ringkasan kas" class="mb-6 grid gap-3 sm:gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
            <p class="flex items-center gap-2 text-sm font-semibold text-emerald-700"><x-bank-mini.icon name="cash" class="h-4 w-4" />Kas fisik (tunai di loket)</p>
            <p class="mt-2 text-2xl font-extrabold text-slate-900">{{ F::rupiah($tunai['total']) }}</p>
            <p class="mt-1 text-xs text-slate-600">{{ $tunai['jumlah'] }} transaksi · SPP {{ F::rupiah($tunai['spp']) }} · Tabungan {{ F::rupiah($tunai['tabungan']) }}</p>
        </div>
        <div class="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
            <p class="flex items-center gap-2 text-sm font-semibold text-blue-700"><x-bank-mini.icon name="card" class="h-4 w-4" />Payment gateway (Tripay)</p>
            <p class="mt-2 text-2xl font-extrabold text-slate-900">{{ F::rupiah($gateway['total']) }}</p>
            <p class="mt-1 text-xs text-slate-600">{{ $gateway['jumlah'] }} transaksi · SPP {{ F::rupiah($gateway['spp']) }} · Tabungan {{ F::rupiah($gateway['tabungan']) }}</p>
        </div>
        <div class="rounded-2xl border border-garis bg-white p-5">
            <p class="text-sm font-semibold text-slate-600">Total diterima</p>
            <p class="mt-2 text-2xl font-extrabold text-navy">{{ F::rupiah($tunai['total'] + $gateway['total']) }}</p>
            <p class="mt-1 text-xs text-slate-600">SPP {{ F::rupiah($tunai['spp'] + $gateway['spp']) }} · Tabungan {{ F::rupiah($tunai['tabungan'] + $gateway['tabungan']) }}</p>
        </div>
    </section>

    <section class="rounded-2xl border border-garis bg-white" aria-labelledby="judul-daftar">
        <h2 id="judul-daftar" class="border-b border-garis px-5 py-4 text-base font-bold text-slate-900">Rincian transaksi</h2>
        @if ($transaksi->isEmpty())
            <p class="px-5 py-12 text-center text-sm text-slate-500">Tidak ada pembayaran berhasil pada periode ini. Ubah rentang tanggal di atas untuk melihat periode lain.</p>
        @else
            <div class="overflow-x-auto">
                <table class="w-full min-w-[820px] text-sm">
                    <caption class="sr-only">Transaksi settlement pada periode terpilih</caption>
                    <thead>
                        <tr class="border-b border-garis bg-kanvas text-left text-xs font-semibold text-slate-500">
                            <th scope="col" class="px-5 py-2.5">Waktu bayar</th>
                            <th scope="col" class="px-3 py-2.5">Siswa</th>
                            <th scope="col" class="px-3 py-2.5">Bulan</th>
                            <th scope="col" class="px-3 py-2.5">Metode</th>
                            <th scope="col" class="px-3 py-2.5 text-right">SPP</th>
                            <th scope="col" class="px-3 py-2.5 text-right">Tabungan</th>
                            <th scope="col" class="px-3 py-2.5 text-right">Total</th>
                            <th scope="col" class="no-print px-5 py-2.5 text-right"><span class="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-garis">
                        @foreach ($transaksi as $trx)
                            <tr x-show="$store.cari.cocok(@js($trx->order_id.' '.$trx->siswa?->nama.' '.$trx->siswa?->nisn.' '.$trx->siswa?->kelas))">
                                <td class="whitespace-nowrap px-5 py-3 text-slate-600">{{ F::tanggal($trx->paid_at, true) }}</td>
                                <td class="px-3 py-3">
                                    <span class="block font-semibold text-slate-900">{{ $trx->siswa?->nama }}</span>
                                    <span class="text-xs text-slate-500">{{ $trx->siswa?->kelas }} · {{ $trx->order_id }}</span>
                                </td>
                                <td class="px-3 py-3 text-slate-600">{{ $trx->ringkasanBulan() }}</td>
                                <td class="px-3 py-3 text-slate-600">
                                    {{ $trx->metode === MetodeBayarEnum::TUNAI ? 'Tunai' : ($trx->channel_nama ?? 'Gateway') }}
                                    @if ($trx->petugas)<span class="block text-xs text-slate-400">{{ $trx->petugas->name }}</span>@endif
                                </td>
                                <td class="px-3 py-3 text-right text-slate-700">{{ F::rupiah($trx->porsi_spp) }}</td>
                                <td class="px-3 py-3 text-right text-emerald-700">{{ F::rupiah($trx->porsi_tabungan) }}</td>
                                <td class="px-3 py-3 text-right font-semibold text-slate-900">{{ F::rupiah($trx->total_nominal) }}</td>
                                <td class="no-print px-5 py-3 text-right"><a href="{{ route('bank-mini.admin.kwitansi', $trx->order_id) }}" class="font-semibold text-navy hover:underline">Kwitansi</a></td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @if ($transaksi->hasPages())
                <div class="no-print flex items-center justify-between border-t border-garis px-5 py-3 text-sm">
                    <span class="text-slate-500">Halaman {{ $transaksi->currentPage() }} dari {{ $transaksi->lastPage() }} · {{ $transaksi->total() }} transaksi</span>
                    <span class="flex gap-2">
                        @if ($transaksi->previousPageUrl())<a href="{{ $transaksi->previousPageUrl() }}" class="rounded-lg border border-garis px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50">Sebelumnya</a>@endif
                        @if ($transaksi->nextPageUrl())<a href="{{ $transaksi->nextPageUrl() }}" class="rounded-lg border border-garis px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50">Berikutnya</a>@endif
                    </span>
                </div>
            @endif
        @endif
    </section>
@endsection
