@php
    use App\Helpers\BankMiniFormat as F;
    use App\Enums\BankMini\StatusTransaksiEnum as S;

    $payload = $transaksi->gateway_payload ?? [];
    $qrUrl = $payload['qr_url'] ?? null;
    $lanjut = $transaksi->bisaDilanjutkan();
@endphp
@extends('bank-mini.layouts.app', ['area' => 'siswa', 'judul' => 'Detail Pembayaran', 'aktif' => 'riwayat'])

@section('aksi-header')
    <a href="{{ route('bank-mini.riwayat') }}" class="no-print inline-flex h-10 items-center gap-2 self-start rounded-lg border border-garis bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        <x-bank-mini.icon name="history" class="h-4 w-4" /> Riwayat transaksi
    </a>
@endsection

@section('konten')
    <div class="grid gap-6 lg:grid-cols-[1fr_22rem]"
         x-data="statusTransaksi(@js(route('bank-mini.transaksi.cek-status', $transaksi->order_id)), @js($transaksi->status->value), @js($transaksi->expires_at?->toIso8601String()))">
        <div class="space-y-6">
            {{-- Status --}}
            <section class="rounded-2xl border border-garis bg-white p-5 sm:p-6">
                <div class="flex flex-wrap items-center gap-3">
                    <x-bank-mini.status-pill :status="$transaksi->status->value" />
                    <span class="text-sm text-slate-500">{{ $transaksi->metode->label() }}{{ $transaksi->channel_nama ? ' · '.$transaksi->channel_nama : '' }}</span>
                </div>
                <p class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{{ F::rupiah($transaksi->totalBayar()) }}</p>
                <p class="mt-1 text-sm text-slate-500">No. transaksi <span class="font-semibold text-slate-700">{{ $transaksi->order_id }}</span>@if ($transaksi->reference) · Ref. Tripay {{ $transaksi->reference }}@endif</p>

                @if ($transaksi->status === S::SETTLEMENT)
                    <div class="mt-5 flex flex-col gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:flex-row sm:items-center">
                        <x-bank-mini.icon name="check-circle" class="h-5 w-5 shrink-0 text-emerald-600" />
                        <p class="flex-1">Pembayaran diterima {{ F::tanggal($transaksi->paid_at, true) }} WIB. Bulan yang dibayar sudah tercatat lunas.</p>
                        <a href="{{ route('bank-mini.kwitansi', $transaksi->order_id) }}" class="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-emerald-700 px-3 font-semibold text-white hover:bg-emerald-800">
                            <x-bank-mini.icon name="printer" class="h-4 w-4" /> Kwitansi
                        </a>
                    </div>
                @elseif ($transaksi->status === S::CANCELED)
                    <div class="mt-5 flex items-start gap-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                        <x-bank-mini.icon name="info" class="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                        <p>Transaksi ini dibatalkan petugas Bank Mini{{ $transaksi->catatan_verifikasi ? ': '.$transaksi->catatan_verifikasi : '' }}. Bulan tagihannya sudah dibuka lagi; hubungi Bank Mini bila kamu sudah telanjur membayar.</p>
                    </div>
                @elseif (in_array($transaksi->status, [S::EXPIRED, S::FAILED], true))
                    <div class="mt-5 flex items-start gap-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                        <x-bank-mini.icon name="info" class="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                        <p>Transaksi ini {{ mb_strtolower($transaksi->status->label()) }}. Bulan tagihannya sudah dibuka lagi; buat pembayaran baru dari <a href="{{ route('bank-mini.dashboard') }}#tagihan" class="font-semibold text-navy underline">Dasbor Keuangan</a>.</p>
                    </div>
                @elseif (! $lanjut)
                    <div class="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <x-bank-mini.icon name="clock" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        <p>Batas waktu pembayaran sudah lewat. Status akan diperbarui otomatis; tekan <strong>Cek status</strong> bila kamu sudah membayar.</p>
                    </div>
                @endif
            </section>

            {{-- Kode bayar --}}
            @if ($lanjut)
                <section class="rounded-2xl border border-navy-100 bg-white p-5 sm:p-6" aria-labelledby="judul-kode">
                    <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div class="flex-1">
                            <h2 id="judul-kode" class="text-sm font-semibold text-slate-500">{{ $qrUrl && ! $transaksi->pay_code ? 'Scan QR untuk membayar' : 'Kode pembayaran / nomor VA' }}</h2>
                            @if ($transaksi->pay_code)
                                <div class="mt-2 flex items-center gap-2" x-data="{ tersalin: false }">
                                    <p class="break-all font-mono text-2xl font-bold tracking-wider text-navy sm:text-3xl">{{ $transaksi->pay_code }}</p>
                                    <button type="button" @click="navigator.clipboard.writeText(@js($transaksi->pay_code)); tersalin = true; setTimeout(() => tersalin = false, 2000)"
                                            class="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-garis px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                        <x-bank-mini.icon name="copy" class="h-4 w-4" /><span x-text="tersalin ? 'Tersalin' : 'Salin'">Salin</span>
                                    </button>
                                </div>
                            @endif
                            <dl class="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt class="text-xs text-slate-500">Bayar sebelum</dt>
                                    <dd class="font-semibold text-slate-900">{{ F::tanggal($transaksi->expires_at, true) }} WIB</dd>
                                </div>
                                <div>
                                    <dt class="text-xs text-slate-500">Sisa waktu</dt>
                                    <dd class="font-semibold tabular-nums text-amber-700" x-text="sisa">-</dd>
                                </div>
                            </dl>
                        </div>
                        @if ($qrUrl)
                            <img src="{{ $qrUrl }}" alt="QR code pembayaran {{ $transaksi->channel_nama }}" width="176" height="176" class="h-44 w-44 self-center rounded-xl border border-garis bg-white p-2">
                        @endif
                    </div>
                    <div class="mt-5 flex flex-col gap-2 sm:flex-row">
                        @if ($transaksi->checkout_url)
                            <a href="{{ $transaksi->checkout_url }}" target="_blank" rel="noopener" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-navy px-5 text-sm font-bold text-white hover:bg-navy-600">
                                Buka halaman pembayaran <x-bank-mini.icon name="external" class="h-4 w-4" />
                            </a>
                        @endif
                        <button type="button" @click="cek(true)" :disabled="proses" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-garis px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                            <x-bank-mini.icon name="refresh" class="h-4 w-4" />
                            <span x-text="proses ? 'Memeriksa...' : 'Saya sudah bayar, cek status'"></span>
                        </button>
                    </div>
                    <p class="mt-3 text-xs text-slate-500">Status diperiksa otomatis setiap 30 detik selama halaman ini terbuka.</p>
                </section>
            @elseif ($transaksi->status === S::PENDING)
                <button type="button" @click="cek(true)" :disabled="proses" class="inline-flex h-11 items-center gap-2 rounded-xl border border-garis bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                    <x-bank-mini.icon name="refresh" class="h-4 w-4" /><span x-text="proses ? 'Memeriksa...' : 'Cek status'"></span>
                </button>
            @endif

            {{-- Instruksi --}}
            @if ($lanjut && count($transaksi->instruksi()) > 0)
                <section class="rounded-2xl border border-garis bg-white" aria-labelledby="judul-instruksi" x-data="{ buka: 0 }">
                    <h2 id="judul-instruksi" class="border-b border-garis px-5 py-4 text-base font-bold text-slate-900">Cara membayar</h2>
                    @foreach ($transaksi->instruksi() as $i => $ins)
                        <div class="border-b border-garis last:border-b-0">
                            <button type="button" @click="buka = buka === {{ $i }} ? null : {{ $i }}" :aria-expanded="buka === {{ $i }}"
                                    class="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50">
                                {{ $ins['title'] }}
                                <x-bank-mini.icon name="chevron-down" class="h-4 w-4 text-slate-400 transition-transform" ::class="buka === {{ $i }} && 'rotate-180'" />
                            </button>
                            <ol x-show="buka === {{ $i }}" class="list-decimal space-y-1.5 px-5 pb-4 pl-10 text-sm text-slate-600">
                                @foreach ($ins['steps'] as $langkah)
                                    <li>{!! strip_tags($langkah, '<b><strong><i><em>') !!}</li>
                                @endforeach
                            </ol>
                        </div>
                    @endforeach
                </section>
            @endif
        </div>

        {{-- Rincian --}}
        <aside class="h-fit rounded-2xl border border-garis bg-white p-5" aria-labelledby="judul-rincian">
            <h2 id="judul-rincian" class="text-base font-bold text-slate-900">Rincian</h2>
            <ul class="mt-3 space-y-2 text-sm">
                @foreach ($transaksi->tagihan as $t)
                    <li class="flex justify-between gap-3"><span class="text-slate-600">SPP {{ $t->labelBulan() }}</span><span class="font-medium text-slate-800">{{ F::rupiah($t->total()) }}</span></li>
                @endforeach
            </ul>
            <dl class="mt-4 space-y-2 border-t border-garis pt-4 text-sm">
                <div class="flex justify-between"><dt class="text-slate-500">Porsi SPP</dt><dd class="text-slate-800">{{ F::rupiah($transaksi->porsi_spp) }}</dd></div>
                <div class="flex justify-between"><dt class="text-slate-500">Porsi Tabungan</dt><dd class="text-emerald-700">{{ F::rupiah($transaksi->porsi_tabungan) }}</dd></div>
                <div class="flex justify-between"><dt class="text-slate-500">Biaya admin channel</dt><dd class="text-slate-800">{{ F::rupiah($transaksi->biaya_admin) }}</dd></div>
                <div class="flex justify-between border-t border-garis pt-2 text-base"><dt class="font-semibold text-slate-900">Total bayar</dt><dd class="font-extrabold text-navy">{{ F::rupiah($transaksi->totalBayar()) }}</dd></div>
            </dl>
            <p class="mt-4 text-xs text-slate-500">Dibuat {{ F::tanggal($transaksi->created_at, true) }} WIB</p>
        </aside>
    </div>
