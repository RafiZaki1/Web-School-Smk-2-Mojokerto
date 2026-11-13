{{--
    Ringkasan + matriks 12 bulan satu kelas. Dipakai monitoring petugas (bisaBayar = true,
    ada tombol bayar tunai) dan dasbor wali kelas (baca saja).
    Variabel: $kelas, $tahun, $matriks (semua siswa, untuk kartu), $matriksTampil (tersaring status),
    $status, $tabStatus (tampilkan tab status di kepala tabel), $rekapKelas, $bisaBayar, $kosongSiswa, $kosongTagihan.
--}}
@php
    use App\Enums\BankMini\BulanAkademikEnum;
    use App\Enums\BankMini\StatusLunasFilterEnum;
    use App\Helpers\BankMiniFormat as F;

    $bulanHeader = collect(BulanAkademikEnum::cases())->sortBy(fn ($b) => $b->urutan())->values();
    $sel = [
        'lunas' => ['bg-emerald-500 text-white', 'L', 'Lunas'],
        'menunggak' => ['bg-rose-500 text-white', '!', 'Menunggak'],
        'pending' => ['bg-amber-400 text-amber-950', 'P', 'Pending'],
        'belum_jatuh_tempo' => ['bg-slate-200 text-slate-500', '', 'Belum jatuh tempo'],
    ];
    $barisTampil = $matriksTampil ?? $matriks;
    $status = $status ?? null;
    $adaTagihan = collect($matriks)->contains(fn ($row) => collect($row['bulan'])->filter()->isNotEmpty());
    $tabunganKelas = collect($matriks)->sum('tabungan');
    $kartu = [
        ['Siswa aktif', count($matriks).' siswa', 'bg-blue-50/70 border-blue-100', 'text-blue-700'],
        ['Bulan lunas (jatuh tempo)', $rekapKelas ? $rekapKelas->lunas.' / '.$rekapKelas->jatuh_tempo : '0 / 0', 'bg-emerald-50/70 border-emerald-100', 'text-emerald-700'],
        ['Total tunggakan', F::rupiah($rekapKelas->tunggakan ?? 0), 'bg-rose-50/70 border-rose-100', 'text-rose-700'],
        ['Tabungan terkumpul', F::rupiah($tabunganKelas), 'bg-amber-50/80 border-amber-100', 'text-amber-800'],
    ];
@endphp

<section aria-label="Ringkasan kelas {{ $kelas }}" class="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
    @foreach ($kartu as [$lbl, $nilai, $bg, $teks])
        <div class="rounded-2xl border {{ $bg }} px-4 py-4">
            <p class="text-xs font-semibold {{ $teks }}">{{ $lbl }}</p>
            <p class="mt-1 text-xl font-extrabold text-slate-900">{{ $nilai }}</p>
        </div>
    @endforeach
</section>

