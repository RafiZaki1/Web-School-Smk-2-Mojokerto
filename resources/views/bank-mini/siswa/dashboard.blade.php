@php
    use App\Helpers\BankMiniFormat as F;

    $label = [
        'lunas' => 'Lunas',
        'menunggak' => 'Menunggak',
        'pending' => 'Pending',
        'belum_jatuh_tempo' => 'Belum Jatuh Tempo',
    ];
    $dataTagihan = $tagihan->map(fn ($t) => [
        'id' => $t->id,
        'label' => $t->labelBulan(),
        'spp' => $t->nominal_spp,
        'tabungan' => $t->nominal_tabungan,
        'total' => $t->total(),
        'status' => $t->statusTampil(),
        'bisa' => $t->bisaDibayar(),
    ])->values();
    $dataChannel = $channels->map(fn ($items) => $items->values())->all();
    $adaYangBisaDibayar = $dataTagihan->contains('bisa', true);
@endphp
@extends('bank-mini.layouts.app', ['area' => 'siswa', 'judul' => 'Dasbor Keuangan', 'aktif' => 'dashboard', 'pakaiTahun' => true])

@section('konten')
    @if ($siswa->masihPasswordDefault())
        <div id="banner-password" class="mb-6 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 sm:flex-row sm:items-center">
            <x-bank-mini.icon name="key" class="hidden h-5 w-5 shrink-0 text-sky-600 sm:block" />
            <p class="flex-1">Kamu masih memakai password awal dari sekolah. Ganti dengan password pribadi supaya akunmu aman.</p>
            <button type="button" @click="$dispatch('buka-password')" class="h-9 shrink-0 rounded-lg bg-white px-3 text-sm font-semibold text-sky-800 ring-1 ring-inset ring-sky-200 hover:bg-sky-100">Ganti sekarang</button>
        </div>
    @endif

    {{-- Kartu ringkasan --}}
    <section aria-label="Ringkasan keuangan" class="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        @php
            $kartu = [
                ['ikon' => 'calendar', 'nilai' => $ringkasan['bulan_lunas'].' / '.max($ringkasan['bulan_total'], 12).' Bulan', 'label' => 'Bulan Lunas', 'sub' => 'TA '.$tahun,
                    'bg' => 'bg-blue-50/70 border-blue-100', 'badge' => 'bg-blue-600', 'teks' => 'text-blue-700'],
                ['ikon' => 'piggy', 'nilai' => F::rupiah($ringkasan['total_tabungan']), 'label' => 'Total Tabungan Terkumpul', 'sub' => 'Dari semua pembayaran lunas',
                    'bg' => 'bg-emerald-50/70 border-emerald-100', 'badge' => 'bg-emerald-600', 'teks' => 'text-emerald-700'],
                ['ikon' => 'alert', 'nilai' => F::rupiah($ringkasan['total_tunggakan']), 'label' => 'Total Tunggakan SPP', 'sub' => $ringkasan['bulan_menunggak'].' bulan lewat jatuh tempo',
                    'bg' => 'bg-rose-50/70 border-rose-100', 'badge' => 'bg-rose-600', 'teks' => 'text-rose-700'],
                ['ikon' => 'clock', 'nilai' => $ringkasan['transaksi_pending'].' Transaksi', 'label' => 'Tagihan Pending Gateway', 'sub' => 'Menunggu pembayaran',
                    'bg' => 'bg-amber-50/80 border-amber-100', 'badge' => 'bg-amber-500', 'teks' => 'text-amber-800'],
            ];
        @endphp
        @foreach ($kartu as $k)
            <div class="flex flex-col items-center rounded-2xl border {{ $k['bg'] }} px-3 py-5 text-center sm:px-4 sm:py-6">
                <span class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl {{ $k['badge'] }} text-white">
                    <x-bank-mini.icon :name="$k['ikon']" class="h-5 w-5" />
                </span>
                <p class="text-lg font-extrabold leading-tight text-slate-900 sm:text-2xl">{{ $k['nilai'] }}</p>
                <p class="mt-1 text-xs font-semibold sm:text-sm {{ $k['teks'] }}">{{ $k['label'] }}</p>
                <p class="mt-0.5 text-[11px] text-slate-500 sm:text-xs">{{ $k['sub'] }}</p>
            </div>
        @endforeach
    </section>

    {{-- Transaksi yang masih menunggu pembayaran --}}
    @if ($pending->isNotEmpty())
        <section class="mt-6 rounded-2xl border border-amber-200 bg-white" aria-labelledby="judul-pending">
            <div class="flex items-center gap-2 border-b border-amber-100 px-5 py-4">
                <x-bank-mini.icon name="clock" class="h-5 w-5 text-amber-600" />
                <h2 id="judul-pending" class="text-base font-bold text-slate-900">Menunggu pembayaran</h2>
            </div>
            <ul class="divide-y divide-garis">
                @foreach ($pending as $trx)
                    <li class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center" x-show="$store.cari.cocok(@js($trx->order_id.' '.$trx->ringkasanBulan().' '.$trx->channel_nama))">
                        <div class="min-w-0 flex-1">
                            <p class="text-sm font-semibold text-slate-900">{{ $trx->ringkasanBulan() }}</p>
                            <p class="mt-0.5 text-xs text-slate-500">
                                {{ $trx->channel_nama ?? 'Payment gateway' }} · {{ $trx->order_id }} · bayar sebelum {{ F::tanggal($trx->expires_at, true) }} WIB
                            </p>
                        </div>
                        <p class="text-base font-bold text-slate-900">{{ F::rupiah($trx->totalBayar()) }}</p>
                        <a href="{{ route('bank-mini.transaksi.show', $trx->order_id) }}" class="inline-flex h-10 items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2">
                            Lihat cara bayar
                        </a>
                    </li>
                @endforeach
            </ul>
        </section>
    @endif

    {{-- Tagihan 12 bulan + checkout --}}
    <section id="tagihan" class="mt-6 scroll-mt-24 rounded-2xl border border-garis bg-white" aria-labelledby="judul-tagihan"
             x-data="checkoutSpp(@js($dataTagihan), @js($dataChannel), @js(route('bank-mini.checkout')), @js($emailInvoice ?? ''))">
        <div class="flex flex-col gap-3 border-b border-garis px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 id="judul-tagihan" class="text-base font-bold text-slate-900">Tagihan SPP {{ $tahun }}</h2>
                <p class="mt-0.5 text-sm text-slate-500">{{ F::rupiah(config('bank_mini.nominal_spp') + config('bank_mini.nominal_tabungan')) }} per bulan, otomatis dibagi SPP {{ F::rupiah(config('bank_mini.nominal_spp')) }} dan tabungan {{ F::rupiah(config('bank_mini.nominal_tabungan')) }}.</p>
            </div>
            @if ($dataTagihan->contains('status', 'menunggak'))
                <button type="button" @click="pilihMenunggak()" class="h-9 shrink-0 self-start rounded-lg border border-rose-200 bg-rose-50 px-3 text-sm font-semibold text-rose-700 hover:bg-rose-100 sm:self-auto">
                    Pilih semua yang menunggak
                </button>
            @endif
        </div>

        @if ($tagihan->isEmpty())
            <div class="px-5 py-12 text-center">
                <x-bank-mini.icon name="calendar" class="mx-auto h-8 w-8 text-slate-300" />
                <p class="mt-3 text-sm font-semibold text-slate-700">Tagihan TA {{ $tahun }} belum dibuat</p>
                <p class="mt-1 text-sm text-slate-500">Petugas Bank Mini akan membuat tagihan 12 bulan. Pilih tahun ajaran lain di bagian atas untuk melihat riwayat.</p>
            </div>
        @else
            <div class="hidden grid-cols-[2.5rem_1.6fr_1fr_1fr_1fr_1fr_9rem] gap-3 border-b border-garis bg-kanvas px-5 py-2.5 text-xs font-semibold text-slate-500 md:grid">
                <span><span class="sr-only">Pilih</span></span><span>Bulan</span><span>Jatuh tempo</span><span class="text-right">SPP</span><span class="text-right">Tabungan</span><span class="text-right">Total</span><span class="text-right">Status</span>
            </div>
            <ul class="divide-y divide-garis">
                @foreach ($tagihan as $t)
                    @php $st = $t->statusTampil(); @endphp
                    <li x-show="$store.cari.cocok(@js($t->labelBulan().' '.$label[$st]))">
                        <label @class([
                            'grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 gap-y-1 px-5 py-3.5 md:grid-cols-[2.5rem_1.6fr_1fr_1fr_1fr_1fr_9rem]',
                            'cursor-pointer hover:bg-slate-50' => $t->bisaDibayar(),
                        ]) :class="dipilih.includes({{ $t->id }}) && 'bg-navy-50/60'">
                            <span class="row-span-2 flex md:row-span-1">
                                @if ($t->bisaDibayar())
                                    <input type="checkbox" value="{{ $t->id }}" x-model.number="dipilih" class="h-5 w-5 rounded border-slate-300 text-navy focus:ring-navy" aria-label="Pilih {{ $t->labelBulan() }}">
                                @elseif ($st === 'lunas')
                                    <x-bank-mini.icon name="check-circle" class="h-5 w-5 text-emerald-500" />
                                @else
                                    <x-bank-mini.icon name="clock" class="h-5 w-5 text-amber-500" />
                                @endif
                            </span>
                            <span class="text-sm font-semibold text-slate-900">{{ $t->labelBulan() }}
                                @if ($st === 'lunas' && $t->lunas_at)
                                    <span class="block text-xs font-normal text-slate-500">Dibayar {{ F::tanggal($t->lunas_at) }}</span>
                                @endif
                            </span>
                            <span class="text-right md:order-last"><x-bank-mini.status-pill :status="$st" /></span>
                            <span class="col-start-2 text-xs text-slate-500 md:col-start-auto md:text-sm">
                                <span class="md:hidden">Jatuh tempo </span>{{ F::tanggal($t->jatuh_tempo) }}
                            </span>
                            <span class="hidden text-right text-sm text-slate-600 md:block">{{ F::rupiah($t->nominal_spp) }}</span>
                            <span class="hidden text-right text-sm text-slate-600 md:block">{{ F::rupiah($t->nominal_tabungan) }}</span>
                            <span class="col-start-3 row-start-2 text-right text-sm font-semibold text-slate-900 md:col-start-auto md:row-start-auto">{{ F::rupiah($t->total()) }}</span>
                        </label>
                    </li>
                @endforeach
            </ul>

            {{-- Bilah ringkasan pilihan --}}
            @if ($adaYangBisaDibayar)
                <div class="sticky bottom-0 z-10 rounded-b-2xl border-t border-garis bg-white/95 px-5 py-4 backdrop-blur">
                    <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <dl class="grid flex-1 grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
                            <div><dt class="text-xs text-slate-500">Jumlah Bulan Dipilih</dt><dd class="font-bold text-slate-900" x-text="jumlah + ' bulan'">0 bulan</dd></div>
                            <div><dt class="text-xs text-slate-500">Porsi SPP</dt><dd class="font-bold text-slate-900" x-text="rp(totalSpp)">Rp 0</dd></div>
                            <div><dt class="text-xs text-slate-500">Porsi Tabungan</dt><dd class="font-bold text-emerald-700" x-text="rp(totalTabungan)">Rp 0</dd></div>
                            <div><dt class="text-xs text-slate-500">Total Bayar</dt><dd class="text-lg font-extrabold text-navy" x-text="rp(total)">Rp 0</dd></div>
                        </dl>
                        <div class="flex flex-col items-stretch gap-1.5 lg:items-end">
                            <button type="button" @click="bukaChannel()" :disabled="jumlah === 0"
                                    class="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-bold text-white hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300">
                                <x-bank-mini.icon name="wallet" class="h-5 w-5" />
                                Bayar
                            </button>
                            <p class="text-xs text-slate-500" x-show="jumlah === 0">Centang bulan yang ingin dibayar dulu.</p>
                        </div>
                    </div>
                </div>
            @endif
        @endif

        {{-- Modal pilih metode: payment gateway (channel Tripay) atau tunai di loket --}}
        <div x-cloak x-show="modal" @keydown.escape.window="modal = false" class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="judul-channel">
            <div class="absolute inset-0 bg-slate-900/50" x-show="modal" x-transition.opacity @click="modal = false"></div>
            <div x-show="modal" x-transition class="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-2xl border border-garis bg-white sm:rounded-2xl">
                <div class="flex items-start justify-between gap-4 border-b border-garis px-6 py-4">
                    <div>
                        <h2 id="judul-channel" class="text-lg font-bold text-slate-900">Pilih metode pembayaran</h2>
                        <p class="mt-0.5 text-sm text-slate-500"><span x-text="jumlah"></span> bulan · <span x-text="rp(total)"></span><span x-show="cara === 'gateway'"> + biaya admin channel</span></p>
                    </div>
                    <button type="button" @click="modal = false" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Tutup"><x-bank-mini.icon name="close" /></button>
                </div>
                <div class="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    <fieldset>
                        <legend class="sr-only">Cara bayar</legend>
                        <div class="grid gap-2 sm:grid-cols-2">
                            <label class="flex items-start gap-3 rounded-xl border px-3 py-3 transition-colors"
                                   :class="[cara === 'gateway' ? 'border-navy bg-navy-50/60 ring-1 ring-navy' : 'border-garis', gatewaySiap ? 'cursor-pointer hover:bg-slate-50' : 'cursor-not-allowed opacity-60']">
                                <input type="radio" name="cara" value="gateway" x-model="cara" :disabled="!gatewaySiap" class="sr-only">
                                <x-bank-mini.icon name="card" class="mt-0.5 h-5 w-5 shrink-0 text-navy" />
                                <span>
                                    <span class="block text-sm font-bold text-slate-900">Payment Gateway</span>
                                    <span class="mt-0.5 block text-xs text-slate-500" x-text="gatewaySiap ? 'Transfer bank, e-wallet, QRIS, atau minimarket' : 'Sedang tidak tersedia'"></span>
                                </span>
                            </label>
                            <label class="flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-colors"
                                   :class="cara === 'tunai' ? 'border-navy bg-navy-50/60 ring-1 ring-navy' : 'border-garis hover:bg-slate-50'">
                                <input type="radio" name="cara" value="tunai" x-model="cara" class="sr-only">
                                <x-bank-mini.icon name="cash" class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                <span>
                                    <span class="block text-sm font-bold text-slate-900">Tunai</span>
                                    <span class="mt-0.5 block text-xs text-slate-500">Bayar langsung di loket Bank Mini</span>
                                </span>
                            </label>
                        </div>
                    </fieldset>

                    <div x-show="cara === 'tunai'" class="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-4">
                        <p class="text-sm font-bold text-slate-900">Cara bayar tunai</p>
                        <ol class="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
                            <li>Datang ke loket Bank Mini di sekolah.</li>
                            <li>Sebutkan nama dan kelasmu, lalu bulan yang dibayar: <span class="font-semibold" x-text="terpilih.map(t => t.label).join(', ')"></span>.</li>
                            <li>Serahkan uang <span class="font-semibold" x-text="rp(total)"></span> ke petugas, tanpa biaya admin.</li>
                            <li>Petugas mencatat pembayaranmu dan bulan tersebut langsung lunas. Kwitansinya ada di menu Riwayat Transaksi.</li>
                        </ol>
                    </div>

                    <template x-for="(items, grup) in (cara === 'gateway' ? channels : {})" :key="grup">
                        <fieldset>
                            <legend class="mb-2 text-xs font-semibold text-slate-500" x-text="grup"></legend>
                            <div class="space-y-2">
                                <template x-for="ch in items" :key="ch.code">
                                    <label class="flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors"
                                           :class="metode === ch.code ? 'border-navy bg-navy-50/60 ring-1 ring-navy' : 'border-garis hover:bg-slate-50'">
                                        <input type="radio" name="metode" :value="ch.code" x-model="metode" class="sr-only">
                                        <span class="flex h-9 w-14 shrink-0 items-center justify-center rounded-md border border-garis bg-white p-1">
                                            <img :src="ch.icon_url" :alt="ch.name" class="max-h-6 max-w-full object-contain" loading="lazy" width="48" height="24" x-show="ch.icon_url">
                                        </span>
                                        <span class="flex-1 text-sm font-semibold text-slate-800" x-text="ch.name"></span>
                                        <span class="text-right text-xs text-slate-500">
                                            <span x-show="biaya(ch) > 0" x-text="'+ ' + rp(biaya(ch))"></span>
                                            <span x-show="biaya(ch) === 0">Tanpa biaya</span>
                                        </span>
                                    </label>
                                </template>
                            </div>
                        </fieldset>
                    </template>
                </div>
                <div class="border-t border-garis px-6 py-4" x-show="cara === 'tunai'">
                    <button type="button" @click="modal = false"
                            class="flex h-12 w-full items-center justify-center rounded-xl bg-navy text-sm font-bold text-white hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2">
                        Mengerti, bayar di loket
                    </button>
                </div>
                <div class="border-t border-garis px-6 py-4" x-show="cara === 'gateway'">
                    <label for="email-invoice" class="block text-sm font-semibold text-slate-800">Email untuk invoice</label>
                    <input id="email-invoice" type="email" x-model.trim="email" autocomplete="email" inputmode="email" maxlength="100" required
                           placeholder="nama@gmail.com" aria-describedby="catatan-email"
                           class="mt-1.5 h-11 w-full rounded-xl border border-garis bg-white px-3 text-sm placeholder:text-slate-400 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
                    <p id="catatan-email" class="mb-4 mt-1 text-xs text-slate-500">Instruksi bayar dan invoice lunas dikirim ke email ini. Boleh email orang tua.</p>
                    <div class="mb-3 flex items-center justify-between text-sm" x-show="metode">
                        <span class="text-slate-500">Perkiraan total dibayar</span>
                        <span class="text-base font-extrabold text-navy" x-text="rp(total + biaya(channelTerpilih()))"></span>
                    </div>
                    <p x-show="pesan" x-text="pesan" class="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert"></p>
                    <button type="button" @click="bayar()" :disabled="!metode || !emailValid || proses"
                            class="flex h-12 w-full items-center justify-center rounded-xl bg-navy text-sm font-bold text-white hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300">
                        <span x-text="proses ? 'Membuat kode bayar...' : 'Buat kode pembayaran'"></span>
                    </button>
                    <p class="mt-2 text-center text-xs text-slate-500">Biaya admin final mengikuti Tripay. Bulan yang dipilih dikunci sampai kode bayar kedaluwarsa ({{ config('bank_mini.gateway.expiry_hours') }} jam).</p>
                </div>
            </div>
        </div>
    </section>
