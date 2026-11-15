@php
    use App\Enums\BankMini\AksiVerifikasiEnum as Aksi;
    use App\Enums\BankMini\MetodeBayarEnum;
    use App\Enums\BankMini\StatusTransaksiEnum as S;
    use App\Helpers\BankMiniFormat as F;

    $bolehSetujui = Aksi::SETUJUI->statusAsal($admin);
    $bolehBatal = Aksi::BATALKAN->statusAsal($admin);
    $bisaCek = [S::PENDING, S::EXPIRED, S::FAILED, S::CANCELED];
    $tab = ['' => ['Semua', array_sum($jumlah)]];
    foreach (S::cases() as $s) {
        $tab[$s->value] = [$s->label(), $jumlah[$s->value] ?? 0];
    }
@endphp
@extends('bank-mini.layouts.app', ['area' => 'admin', 'judul' => 'Pembayaran Masuk', 'aktif' => 'pembayaran'])

@section('konten')
    <div x-data="kendaliPembayaran()">
        <p class="mb-4 max-w-3xl text-sm text-slate-600">
            Pembayaran online siswa tercatat lunas otomatis begitu diterima Tripay. Halaman ini mencatat semua transaksi.
            {{ $admin ? 'Sebagai admin kamu bisa menyetujui manual, membatalkan transaksi, dan mencabut pelunasan.' : 'Setujui manual hanya bila uangnya sudah diterima tetapi statusnya belum berubah.' }}
        </p>

        <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <nav class="flex flex-wrap gap-1 rounded-xl border border-garis bg-white p-1 text-sm font-semibold" aria-label="Saring status transaksi">
                @foreach ($tab as $nilai => [$label, $n])
                    @php $aktifTab = ($status ?? '') === $nilai; @endphp
                    <a href="{{ route('bank-mini.admin.pembayaran', array_filter(['status' => $nilai ?: null, 'q' => $cari])) }}" @if ($aktifTab) aria-current="true" @endif
                       @class(['rounded-lg px-3 py-1.5', 'bg-navy text-white' => $aktifTab, 'text-slate-600 hover:bg-slate-50' => ! $aktifTab])>
                        {{ $label }} <span @class(['ml-1 text-xs', 'text-white/80' => $aktifTab, 'text-slate-400' => ! $aktifTab])>{{ $n }}</span>
                    </a>
                @endforeach
            </nav>
            <form method="GET" class="flex gap-2">
                @if ($status)<input type="hidden" name="status" value="{{ $status }}">@endif
                <label class="sr-only" for="cari-transaksi">Cari siswa atau nomor transaksi</label>
                <input id="cari-transaksi" type="search" name="q" value="{{ $cari }}" maxlength="64" placeholder="Nama, NISN, kelas, no. transaksi"
                       class="h-10 w-full rounded-lg border border-garis bg-white px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15 lg:w-72">
                <button type="submit" class="h-10 rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-600">Cari</button>
            </form>
        </div>

        <section class="rounded-2xl border border-garis bg-white" aria-label="Daftar transaksi">
            @if ($transaksi->isEmpty())
                <p class="px-5 py-12 text-center text-sm text-slate-500">
                    {{ $cari || $status ? 'Tidak ada transaksi yang cocok dengan saringan ini.' : 'Belum ada transaksi. Pembayaran siswa akan muncul di sini.' }}
                </p>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[920px] text-sm">
                        <caption class="sr-only">Transaksi pembayaran SPP, terbaru di atas</caption>
                        <thead>
                            <tr class="border-b border-garis bg-kanvas text-left text-xs font-semibold text-slate-500">
                                <th scope="col" class="px-5 py-2.5">Waktu</th>
                                <th scope="col" class="px-3 py-2.5">Siswa</th>
                                <th scope="col" class="px-3 py-2.5">Bulan</th>
                                <th scope="col" class="px-3 py-2.5">Metode</th>
                                <th scope="col" class="px-3 py-2.5 text-right">Total</th>
                                <th scope="col" class="px-3 py-2.5">Status</th>
                                <th scope="col" class="px-5 py-2.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-garis">
                            @foreach ($transaksi as $trx)
                                @php
                                    $gateway = $trx->metode === MetodeBayarEnum::GATEWAY;
                                    $info = ['order' => $trx->order_id, 'siswa' => $trx->siswa?->nama, 'bulan' => $trx->ringkasanBulan(), 'total' => F::rupiah($trx->total_nominal)];
                                @endphp
                                <tr x-show="$store.cari.cocok(@js($trx->order_id.' '.$trx->siswa?->nama.' '.$trx->siswa?->nisn.' '.$trx->siswa?->kelas))" class="align-top">
                                    <td class="whitespace-nowrap px-5 py-3 text-slate-600">{{ F::tanggal($trx->paid_at ?? $trx->created_at, true) }}</td>
                                    <td class="px-3 py-3">
                                        <span class="block font-semibold text-slate-900">{{ $trx->siswa?->nama }}</span>
                                        <span class="text-xs text-slate-500">{{ $trx->siswa?->kelas }} · {{ $trx->order_id }}</span>
                                        @if ($trx->email_invoice)<span class="block text-xs text-slate-400">{{ $trx->email_invoice }}</span>@endif
                                    </td>
                                    <td class="px-3 py-3 text-slate-600">{{ $trx->ringkasanBulan() }}</td>
                                    <td class="px-3 py-3 text-slate-600">
                                        {{ $gateway ? ($trx->channel_nama ?? 'Gateway') : 'Tunai' }}
                                        @if ($trx->petugas)<span class="block text-xs text-slate-400">{{ $trx->petugas->name }}</span>@endif
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-3 text-right font-semibold text-slate-900">{{ F::rupiah($trx->total_nominal) }}</td>
                                    <td class="px-3 py-3">
                                        <x-bank-mini.status-pill :status="$trx->status->value" />
                                        @if ($trx->diverifikasi_at)
                                            <span class="mt-1 block max-w-[14rem] text-xs text-slate-500">
                                                {{ $trx->verifikator?->name ?? 'Petugas' }}, {{ F::tanggal($trx->diverifikasi_at, true) }}{{ $trx->catatan_verifikasi ? ': '.$trx->catatan_verifikasi : '' }}
                                            </span>
                                        @endif
                                    </td>
                                    <td class="px-5 py-3">
                                        <div class="flex flex-wrap justify-end gap-1.5">
                                            @if ($gateway && $trx->reference && in_array($trx->status, $bisaCek, true))
                                                <button type="button" :disabled="proses" @click="cek(@js(route('bank-mini.admin.pembayaran.cek-status', $trx->order_id)))"
                                                        class="rounded-lg border border-garis px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cek Tripay</button>
                                            @endif
                                            @if (in_array($trx->status, $bolehSetujui, true))
                                                <button type="button" @click="buka('setujui', @js(route('bank-mini.admin.pembayaran.setujui', $trx->order_id)), @js($info))"
                                                        class="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Setujui manual</button>
                                            @endif
                                            @if (in_array($trx->status, $bolehBatal, true))
                                                <button type="button" @click="buka(@js($trx->isSettlement() ? 'cabut' : 'batalkan'), @js(route('bank-mini.admin.pembayaran.batalkan', $trx->order_id)), @js($info))"
                                                        class="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">{{ $trx->isSettlement() ? 'Cabut pelunasan' : 'Batalkan' }}</button>
                                            @endif
                                            @if ($trx->isSettlement())
                                                <a href="{{ route('bank-mini.admin.kwitansi', $trx->order_id) }}" class="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-navy hover:underline">Kwitansi</a>
                                                <button type="button" @click="bankMini.unduhKwitansi(@js(route('bank-mini.admin.kwitansi', $trx->order_id)))" class="rounded-lg border border-garis px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Unduh PDF</button>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                @if ($transaksi->hasPages())
                    <div class="flex items-center justify-between border-t border-garis px-5 py-3 text-sm">
                        <span class="text-slate-500">Halaman {{ $transaksi->currentPage() }} dari {{ $transaksi->lastPage() }} · {{ $transaksi->total() }} transaksi</span>
                        <span class="flex gap-2">
                            @if ($transaksi->previousPageUrl())<a href="{{ $transaksi->previousPageUrl() }}" class="rounded-lg border border-garis px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50">Sebelumnya</a>@endif
                            @if ($transaksi->nextPageUrl())<a href="{{ $transaksi->nextPageUrl() }}" class="rounded-lg border border-garis px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50">Berikutnya</a>@endif
                        </span>
                    </div>
                @endif
            @endif
        </section>

        {{-- Modal konfirmasi kendali manual --}}
        <div x-cloak x-show="aksi" @keydown.escape.window="tutup()" class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="judul-kendali">
            <div class="absolute inset-0 bg-slate-900/50" x-show="aksi" x-transition.opacity @click="tutup()"></div>
            <form x-show="aksi" x-transition @submit.prevent="kirim()" class="relative w-full max-w-md rounded-t-2xl border border-garis bg-white p-6 sm:rounded-2xl">
                <h2 id="judul-kendali" class="text-lg font-bold text-slate-900" x-text="teks.judul"></h2>
                <p class="mt-1 text-sm text-slate-600"><span class="font-semibold text-slate-800" x-text="info.siswa"></span> · <span x-text="info.bulan"></span> · <span x-text="info.total"></span></p>
                <p class="mt-3 rounded-lg px-3 py-2 text-sm" :class="aksi === 'setujui' ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-800'" x-text="teks.akibat"></p>

                <label for="catatan-kendali" class="mt-4 block text-sm font-semibold text-slate-800" x-text="teks.label"></label>
                <textarea id="catatan-kendali" x-ref="catatan" x-model.trim="catatan" rows="3" maxlength="255" required minlength="5"
                          class="mt-1.5 w-full rounded-lg border border-garis px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"></textarea>
                <p x-show="pesan" x-text="pesan" class="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert"></p>

                <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button type="button" @click="tutup()" class="h-11 rounded-xl border border-garis px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Kembali</button>
                    <button type="submit" :disabled="catatan.length < 5 || proses"
                            class="h-11 rounded-xl px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                            :class="aksi === 'setujui' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'"
                            x-text="proses ? 'Menyimpan...' : teks.tombol"></button>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        function kendaliPembayaran() {
            const TEKS = {
                setujui: { judul: 'Setujui pembayaran manual', akibat: 'Bulan pada transaksi ini langsung tercatat lunas dan invoice dikirim ke email siswa. Pastikan uangnya memang sudah diterima.', label: 'Bukti atau dasar persetujuan', tombol: 'Setujui, tandai lunas' },
                batalkan: { judul: 'Batalkan transaksi', akibat: 'Transaksi dibatalkan dan bulannya bisa dibayar lagi oleh siswa.', label: 'Alasan pembatalan', tombol: 'Batalkan transaksi' },
                cabut: { judul: 'Cabut pelunasan', akibat: 'Bulan pada transaksi ini kembali belum lunas dan transaksinya keluar dari laporan kas. Pengembalian uang diurus di luar sistem.', label: 'Alasan pencabutan', tombol: 'Cabut pelunasan' },
            };

            return {
                aksi: null, url: '', info: {}, catatan: '', pesan: '', proses: false,
                get teks() { return TEKS[this.aksi] || TEKS.setujui; },
                buka(aksi, url, info) {
                    Object.assign(this, { aksi, url, info, catatan: '', pesan: '' });
                    this.$nextTick(() => this.$refs.catatan.focus());
                },
                tutup() { if (!this.proses) this.aksi = null; },
                async kirim() {
                    this.proses = true;
                    this.pesan = '';
                    try {
                        await bankMini.kirim(this.url, { catatan: this.catatan });
                        window.location.reload();
                    } catch (e) {
                        this.pesan = bankMini.galatPertama(e.errors) || e.message;
                        this.proses = false;
                    }
                },
                async cek(url) {
                    this.proses = true;
                    try {
                        const res = await bankMini.kirim(url);
                        Alpine.store('toast').muncul(res.meta.message);
                        setTimeout(() => window.location.reload(), 900);
                    } catch (e) {
                        Alpine.store('toast').muncul(e.message, 'gagal');
                        this.proses = false;
                    }
                },
            };
        }
    </script>
@endpush
