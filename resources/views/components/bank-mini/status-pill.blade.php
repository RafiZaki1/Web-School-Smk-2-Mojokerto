@props(['status'])
@php
    // Status tagihan tampil (lunas, menunggak, pending, belum_jatuh_tempo) atau status transaksi.
    $peta = [
        'lunas' => ['Lunas', 'bg-emerald-50 text-emerald-700 ring-emerald-200'],
        'settlement' => ['Berhasil', 'bg-emerald-50 text-emerald-700 ring-emerald-200'],
        'menunggak' => ['Menunggak', 'bg-rose-50 text-rose-700 ring-rose-200'],
        'failed' => ['Gagal', 'bg-rose-50 text-rose-700 ring-rose-200'],
        'pending' => ['Pending', 'bg-amber-50 text-amber-800 ring-amber-200'],
        'belum_jatuh_tempo' => ['Belum Jatuh Tempo', 'bg-slate-100 text-slate-600 ring-slate-200'],
        'expired' => ['Kedaluwarsa', 'bg-slate-100 text-slate-600 ring-slate-200'],
    ];
    [$label, $warna] = $peta[$status] ?? [ucfirst(str_replace('_', ' ', $status)), 'bg-slate-100 text-slate-600 ring-slate-200'];
@endphp
<span {{ $attributes->merge(['class' => "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset {$warna}"]) }}>{{ $label }}</span>