@endsection

@push('scripts')
    <script>
        function checkoutSpp(tagihan, channels, urlCheckout, emailAwal) {
            return {
                tagihan,
                channels,
                email: emailAwal,
                get emailValid() { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email); },
                dipilih: [],
                modal: false,
                metode: '',
                proses: false,
                pesan: '',
                gatewaySiap: @js($gatewaySiap && $channels->isNotEmpty()),
                cara: @js($gatewaySiap && $channels->isNotEmpty() ? '' : 'tunai'),
                get terpilih() { return this.tagihan.filter(t => this.dipilih.includes(t.id)); },
                get jumlah() { return this.terpilih.length; },
                get totalSpp() { return this.terpilih.reduce((a, t) => a + t.spp, 0); },
                get totalTabungan() { return this.terpilih.reduce((a, t) => a + t.tabungan, 0); },
                get total() { return this.totalSpp + this.totalTabungan; },
                rp(n) { return bankMini.rupiah(n); },
                pilihMenunggak() {
                    this.dipilih = this.tagihan.filter(t => t.bisa && t.status === 'menunggak').map(t => t.id);
                },
                semuaChannel() { return Object.values(this.channels).flat(); },
                channelTerpilih() { return this.semuaChannel().find(c => c.code === this.metode) || null; },
                biaya(ch) {
                    if (!ch) return 0;
                    return Math.ceil((ch.fee_flat || 0) + (this.total * (ch.fee_percent || 0)) / 100);
                },
                bukaChannel() {
                    if (this.jumlah === 0) return;
                    this.pesan = '';
                    this.modal = true;
                },
                async bayar() {
                    this.proses = true;
                    this.pesan = '';
                    try {
                        const res = await bankMini.kirim(urlCheckout, { tagihan_ids: this.dipilih, metode_pembayaran: this.metode, email: this.email });
                        window.location.href = res.data.detail_url;
                    } catch (e) {
                        this.pesan = bankMini.galatPertama(e.errors) || e.message;
                        this.proses = false;
                    }
                },
            };
        }
    </script>
@endpush