@endsection

@push('scripts')
    <script>
        function statusTransaksi(url, statusAwal, kedaluwarsa) {
            return {
                proses: false,
                sisa: '-',
                percobaan: 0,
                init() {
                    if (kedaluwarsa) {
                        const akhir = new Date(kedaluwarsa).getTime();
                        const hitung = () => {
                            const d = Math.max(0, akhir - Date.now());
                            const j = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000), s = Math.floor((d % 60000) / 1000);
                            this.sisa = d === 0 ? 'Habis' : `${j} jam ${String(m).padStart(2, '0')} mnt ${String(s).padStart(2, '0')} dtk`;
                        };
                        hitung();
                        setInterval(hitung, 1000);
                    }
                    if (statusAwal === 'pending') {
                        const t = setInterval(() => {
                            if (document.visibilityState !== 'visible') return;
                            if (++this.percobaan > 30) return clearInterval(t);
                            this.cek(false);
                        }, 30000);
                    }
                },
                async cek(manual) {
                    if (this.proses) return;
                    this.proses = true;
                    try {
                        const res = await bankMini.kirim(url, {});
                        if (res.data.status !== statusAwal) {
                            window.location.reload();
                            return;
                        }
                        if (manual) Alpine.store('toast').muncul('Belum ada pembayaran yang masuk. Jika sudah membayar, tunggu 1-2 menit lalu cek lagi.');
                    } catch (e) {
                        if (manual) Alpine.store('toast').muncul(e.message, 'gagal');
                    } finally {
                        this.proses = false;
                    }
                },
            };
        }
    </script>
@endpush
