@php
    use App\Helpers\AcademicYearHelper;
    use App\Helpers\BankMiniFormat;

    $area = $area ?? 'siswa';
    $aktif = $aktif ?? '';
    $tahunAktif = $tahun ?? AcademicYearHelper::current();
    $pilihanTahun = ($pakaiTahun ?? false) ? ($opsiTahun ?? []) : [];

    $menu = match ($area) {
        'admin' => [
            'UTAMA' => [
                ['kunci' => 'monitoring', 'label' => 'Monitoring Kelas', 'ikon' => 'grid', 'url' => route('bank-mini.admin.monitoring'), 'warna' => 'bg-blue-50 text-blue-600'],
                ['kunci' => 'pembayaran', 'label' => 'Pembayaran Masuk', 'ikon' => 'card', 'url' => route('bank-mini.admin.pembayaran'), 'warna' => 'bg-amber-50 text-amber-600'],
                ['kunci' => 'laporan', 'label' => 'Laporan Kas', 'ikon' => 'report', 'url' => route('bank-mini.admin.laporan'), 'warna' => 'bg-emerald-50 text-emerald-600'],
            ],
            'KELOLA SPP' => [
                ['kunci' => 'tagihan', 'label' => 'Generate Tagihan', 'ikon' => 'file-plus', 'url' => route('bank-mini.admin.tagihan'), 'warna' => 'bg-violet-50 text-violet-600'],
                ['kunci' => 'wali-kelas', 'label' => 'Akun Wali Kelas', 'ikon' => 'user', 'url' => route('bank-mini.admin.wali-kelas'), 'warna' => 'bg-sky-50 text-sky-600'],
                ['kunci' => 'layanan', 'label' => 'Buka / Tutup Layanan', 'ikon' => 'clock', 'url' => route('bank-mini.admin.layanan'), 'warna' => 'bg-rose-50 text-rose-600'],
            ],
        ],
        'walas' => [
            'KELAS SAYA' => [
                ['kunci' => 'dashboard', 'label' => 'Dasbor Kelas', 'ikon' => 'grid', 'url' => route('bank-mini.walas.dashboard'), 'warna' => 'bg-blue-50 text-blue-600'],
                ['kunci' => 'riwayat', 'label' => 'Riwayat Pembayaran', 'ikon' => 'history', 'url' => route('bank-mini.walas.riwayat'), 'warna' => 'bg-emerald-50 text-emerald-600'],
            ],
        ],
        default => [
            'UTAMA' => [
                ['kunci' => 'dashboard', 'label' => 'Dasbor Keuangan', 'ikon' => 'wallet', 'url' => route('bank-mini.dashboard'), 'warna' => 'bg-blue-50 text-blue-600'],
                ['kunci' => 'riwayat', 'label' => 'Riwayat Transaksi', 'ikon' => 'history', 'url' => route('bank-mini.riwayat'), 'warna' => 'bg-emerald-50 text-emerald-600'],
            ],
            'LAYANAN SPP' => [
                ['kunci' => 'bayar', 'label' => 'Bayar SPP Online', 'ikon' => 'card', 'url' => route('bank-mini.dashboard').'#tagihan', 'warna' => 'bg-amber-50 text-amber-600'],
                ['kunci' => 'kartu', 'label' => 'Kartu SPP Digital', 'ikon' => 'id-card', 'url' => route('bank-mini.kartu'), 'warna' => 'bg-violet-50 text-violet-600'],
            ],
        ],
    };

    if ($area === 'siswa') {
        $pengguna = auth('siswa')->user();
        $namaProfil = $pengguna?->nama ?? 'Siswa';
        $subProfil = ($pengguna?->nisn ?? '').' · '.($pengguna?->kelas ?? '');
        $inisial = $pengguna?->inisial() ?? 'S';
    } else {
        $pengguna = auth('web')->user();
        $namaProfil = $pengguna?->name ?? 'Petugas';
        $subProfil = match (true) {
            $area === 'walas' => 'Wali Kelas '.($kelas ?? ''),
            $pengguna?->role === 'admin' => 'Administrator',
            default => '@'.($pengguna?->username ?? 'petugas'),
        };
        $kata = preg_split('/\s+/', trim($namaProfil)) ?: [];
        $inisial = mb_strtoupper(mb_substr($kata[0] ?? '', 0, 1).mb_substr($kata[1] ?? '', 0, 1));
    }

    $beranda = match ($area) {
        'admin' => route('bank-mini.admin.monitoring'),
        'walas' => route('bank-mini.walas.dashboard'),
        default => route('bank-mini.dashboard'),
    };
    $logout = match ($area) {
        'admin' => route('bank-mini.admin.logout'),
        'walas' => route('bank-mini.walas.logout'),
        default => route('bank-mini.logout'),
    };
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    @include('bank-mini.partials.head', ['judul' => $judul ?? 'Bank Mini'])
    @stack('head')
