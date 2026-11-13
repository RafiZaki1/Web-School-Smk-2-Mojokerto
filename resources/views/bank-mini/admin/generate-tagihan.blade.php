@php use App\Helpers\BankMiniFormat as F; @endphp
@extends('bank-mini.layouts.app', ['area' => 'admin', 'judul' => 'Generate Tagihan', 'aktif' => 'tagihan'])

@section('konten')
    <div class="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section class="rounded-2xl border border-garis bg-white p-5 sm:p-6" aria-labelledby="judul-form"
                 x-data="generateTagihan(@js(route('bank-mini.admin.tagihan.generate')), @js($tahun))">
            <h2 id="judul-form" class="text-base font-bold text-slate-900">Buat tagihan Juli sampai Juni</h2>
            <p class="mt-1 text-sm text-slate-500">Setiap siswa aktif mendapat 12 tagihan bulanan. Bulan yang sudah pernah dibuat dilewati, jadi aman dijalankan ulang setelah ada siswa baru.</p>

            <form class="mt-6 space-y-4" @submit.prevent="kirim()">
                <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label for="tahun_ajaran" class="mb-1.5 block text-sm font-medium text-slate-700">Tahun ajaran</label>
                        <select id="tahun_ajaran" x-model="form.tahun_ajaran" class="h-11 w-full rounded-lg border border-garis bg-white px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
                            @foreach ($opsiTahun as $opsi)
                                <option value="{{ $opsi }}">{{ $opsi }}</option>
                            @endforeach
                        </select>
                        <p class="mt-1 text-xs text-rose-600" x-show="errors.tahun_ajaran" x-text="errors.tahun_ajaran?.[0]"></p>
                    </div>
                    <div>
                        <label for="kelas" class="mb-1.5 block text-sm font-medium text-slate-700">Kelas</label>
                        <select id="kelas" x-model="form.kelas" class="h-11 w-full rounded-lg border border-garis bg-white px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
                            <option value="">Semua kelas ({{ $jumlahSiswa }} siswa aktif)</option>
                            @foreach ($daftarKelas as $k)
                                <option value="{{ $k }}">{{ $k }}</option>
                            @endforeach
                        </select>
                        <p class="mt-1 text-xs text-rose-600" x-show="errors.kelas" x-text="errors.kelas?.[0]"></p>
                    </div>
                </div>

                <p x-show="pesan" x-text="pesan" class="rounded-lg px-3 py-2 text-sm" :class="berhasil ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'" role="status"></p>

                <div class="flex flex-col gap-2 sm:flex-row">
                    <button type="submit" :disabled="proses" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-navy px-5 text-sm font-bold text-white hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
                        <x-bank-mini.icon name="file-plus" class="h-4 w-4" /><span x-text="proses ? 'Membuat tagihan...' : 'Buat tagihan'"></span>
                    </button>
                    <a x-show="berhasil" x-cloak :href="@js(route('bank-mini.admin.monitoring')) + '?tahun=' + encodeURIComponent(form.tahun_ajaran) + (form.kelas ? '&kelas=' + encodeURIComponent(form.kelas) : '')"
                       class="inline-flex h-11 items-center justify-center rounded-xl border border-garis px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Lihat monitoring</a>
                </div>
            </form>
        </section>

        <aside class="h-fit rounded-2xl border border-garis bg-white p-5" aria-labelledby="judul-aturan">
            <h2 id="judul-aturan" class="text-sm font-bold text-slate-900">Aturan tagihan</h2>
            <dl class="mt-3 space-y-3 text-sm">
                <div><dt class="text-xs text-slate-500">Iuran per bulan</dt><dd class="font-semibold text-slate-900">{{ F::rupiah(config('bank_mini.nominal_spp') + config('bank_mini.nominal_tabungan')) }}</dd></div>
                <div><dt class="text-xs text-slate-500">Dibagi menjadi</dt><dd class="text-slate-700">SPP {{ F::rupiah(config('bank_mini.nominal_spp')) }} + tabungan {{ F::rupiah(config('bank_mini.nominal_tabungan')) }}</dd></div>
                <div><dt class="text-xs text-slate-500">Jatuh tempo</dt><dd class="text-slate-700">Tanggal {{ min((int) config('bank_mini.tanggal_jatuh_tempo'), 28) }} setiap bulan</dd></div>
                <div><dt class="text-xs text-slate-500">Siswa</dt><dd class="text-slate-700">Disalin dari data kelulusan TU lewat <code class="rounded bg-slate-100 px-1 text-xs">bank-mini:sync-siswa</code></dd></div>
            </dl>
            <p class="mt-4 text-xs text-slate-500">Nominal diatur di .env (BANK_MINI_NOMINAL_SPP, BANK_MINI_NOMINAL_TABUNGAN). Tagihan yang sudah dibuat tidak ikut berubah.</p>
        </aside>
    </div>
@endsection

@push('scripts')
    <script>
        function generateTagihan(url, tahun) {
            return {
                form: { tahun_ajaran: tahun, kelas: '' },
                errors: {},
                pesan: '',
                berhasil: false,
                proses: false,
                async kirim() {
                    this.proses = true;
                    this.errors = {};
                    this.pesan = '';
                    try {
                        const res = await bankMini.kirim(url, { tahun_ajaran: this.form.tahun_ajaran, kelas: this.form.kelas || null });
                        this.berhasil = true;
                        this.pesan = res.meta.message;
                    } catch (e) {
                        this.berhasil = false;
                        this.errors = e.errors || {};
                        this.pesan = Object.keys(this.errors).length ? '' : e.message;
                    } finally {
                        this.proses = false;
                    }
                },
            };
        }
    </script>
@endpush
