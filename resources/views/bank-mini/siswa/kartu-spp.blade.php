@php
    use App\Helpers\BankMiniFormat as F;
    use App\Enums\BankMini\MetodeBayarEnum;

    $lunas = $tagihan->filter(fn ($t) => $t->statusTampil() === 'lunas');
@endphp
@extends('bank-mini.layouts.app', ['area' => 'siswa', 'judul' => 'Kartu SPP Digital', 'aktif' => 'kartu', 'pakaiTahun' => true])

@section('aksi-header')
    <button type="button" onclick="window.print()" class="no-print inline-flex h-10 items-center gap-2 self-start rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-600">
        <x-bank-mini.icon name="printer" class="h-4 w-4" /> Cetak kartu
    </button>
@endsection

@section('konten')
    <article class="print-flat rounded-2xl border border-garis bg-white p-5 sm:p-8">
        <header class="flex flex-col gap-4 border-b border-garis pb-5 sm:flex-row sm:items-center">
            <img src="{{ asset('images/brand/emblem-smkn2.png') }}" alt="" width="48" height="48" class="h-12 w-12 object-contain">
            <div class="flex-1">
                <p class="text-xs font-semibold text-slate-500">KARTU PEMBAYARAN SPP · TAHUN AJARAN {{ $tahun }}</p>
                <p class="text-lg font-bold text-navy">Bank Mini SMK Negeri 2 Kota Mojokerto</p>
            </div>
            <dl class="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:text-right">
                <dt class="text-slate-500 sm:hidden">Nama</dt><dd class="font-semibold text-slate-900 sm:col-span-2">{{ $siswa->nama }}</dd>
                <dt class="text-slate-500 sm:hidden">NISN · Kelas</dt><dd class="text-slate-600 sm:col-span-2">{{ $siswa->nisn }} · {{ $siswa->kelas }}</dd>
            </dl>
        </header>

        @if ($tagihan->isEmpty())
            <p class="py-10 text-center text-sm text-slate-500">Tagihan TA {{ $tahun }} belum dibuat oleh petugas Bank Mini.</p>
        @else
            <div class="-mx-5 overflow-x-auto sm:mx-0">
                <table class="mt-4 w-full min-w-[640px] text-sm">
                    <caption class="sr-only">Status pembayaran SPP per bulan</caption>
                    <thead>
                        <tr class="border-b border-garis text-left text-xs font-semibold text-slate-500">
                            <th scope="col" class="px-5 py-2.5 sm:pl-0">Bulan</th>
                            <th scope="col" class="px-3 py-2.5">Jatuh tempo</th>
                            <th scope="col" class="px-3 py-2.5 text-right">Nominal</th>
                            <th scope="col" class="px-3 py-2.5">Status</th>
                            <th scope="col" class="px-3 py-2.5">Tanggal bayar</th>
                            <th scope="col" class="px-5 py-2.5 sm:pr-0">Metode · No. transaksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-garis">
                        @foreach ($tagihan as $t)
                            @php $p = $pelunasan->get($t->id); @endphp
                            <tr x-show="$store.cari.cocok(@js($t->labelBulan()))">
                                <th scope="row" class="px-5 py-3 text-left font-semibold text-slate-900 sm:pl-0">{{ $t->labelBulan() }}</th>
                                <td class="px-3 py-3 text-slate-600">{{ F::tanggal($t->jatuh_tempo) }}</td>
                                <td class="px-3 py-3 text-right text-slate-800">{{ F::rupiah($t->total()) }}</td>
                                <td class="px-3 py-3"><x-bank-mini.status-pill :status="$t->statusTampil()" /></td>
                                <td class="px-3 py-3 text-slate-600">{{ $p ? F::tanggal(\Illuminate\Support\Carbon::parse($p->paid_at)) : '-' }}</td>
                                <td class="px-5 py-3 text-slate-600 sm:pr-0">
                                    @if ($p)
                                        {{ MetodeBayarEnum::from($p->metode)->label() }}
                                        <span class="block text-xs text-slate-400">{{ $p->order_id }}</span>
                                    @else
                                        -
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <dl class="mt-6 grid grid-cols-2 gap-4 border-t border-garis pt-5 text-sm sm:grid-cols-4">
                <div><dt class="text-xs text-slate-500">Bulan lunas</dt><dd class="text-base font-bold text-slate-900">{{ $lunas->count() }} dari {{ $tagihan->count() }}</dd></div>
                <div><dt class="text-xs text-slate-500">Total tagihan setahun</dt><dd class="text-base font-bold text-slate-900">{{ F::rupiah($total['total']) }}</dd></div>
                <div><dt class="text-xs text-slate-500">Sudah dibayar</dt><dd class="text-base font-bold text-emerald-700">{{ F::rupiah($lunas->sum(fn ($t) => $t->total())) }}</dd></div>
                <div><dt class="text-xs text-slate-500">Sisa</dt><dd class="text-base font-bold text-rose-700">{{ F::rupiah($total['total'] - $lunas->sum(fn ($t) => $t->total())) }}</dd></div>
            </dl>
            <p class="mt-6 text-xs text-slate-400">Dicetak {{ F::tanggal(now(), true) }} WIB dari portal Bank Mini. Kartu ini sah tanpa tanda tangan karena datanya tercatat di sistem.</p>
        @endif
    </article>
@endsection