</head>
<body class="min-h-screen bg-kanvas font-sans text-slate-800 antialiased" x-data="{ sidebar: false }" @keydown.escape.window="sidebar = false">
    <a href="#konten" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy focus:ring-2 focus:ring-navy">Lewati ke konten</a>

    {{-- Latar gelap sidebar ponsel --}}
    <div x-cloak x-show="sidebar" x-transition.opacity class="no-print fixed inset-0 z-30 bg-slate-900/40 lg:hidden" @click="sidebar = false"></div>

    {{-- Sidebar --}}
    <aside class="no-print fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-garis bg-white transition-transform duration-200 lg:translate-x-0"
           :class="sidebar && 'translate-x-0'" aria-label="Menu utama">
        <div class="flex h-16 items-center gap-3 border-b border-garis px-5">
            <a href="{{ $beranda }}" aria-label="SMK Negeri 2 Kota Mojokerto, Bank Mini" class="min-w-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
                <x-bank-mini.brand />
            </a>
            <button type="button" class="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy lg:hidden" @click="sidebar = false" aria-label="Tutup menu">
                <x-bank-mini.icon name="close" />
            </button>
        </div>

        <nav class="flex-1 space-y-6 overflow-y-auto px-4 py-5">
            @foreach ($menu as $grup => $items)
                <div>
                    <p class="px-3 pb-2 text-[11px] font-semibold tracking-wide text-slate-400">{{ $grup }}</p>
                    <ul class="space-y-1">
                        @foreach ($items as $item)
                            @php $isAktif = $aktif === $item['kunci']; @endphp
                            <li>
                                <a href="{{ $item['url'] }}" @click="sidebar = false"
                                   @class([
                                       'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy',
                                       'bg-navy text-white' => $isAktif,
                                       'text-slate-600 hover:bg-slate-50 hover:text-slate-900' => ! $isAktif,
                                   ])
                                   @if ($isAktif) aria-current="page" @endif>
                                    <span @class(['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', 'bg-white/15 text-white' => $isAktif, $item['warna'] => ! $isAktif])>
                                        <x-bank-mini.icon :name="$item['ikon']" class="h-[18px] w-[18px]" />
                                    </span>
                                    {{ $item['label'] }}
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endforeach

            <div>
                <p class="px-3 pb-2 text-[11px] font-semibold tracking-wide text-slate-400">AKUN</p>
                <ul class="space-y-1">
                    @if ($area === 'siswa' || $area === 'walas' || auth('web')->user()?->role === 'petugas_bank_mini')
                        <li>
                            <button type="button" @click="sidebar = false; $dispatch('buka-password')"
                                    class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
                                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600"><x-bank-mini.icon name="key" class="h-[18px] w-[18px]" /></span>
                                Ganti Password
                            </button>
                        </li>
                    @endif
                    <li>
                        <form method="POST" action="{{ $logout }}">
                            @csrf
                            <button type="submit" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
                                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600"><x-bank-mini.icon name="logout" class="h-[18px] w-[18px]" /></span>
                                Keluar
                            </button>
                        </form>
                    </li>
                </ul>
            </div>
        </nav>

        <p class="border-t border-garis px-5 py-4 text-xs text-slate-400">Iuran {{ BankMiniFormat::rupiah(config('bank_mini.nominal_spp') + config('bank_mini.nominal_tabungan')) }}/bulan = SPP {{ BankMiniFormat::rupiah(config('bank_mini.nominal_spp')) }} + Tabungan {{ BankMiniFormat::rupiah(config('bank_mini.nominal_tabungan')) }}</p>
    </aside>

    <div class="lg:pl-72">
        {{-- Navbar atas --}}
        <header class="no-print sticky top-0 z-20 border-b border-garis bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div class="flex h-16 items-center gap-3 px-4 sm:px-6">
                <button type="button" class="-ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy lg:hidden" @click="sidebar = true" aria-label="Buka menu">
                    <x-bank-mini.icon name="menu" />
                </button>

                <label class="relative hidden max-w-sm flex-1 md:block">
                    <span class="sr-only">Cari di halaman ini</span>
                    <x-bank-mini.icon name="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="search" x-model="$store.cari.q" placeholder="{{ $area === 'siswa' ? 'Cari bulan / transaksi...' : 'Cari siswa / transaksi...' }}"
                           class="h-10 w-full rounded-xl border border-garis bg-kanvas pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy/15">
                </label>

                <div class="ml-auto flex items-center gap-2 sm:gap-3">
                    <div class="hidden items-center gap-2 rounded-xl border border-garis bg-white px-3 py-2 text-sm font-semibold text-slate-700 sm:flex"
                         x-data="{ jam: '' }"
                         x-init="const f = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' }); const t = () => jam = f.format(new Date()).replaceAll('.', ':'); t(); setInterval(t, 1000)">
                        <x-bank-mini.icon name="clock" class="h-4 w-4 text-slate-400" />
                        <span x-text="jam" class="tabular-nums">--:--:--</span>
                        <span class="text-xs font-medium text-slate-400">WIB</span>
                    </div>

                    @if (count($pilihanTahun) > 0)
                        <div class="relative" x-data="{ buka: false }" @click.outside="buka = false">
                            <button type="button" @click="buka = !buka" :aria-expanded="buka" aria-haspopup="true"
                                    class="flex items-center gap-1.5 rounded-xl border border-navy-100 bg-navy-50 px-3 py-2 text-sm font-semibold text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
                                <x-bank-mini.icon name="calendar" class="h-4 w-4" />
                                <span><span class="hidden sm:inline">TA </span>{{ $tahunAktif }}</span>
                                <x-bank-mini.icon name="chevron-down" class="h-4 w-4" />
                            </button>
                            <div x-cloak x-show="buka" x-transition.origin.top.right class="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-garis bg-white py-1 shadow-lg" role="menu">
                                <p class="px-3 py-1.5 text-[11px] font-semibold tracking-wide text-slate-400">TAHUN AJARAN</p>
                                @foreach ($pilihanTahun as $opsi)
                                    <a href="{{ request()->fullUrlWithQuery(['tahun' => $opsi, 'page' => null]) }}" role="menuitem"
                                       @class(['flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50', 'font-semibold text-navy' => $opsi === $tahunAktif, 'text-slate-600' => $opsi !== $tahunAktif])>
                                        {{ $opsi }}
                                        @if ($opsi === $tahunAktif)<x-bank-mini.icon name="check-circle" class="h-4 w-4" />@endif
                                    </a>
                                @endforeach
                            </div>
                        </div>
                    @else
                        <span class="hidden items-center gap-1.5 rounded-xl border border-navy-100 bg-navy-50 px-3 py-2 text-sm font-semibold text-navy sm:flex">
                            <x-bank-mini.icon name="calendar" class="h-4 w-4" /> TA {{ $tahunAktif }}
                        </span>
                    @endif

                    @include('bank-mini.partials.pengingat-sholat')

                    @if ($area === 'admin')
                        @include('bank-mini.partials.lonceng-notifikasi')
                    @endif

                    <div class="flex items-center gap-2.5 rounded-xl border border-garis bg-white py-1.5 pl-1.5 pr-3">
                        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white" aria-hidden="true">{{ $inisial }}</span>
                        <span class="hidden min-w-0 leading-tight sm:block">
                            <span class="block max-w-[11rem] truncate text-sm font-semibold text-slate-800">{{ $namaProfil }}</span>
                            <span class="block max-w-[11rem] truncate text-xs text-slate-500">{{ $subProfil }}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="border-t border-garis px-4 py-2 md:hidden">
                <label class="relative block">
                    <span class="sr-only">Cari di halaman ini</span>
                    <x-bank-mini.icon name="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="search" x-model="$store.cari.q" placeholder="{{ $area === 'siswa' ? 'Cari bulan / transaksi...' : 'Cari siswa / transaksi...' }}"
                           class="h-10 w-full rounded-xl border border-garis bg-kanvas pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy/15">
                </label>
            </div>
        </header>

        <main id="konten" class="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6 lg:pt-8">
            <nav class="no-print mb-3 flex items-center gap-1.5 text-sm text-slate-500" aria-label="Breadcrumb">
                <a href="{{ $beranda }}" class="rounded p-0.5 hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-navy" aria-label="Beranda">
                    <x-bank-mini.icon name="home" class="h-4 w-4" />
                </a>
                <x-bank-mini.icon name="chevron-right" class="h-3.5 w-3.5 text-slate-300" />
                <span class="font-medium text-slate-700">{{ $judul ?? '' }}</span>
            </nav>
            <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">{{ $judul ?? '' }}</h1>
                    <p class="mt-1 text-sm text-slate-500">{{ BankMiniFormat::hariIni() }}</p>
                </div>
                @yield('aksi-header')
            </div>

            @if ($area === 'admin' && $aktif !== 'layanan' && app(\App\Services\BankMini\StatusLayananService::class)->baca()['tutup'])
                <p class="no-print mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    <x-bank-mini.icon name="alert" class="h-4 w-4 shrink-0" />
                    Portal siswa sedang ditutup. Siswa tidak bisa masuk atau membayar online.
                    <a href="{{ route('bank-mini.admin.layanan') }}" class="font-semibold underline">Buka layanan</a>
                </p>
            @endif

            @yield('konten')
        </main>
    </div>

    {{-- Toast --}}
    <div class="no-print pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4 sm:justify-end sm:px-6" aria-live="polite">
        <div x-cloak x-show="$store.toast.tampil" x-transition
             class="pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg"
             :class="$store.toast.jenis === 'gagal' ? 'border-rose-200' : 'border-emerald-200'">
            <span :class="$store.toast.jenis === 'gagal' ? 'text-rose-600' : 'text-emerald-600'">
                <template x-if="$store.toast.jenis === 'gagal'"><x-bank-mini.icon name="alert" /></template>
                <template x-if="$store.toast.jenis !== 'gagal'"><x-bank-mini.icon name="check-circle" /></template>
            </span>
            <p class="text-slate-700" x-text="$store.toast.pesan"></p>
            <button type="button" class="-mr-1 ml-1 rounded p-0.5 text-slate-400 hover:text-slate-600" @click="$store.toast.tampil = false" aria-label="Tutup notifikasi">
                <x-bank-mini.icon name="close" class="h-4 w-4" />
            </button>
        </div>
    </div>

    @if ($area === 'siswa')
        @include('bank-mini.partials.modal-password', ['urlPassword' => route('bank-mini.password'), 'catatanPassword' => 'Minimal 8 karakter dan jangan mudah ditebak orang lain.'])
    @elseif ($area === 'walas')
        @include('bank-mini.partials.modal-password', ['urlPassword' => route('bank-mini.walas.password'), 'catatanPassword' => 'Minimal 8 karakter. Jangan dibagikan ke siswa.'])
    @elseif (auth('web')->user()?->role === 'petugas_bank_mini')
        @include('bank-mini.partials.modal-password', ['urlPassword' => route('bank-mini.admin.password'), 'catatanPassword' => 'Minimal 8 karakter. Password ini dipakai semua petugas loket.'])
    @endif

    @stack('scripts')
</body>
</html>
