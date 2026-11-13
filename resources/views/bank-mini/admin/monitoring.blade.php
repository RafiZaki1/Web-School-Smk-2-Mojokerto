@php
    use App\Enums\BankMini\StatusLunasFilterEnum;
    use App\Enums\MajorCodeEnum;
    use App\Helpers\BankMiniFormat as F;

    $adaFilter = $jurusan || $kelas || $status;
    $urlKelas = fn (string $k) => route('bank-mini.admin.monitoring', array_filter(['tahun' => $tahun, 'kelas' => $k, 'jurusan' => $jurusan, 'status' => $status]));
    $urlSemua = route('bank-mini.admin.monitoring', array_filter(['tahun' => $tahun, 'jurusan' => $jurusan, 'status' => $status]));

    if ($kelas) {
        $dataKasir = collect($matriks)->mapWithKeys(fn ($row) => [$row['siswa']->id => [
            'id' => $row['siswa']->id,
            'nama' => $row['siswa']->nama,
            'nisn' => $row['siswa']->nisn,
            'bulan' => $row['belum_dibayar']->map(fn ($t) => [
                'id' => $t->id, 'label' => $t->labelBulan(), 'total' => $t->total(),
                'spp' => $t->nominal_spp, 'tabungan' => $t->nominal_tabungan, 'menunggak' => $t->statusTampil() === 'menunggak',
            ])->values(),
        ]]);
    }
@endphp
@extends('bank-mini.layouts.app', ['area' => 'admin', 'judul' => $kelas ? 'Monitoring '.$kelas : 'Monitoring Kelas', 'aktif' => 'monitoring', 'pakaiTahun' => true])

