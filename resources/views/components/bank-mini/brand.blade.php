@props(['size' => 'md'])
{{-- Logo resmi sekolah, sama dengan brand navbar situs utama (emblem asli + nama sekolah). --}}
@php $emblem = $size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'; @endphp
<span {{ $attributes->merge(['class' => 'flex min-w-0 items-center gap-3']) }}>
    <img src="{{ asset('images/brand/emblem-smkn2.png') }}" alt="" width="46" height="46" class="{{ $emblem }} shrink-0 object-contain">
    <span class="min-w-0 leading-tight">
        <strong class="block truncate text-[15px] font-extrabold tracking-wide text-slate-900">SMK NEGERI 2</strong>
        <span class="block truncate text-xs font-semibold tracking-[0.12em] text-slate-600">KOTA MOJOKERTO</span>
    </span>
</span>
