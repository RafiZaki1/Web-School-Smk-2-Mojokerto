{{-- Modal kasir pembayaran tunai. State dari komponen kasir() di halaman monitoring. --}}
<div x-cloak x-show="siswa" @keydown.escape.window="tutup()" class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="judul-tunai">
    <div class="absolute inset-0 bg-slate-900/50" x-show="siswa" x-transition.opacity @click="tutup()"></div>
    <div x-show="siswa" x-transition class="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-2xl border border-garis bg-white sm:rounded-2xl">
        <div class="flex items-start justify-between gap-4 border-b border-garis px-6 py-4">
            <div class="min-w-0">
                <h2 id="judul-tunai" class="text-lg font-bold text-slate-900">Terima pembayaran tunai</h2>
                <p class="mt-0.5 truncate text-sm text-slate-500"><span x-text="siswa?.nama"></span> · <span x-text="siswa?.nisn"></span></p>
            </div>
            <button type="button" @click="tutup()" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Tutup"><x-bank-mini.icon name="close" /></button>
        </div>

        {{-- Hasil --}}
        <template x-if="hasil">
            <div class="px-6 py-8 text-center">
                <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white"><x-bank-mini.icon name="check-circle" /></span>
                <p class="mt-4 text-base font-bold text-slate-900" x-text="hasil.pesan"></p>
                <p class="mt-1 text-sm text-slate-500">Total diterima <span class="font-semibold text-slate-800" x-text="rp(hasil.total)"></span></p>
                <p class="mt-1 text-xs text-slate-500">Kwitansi PDF diunduh otomatis. Bila tidak muncul, tekan Unduh kwitansi.</p>
                <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <button type="button" @click="bankMini.unduhKwitansi(hasil.kwitansi)" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-navy px-5 text-sm font-bold text-white hover:bg-navy-600">
                        <x-bank-mini.icon name="printer" class="h-4 w-4" /> Unduh kwitansi
                    </button>
                    <a :href="hasil.kwitansi" target="_blank" rel="noopener" class="inline-flex h-11 items-center justify-center rounded-xl border border-garis px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Lihat / cetak</a>
                    <button type="button" @click="window.location.reload()" class="h-11 rounded-xl border border-garis px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Selesai</button>
                </div>
            </div>
        </template>

        <template x-if="!hasil">
            <div class="flex min-h-0 flex-1 flex-col">
                <div class="flex-1 overflow-y-auto px-6 py-4">
                    <div class="mb-3 flex items-center justify-between">
                        <p class="text-xs font-semibold text-slate-500">Bulan belum dibayar</p>
                        <button type="button" @click="pilihSemua()" class="text-xs font-semibold text-navy hover:underline">Pilih semua</button>
                    </div>
                    <ul class="space-y-2">
                        <template x-for="b in siswa?.bulan || []" :key="b.id">
                            <li>
                                <label class="flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5" :class="dipilih.includes(b.id) ? 'border-navy bg-navy-50/60' : 'border-garis hover:bg-slate-50'">
                                    <input type="checkbox" :value="b.id" x-model.number="dipilih" class="h-5 w-5 rounded border-slate-300 text-navy focus:ring-navy">
                                    <span class="flex-1 text-sm font-semibold text-slate-800" x-text="b.label"></span>
                                    <span x-show="b.menunggak" class="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">Menunggak</span>
                                    <span class="text-sm text-slate-600" x-text="rp(b.total)"></span>
                                </label>
                            </li>
                        </template>
                    </ul>
                    <p class="mt-3 text-xs text-slate-500">Bulan yang sedang menunggu pembayaran online tidak ditampilkan agar tidak tertagih dua kali.</p>
                </div>
                <div class="border-t border-garis px-6 py-4">
                    <dl class="mb-4 grid grid-cols-3 gap-3 text-sm">
                        <div><dt class="text-xs text-slate-500">SPP</dt><dd class="font-semibold text-slate-900" x-text="rp(totalSpp)"></dd></div>
                        <div><dt class="text-xs text-slate-500">Tabungan</dt><dd class="font-semibold text-emerald-700" x-text="rp(totalTabungan)"></dd></div>
                        <div><dt class="text-xs text-slate-500">Uang diterima</dt><dd class="text-base font-extrabold text-navy" x-text="rp(totalSpp + totalTabungan)"></dd></div>
                    </dl>
                    <p x-show="pesan" x-text="pesan" class="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert"></p>
                    <button type="button" @click="simpan()" :disabled="dipilih.length === 0 || proses"
                            class="flex h-12 w-full items-center justify-center rounded-xl bg-navy text-sm font-bold text-white hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300">
                        <span x-text="proses ? 'Menyimpan...' : (dipilih.length ? 'Catat pembayaran ' + dipilih.length + ' bulan' : 'Pilih bulan')"></span>
                    </button>
                </div>
            </div>
        </template>
    </div>
</div>

@push('scripts')
    <script>
        function kasir(data, url) {
            return {
                data,
                siswa: null,
                dipilih: [],
                proses: false,
                pesan: '',
                hasil: null,
                get terpilih() { return (this.siswa?.bulan || []).filter(b => this.dipilih.includes(b.id)); },
                get totalSpp() { return this.terpilih.reduce((a, b) => a + b.spp, 0); },
                get totalTabungan() { return this.terpilih.reduce((a, b) => a + b.tabungan, 0); },
                rp(n) { return bankMini.rupiah(n); },
                buka(id) {
                    this.siswa = this.data[id];
                    this.dipilih = this.siswa.bulan.filter(b => b.menunggak).map(b => b.id);
                    this.pesan = '';
                    this.hasil = null;
                },
                pilihSemua() { this.dipilih = (this.siswa?.bulan || []).map(b => b.id); },
                tutup() {
                    if (this.hasil) return window.location.reload();
                    this.siswa = null;
                },
                async simpan() {
                    this.proses = true;
                    this.pesan = '';
                    try {
                        const res = await bankMini.kirim(url, { siswa_id: this.siswa.id, tagihan_ids: this.dipilih });
                        this.hasil = { pesan: res.meta.message, total: res.data.total_bayar, kwitansi: res.data.kwitansi_url };
                        bankMini.unduhKwitansi(res.data.kwitansi_url);
                    } catch (e) {
                        this.pesan = bankMini.galatPertama(e.errors) || e.message;
                    } finally {
                        this.proses = false;
                    }
                },
            };
        }
    </script>
@endpush