@section('konten')
    {{-- Filter --}}
    <form method="GET" action="{{ route('bank-mini.admin.monitoring') }}" class="mb-6 rounded-2xl border border-garis bg-white p-4" aria-label="Filter monitoring">
        <input type="hidden" name="tahun" value="{{ $tahun }}">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <div>
                <label for="f-jurusan" class="mb-1.5 block text-xs font-semibold text-slate-500">Jurusan</label>
                <select id="f-jurusan" name="jurusan" onchange="this.form.kelas.value = ''; this.form.submit()"
                        class="h-10 w-full rounded-lg border border-garis bg-white px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
                    <option value="">Semua jurusan</option>
                    @foreach (MajorCodeEnum::cases() as $m)
                        <option value="{{ $m->value }}" @selected($jurusan === $m->value)>{{ $m->value }} · {{ $m->label() }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label for="f-kelas" class="mb-1.5 block text-xs font-semibold text-slate-500">Kelas</label>
                <select id="f-kelas" name="kelas" onchange="this.form.submit()"
                        class="h-10 w-full rounded-lg border border-garis bg-white px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
                    <option value="">Semua kelas (rekap)</option>
                    @foreach ($opsiKelas as $k)
                        <option value="{{ $k }}" @selected($kelas === $k)>{{ $k }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label for="f-status" class="mb-1.5 block text-xs font-semibold text-slate-500">Status sampai bulan ini</label>
                <select id="f-status" name="status" onchange="this.form.submit()"
                        class="h-10 w-full rounded-lg border border-garis bg-white px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
                    <option value="">Semua status</option>
                    @foreach (StatusLunasFilterEnum::cases() as $s)
                        <option value="{{ $s->value }}" @selected($status === $s->value)>{{ $s->label() }}</option>
                    @endforeach
                </select>
            </div>
            <div class="flex gap-2">
                <noscript><button type="submit" class="h-10 rounded-lg bg-navy px-4 text-sm font-semibold text-white">Terapkan</button></noscript>
                @if ($adaFilter)
                    <a href="{{ route('bank-mini.admin.monitoring', ['tahun' => $tahun]) }}" class="inline-flex h-10 items-center rounded-lg border border-garis px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Reset filter</a>
                @endif
            </div>
        </div>
        <p class="mt-3 text-xs text-slate-500">"Sudah lunas" = semua bulan yang sudah jatuh tempo pada TA {{ $tahun }} sudah dibayar. Bulan yang belum jatuh tempo tidak dihitung.</p>
    </form>

    @if (! $kelas)
        {{-- Rekap semua kelas --}}
        <section aria-label="Ringkasan" class="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            @foreach ([
                ['Kelas belum lunas', $ringkasan['kelas_belum'].' dari '.$ringkasan['kelas'].' kelas', 'bg-rose-50/70 border-rose-100', 'text-rose-700'],
                ['Siswa belum lunas', $ringkasan['siswa_belum'].' dari '.$ringkasan['siswa'].' siswa', 'bg-amber-50/80 border-amber-100', 'text-amber-800'],
                ['Total tunggakan', F::rupiah($ringkasan['tunggakan']), 'bg-blue-50/70 border-blue-100', 'text-blue-700'],
                ['Tabungan terkumpul', F::rupiah($ringkasan['tabungan']), 'bg-emerald-50/70 border-emerald-100', 'text-emerald-700'],
            ] as [$lbl, $nilai, $bg, $teks])
                <div class="rounded-2xl border {{ $bg }} px-4 py-4">
                    <p class="text-xs font-semibold {{ $teks }}">{{ $lbl }}</p>
                    <p class="mt-1 text-xl font-extrabold text-slate-900">{{ $nilai }}</p>
                </div>
            @endforeach
        </section>

        <section class="rounded-2xl border border-garis bg-white" aria-labelledby="judul-rekap">
            <h2 id="judul-rekap" class="border-b border-garis px-5 py-4 text-base font-bold text-slate-900">
                Rekap per kelas · TA {{ $tahun }}
                <span class="ml-1 text-sm font-medium text-slate-500">{{ count($baris) }} kelas</span>
            </h2>
            @if (count($baris) === 0)
                <div class="px-5 py-12 text-center">
                    <p class="text-sm font-semibold text-slate-700">Tidak ada kelas yang cocok dengan filter</p>
                    <p class="mt-1 text-sm text-slate-500">
                        {{ $status === StatusLunasFilterEnum::LUNAS->value ? 'Belum ada kelas yang semua siswanya lunas sampai bulan ini.' : ($status === StatusLunasFilterEnum::BELUM->value ? 'Semua kelas pada pilihan ini sudah lunas sampai bulan ini.' : 'Coba ganti jurusan.') }}
                    </p>
                    <a href="{{ route('bank-mini.admin.monitoring', ['tahun' => $tahun]) }}" class="mt-4 inline-flex h-10 items-center rounded-lg border border-garis px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Reset filter</a>
                </div>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1000px] text-sm">
                        <caption class="sr-only">Rekap pembayaran SPP per kelas</caption>
                        <thead>
                            <tr class="border-b border-garis bg-kanvas text-left text-xs font-semibold text-slate-500">
                                <th scope="col" class="px-5 py-2.5">Kelas</th>
                                <th scope="col" class="px-3 py-2.5">Wali kelas</th>
                                <th scope="col" class="px-3 py-2.5 text-right">Siswa</th>
                                <th scope="col" class="w-48 px-3 py-2.5">Bulan lunas (jatuh tempo)</th>
                                <th scope="col" class="px-3 py-2.5 text-right">Siswa belum lunas</th>
                                <th scope="col" class="px-3 py-2.5 text-right">Tunggakan</th>
                                <th scope="col" class="px-3 py-2.5">Status</th>
                                <th scope="col" class="px-5 py-2.5 text-right"><span class="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-garis">
                            @foreach ($baris as $b)
                                <tr class="hover:bg-slate-50/70" x-show="$store.cari.cocok(@js($b['kelas'].' '.$b['jurusan_label'].' '.$b['wali']))">
                                    <th scope="row" class="px-5 py-3 text-left font-normal">
                                        <a href="{{ $urlKelas($b['kelas']) }}" class="block font-semibold text-slate-900 hover:text-navy">{{ $b['kelas'] }}</a>
                                        <span class="text-xs text-slate-500">{{ $b['jurusan_label'] }}</span>
                                    </th>
                                    <td class="px-3 py-3 text-slate-600">{{ $b['wali'] ?? '-' }}</td>
                                    <td class="px-3 py-3 text-right text-slate-700">{{ $b['siswa'] }}</td>
                                    <td class="px-3 py-3">
                                        @if ($b['persen'] !== null)
                                            <div class="flex items-center gap-2">
                                                <div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow="{{ $b['persen'] }}" aria-valuemin="0" aria-valuemax="100" aria-label="Persentase lunas {{ $b['kelas'] }}">
                                                    <div @class(['h-full rounded-full', 'bg-emerald-500' => $b['persen'] === 100, 'bg-amber-400' => $b['persen'] >= 50 && $b['persen'] < 100, 'bg-rose-500' => $b['persen'] < 50]) style="width: {{ $b['persen'] }}%"></div>
                                                </div>
                                                <span class="w-20 text-right text-xs text-slate-600">{{ $b['lunas'] }}/{{ $b['jatuh_tempo'] }} · {{ $b['persen'] }}%</span>
                                            </div>
                                        @else
                                            <span class="text-xs text-slate-400">Belum ada bulan jatuh tempo</span>
                                        @endif
                                    </td>
                                    <td @class(['px-3 py-3 text-right', 'font-semibold text-rose-700' => $b['siswa_belum'] > 0, 'text-slate-500' => $b['siswa_belum'] === 0])>{{ $b['siswa_belum'] }}</td>
                                    <td class="whitespace-nowrap px-3 py-3 text-right font-semibold text-slate-900">{{ F::rupiah($b['tunggakan']) }}</td>
                                    <td class="px-3 py-3">
                                        @if ($b['status'] === 'lunas')
                                            <x-bank-mini.status-pill status="lunas" />
                                        @elseif ($b['status'] === 'belum')
                                            <span class="inline-flex whitespace-nowrap rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">Belum lunas</span>
                                        @else
                                            <span class="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">Belum ada tagihan</span>
                                        @endif
                                    </td>
                                    <td class="px-5 py-3 text-right">
                                        <a href="{{ $urlKelas($b['kelas']) }}" class="inline-flex h-9 items-center whitespace-nowrap rounded-lg border border-navy-100 bg-navy-50 px-3 text-xs font-semibold text-navy hover:bg-navy-100">Lihat siswa</a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </section>
    @else
        {{-- Satu kelas --}}
        <div class="mb-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <a href="{{ $urlSemua }}" class="inline-flex items-center gap-1 font-semibold text-navy hover:underline">
                <x-bank-mini.icon name="chevron-right" class="h-4 w-4 rotate-180" /> Semua kelas
            </a>
            <p class="text-slate-500">
                Wali kelas {{ $kelas }}:
                @if ($wali)
                    <span class="font-semibold text-slate-700">{{ $wali->user?->name }}</span>
                @else
                    <a href="{{ route('bank-mini.admin.wali-kelas') }}" class="font-semibold text-navy hover:underline">belum diatur</a>
                @endif
                @if ($status)
                    · menampilkan siswa <span class="font-semibold text-slate-700">{{ mb_strtolower(StatusLunasFilterEnum::from($status)->label()) }}</span> ({{ count($matriksTampil) }} dari {{ count($matriks) }})
                @endif
            </p>
        </div>

        @include('bank-mini.partials.matriks-kelas', [
            'bisaBayar' => true,
            'dataKasir' => $dataKasir,
            'kosongSiswa' => 'Akun siswa disalin dari data kelulusan TU. Jalankan <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs">php artisan bank-mini:sync-siswa</code> di server.',
            'kosongTagihan' => '<a href="'.e(route('bank-mini.admin.tagihan')).'" class="font-semibold text-navy hover:underline">Buat tagihan 12 bulan</a> lebih dulu.',
        ])
    @endif
@endsection