<section class="rounded-2xl border border-garis bg-white" aria-labelledby="judul-matriks"
         @if ($bisaBayar) x-data="kasir(@js($dataKasir), @js(route('bank-mini.admin.bayar-tunai')))" @endif>
    <div class="flex flex-col gap-3 border-b border-garis px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <h2 id="judul-matriks" class="text-base font-bold text-slate-900">Matriks pembayaran {{ $kelas }} · TA {{ $tahun }}</h2>
            @if ($tabStatus ?? false)
                <nav class="flex rounded-lg border border-garis bg-kanvas p-0.5 text-xs font-semibold" aria-label="Saring status pembayaran">
                    @foreach (['' => 'Semua', ...collect(StatusLunasFilterEnum::cases())->mapWithKeys(fn ($c) => [$c->value => $c->label()])->all()] as $nilai => $label)
                        @php $aktifTab = ($status ?? '') === $nilai; @endphp
                        <a href="{{ request()->fullUrlWithQuery(['status' => $nilai ?: null]) }}" @if ($aktifTab) aria-current="true" @endif
                           @class(['rounded-md px-2.5 py-1', 'bg-white text-navy shadow-sm' => $aktifTab, 'text-slate-500 hover:text-slate-800' => ! $aktifTab])>{{ $label }}</a>
                    @endforeach
                </nav>
            @endif
        </div>
        <ul class="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600" aria-label="Keterangan warna">
            @foreach ($sel as [$warna, $huruf, $lbl])
                <li class="flex items-center gap-1.5"><span class="flex h-5 w-5 items-center justify-center rounded {{ $warna }} text-[10px] font-bold">{{ $huruf }}</span>{{ $lbl }}</li>
            @endforeach
        </ul>
    </div>

    @if (count($matriks) === 0)
        <div class="px-5 py-14 text-center">
            <x-bank-mini.icon name="user" class="mx-auto h-8 w-8 text-slate-300" />
            <p class="mt-3 text-sm font-semibold text-slate-700">Belum ada siswa aktif di {{ $kelas }}</p>
            <p class="mt-1 text-sm text-slate-500">{!! $kosongSiswa !!}</p>
        </div>
    @elseif (! $adaTagihan)
        <div class="px-5 py-14 text-center">
            <x-bank-mini.icon name="file-plus" class="mx-auto h-8 w-8 text-slate-300" />
            <p class="mt-3 text-sm font-semibold text-slate-700">Tagihan TA {{ $tahun }} untuk {{ $kelas }} belum dibuat</p>
            <p class="mt-1 text-sm text-slate-500">{!! $kosongTagihan !!}</p>
        </div>
    @else
        <div class="overflow-x-auto">
            <table class="w-full {{ $bisaBayar ? 'min-w-[960px]' : 'min-w-[860px]' }} text-sm">
                <caption class="sr-only">Status pembayaran SPP per siswa dan bulan, {{ $kelas }}</caption>
                <thead>
                    <tr class="border-b border-garis bg-kanvas text-xs font-semibold text-slate-500">
                        <th scope="col" class="sticky left-0 z-10 bg-kanvas px-5 py-2.5 text-left">Siswa</th>
                        @foreach ($bulanHeader as $b)
                            <th scope="col" class="px-1 py-2.5 text-center" title="{{ $b->nama() }}">{{ $b->singkat() }}</th>
                        @endforeach
                        <th scope="col" class="px-3 py-2.5 text-right">Tabungan</th>
                        @if ($bisaBayar)<th scope="col" class="px-5 py-2.5 text-right">Aksi</th>@endif
                    </tr>
                </thead>
                <tbody class="divide-y divide-garis">
                    @foreach ($barisTampil as $row)
                        @php $s = $row['siswa']; @endphp
                        <tr class="hover:bg-slate-50/70" x-show="$store.cari.cocok(@js($s->nama.' '.$s->nisn))">
                            <th scope="row" class="sticky left-0 z-10 bg-white px-5 py-3 text-left font-normal">
                                <span class="block max-w-[14rem] truncate font-semibold text-slate-900">{{ $s->nama }}</span>
                                <span class="text-xs text-slate-500">{{ $s->nisn }}@if ($row['menunggak'] > 0) · <span class="font-semibold text-rose-600">{{ $row['menunggak'] }} bln menunggak</span>@endif</span>
                            </th>
                            @foreach (range(1, 12) as $urutan)
                                @php $t = $row['bulan'][$urutan] ?? null; @endphp
                                <td class="px-1 py-3 text-center">
                                    @if ($t)
                                        @php [$warna, $huruf, $lbl] = $sel[$t->statusTampil()]; @endphp
                                        <span class="mx-auto flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold {{ $warna }}" title="{{ $t->labelBulan() }}: {{ $lbl }}">
                                            <span aria-hidden="true">{{ $huruf }}</span><span class="sr-only">{{ $t->labelBulan() }}: {{ $lbl }}</span>
                                        </span>
                                    @else
                                        <span class="text-slate-300" title="Belum ada tagihan">-</span>
                                    @endif
                                </td>
                            @endforeach
                            <td class="px-3 py-3 text-right font-semibold text-emerald-700">{{ F::rupiah($row['tabungan']) }}</td>
                            @if ($bisaBayar)
                                <td class="px-5 py-3 text-right">
                                    <button type="button" @click="buka({{ $s->id }})" @disabled($row['belum_dibayar']->isEmpty())
                                            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-navy-100 bg-navy-50 px-3 text-xs font-semibold text-navy hover:bg-navy-100 disabled:cursor-not-allowed disabled:border-garis disabled:bg-white disabled:text-slate-400">
                                        <x-bank-mini.icon name="cash" class="h-4 w-4" />{{ $row['belum_dibayar']->isEmpty() ? 'Lunas' : 'Bayar tunai' }}
                                    </button>
                                </td>
                            @endif
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @if (count($barisTampil) === 0)
            <p class="px-5 py-10 text-center text-sm text-slate-500">
                {{ $status === StatusLunasFilterEnum::LUNAS->value ? 'Belum ada siswa '.$kelas.' yang lunas sampai bulan ini.' : 'Semua siswa '.$kelas.' sudah lunas sampai bulan ini.' }}
            </p>
        @endif
    @endif

    @if ($bisaBayar)
        @include('bank-mini.admin.partials.modal-tunai')
    @endif
</section>
