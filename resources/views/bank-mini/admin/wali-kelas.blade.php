@php
    $dataPenautan = collect($daftarKelas)->mapWithKeys(fn ($k) => [$k => $penautan->has($k) ? [
        'nama' => $penautan[$k]->user?->name,
        'username' => $penautan[$k]->user?->username,
        'teacher_id' => $penautan[$k]->teacher_id,
    ] : null]);
@endphp
@extends('bank-mini.layouts.app', ['area' => 'admin', 'judul' => 'Akun Wali Kelas', 'aktif' => 'wali-kelas'])

@section('konten')
    <div x-data="aturWalas(@js($dataPenautan), @js($guru), @js(route('bank-mini.admin.wali-kelas')))">
        <p class="-mt-3 mb-6 max-w-3xl text-sm text-slate-600">
            Setiap wali kelas mendapat akun sendiri untuk memantau pembayaran SPP kelasnya. Wali kelas masuk lewat
            <a href="{{ route('bank-mini.walas.login') }}" class="font-semibold text-navy hover:underline">{{ route('bank-mini.walas.login') }}</a>
            dan hanya bisa melihat data, tidak bisa mencatat pembayaran.
        </p>

        <section class="rounded-2xl border border-garis bg-white" aria-labelledby="judul-walas">
            <h2 id="judul-walas" class="border-b border-garis px-5 py-4 text-base font-bold text-slate-900">
                Wali kelas per kelas <span class="ml-1 text-sm font-medium text-slate-500">· {{ $penautan->count() }} dari {{ count($daftarKelas) }} kelas sudah diatur</span>
            </h2>
            <ul class="divide-y divide-garis">
                @foreach ($daftarKelas as $k)
                    @php $p = $penautan->get($k); @endphp
                    <li class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center" x-show="$store.cari.cocok(@js($k.' '.($p?->user?->name ?? '').' '.($p?->user?->username ?? '')))">
                        <span class="w-32 shrink-0 text-sm font-bold text-slate-900">{{ $k }}</span>
                        <span class="min-w-0 flex-1">
                            @if ($p)
                                <span class="block truncate text-sm font-semibold text-slate-800">{{ $p->user?->name }}</span>
                                <span class="text-xs text-slate-500">Username <span class="font-mono text-slate-700">{{ $p->user?->username }}</span>@if ($p->teacher) · tertaut ke data guru @endif</span>
                            @else
                                <span class="text-sm text-slate-400">Belum ada akun wali kelas</span>
                            @endif
                        </span>
                        <span class="flex gap-2">
                            <button type="button" @click="buka(@js($k))"
                                    @class(['inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold', 'border border-garis text-slate-700 hover:bg-slate-50' => $p, 'bg-navy text-white hover:bg-navy-600' => ! $p])>
                                {{ $p ? 'Ubah / reset password' : 'Buat akun' }}
                            </button>
                            @if ($p)
                                <button type="button" @click="hapus(@js($k))" class="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50">Hapus</button>
                            @endif
                        </span>
                    </li>
                @endforeach
            </ul>
        </section>

        {{-- Modal akun --}}
        <div x-cloak x-show="kelas" @keydown.escape.window="tutup()" class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="judul-akun">
            <div class="absolute inset-0 bg-slate-900/50" x-show="kelas" x-transition.opacity @click="tutup()"></div>
            <form x-show="kelas" x-transition @submit.prevent="simpan()" class="relative w-full max-w-lg rounded-t-2xl border border-garis bg-white sm:rounded-2xl">
                <div class="flex items-start justify-between gap-4 border-b border-garis px-6 py-4">
                    <div>
                        <h2 id="judul-akun" class="text-lg font-bold text-slate-900">Akun wali kelas <span x-text="kelas"></span></h2>
                        <p class="mt-0.5 text-sm text-slate-500" x-text="ada ? 'Kosongkan password bila tidak ingin menggantinya.' : 'Akun baru: isi semua kolom.'"></p>
                    </div>
                    <button type="button" @click="tutup()" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Tutup"><x-bank-mini.icon name="close" /></button>
                </div>

                <template x-if="hasil">
                    <div class="px-6 py-6">
                        <p class="text-sm font-semibold text-emerald-700" x-text="hasil.pesan"></p>
                        <div class="mt-4 rounded-xl border border-garis bg-kanvas p-4 text-sm" x-show="hasil.password">
                            <p class="text-xs text-slate-500">Berikan ke wali kelas (password tidak bisa dilihat lagi setelah ditutup):</p>
                            <dl class="mt-2 grid grid-cols-[6rem_1fr] gap-y-1">
                                <dt class="text-slate-500">Alamat</dt><dd class="break-all font-medium">{{ route('bank-mini.walas.login') }}</dd>
                                <dt class="text-slate-500">Username</dt><dd class="font-mono font-semibold" x-text="hasil.username"></dd>
                                <dt class="text-slate-500">Password</dt><dd class="font-mono font-semibold" x-text="hasil.password"></dd>
                            </dl>
                        </div>
                        <button type="button" @click="window.location.reload()" class="mt-5 h-11 w-full rounded-xl bg-navy text-sm font-bold text-white hover:bg-navy-600">Selesai</button>
                    </div>
                </template>

                <template x-if="!hasil">
                    <div>
                        <div class="space-y-4 px-6 py-5">
                            <div>
                                <label for="walas-guru" class="mb-1.5 block text-sm font-medium text-slate-700">Pilih dari data guru <span class="font-normal text-slate-400">(opsional)</span></label>
                                <select id="walas-guru" x-model.number="form.teacher_id" @change="isiDariGuru()" class="h-11 w-full rounded-lg border border-garis bg-white px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15">
                                    <option value="">Tidak ditautkan</option>
                                    <template x-for="g in guru" :key="g.id"><option :value="g.id" x-text="g.nama + (g.jabatan ? ' · ' + g.jabatan : '')"></option></template>
                                </select>
                            </div>
                            <template x-for="f in [{ k: 'nama', l: 'Nama wali kelas', t: 'text', a: 'off' }, { k: 'username', l: 'Username', t: 'text', a: 'off' }]" :key="f.k">
                                <div>
                                    <label :for="'walas-' + f.k" class="mb-1.5 block text-sm font-medium text-slate-700" x-text="f.l"></label>
                                    <input :id="'walas-' + f.k" :type="f.t" x-model="form[f.k]" :autocomplete="f.a" required
                                           class="h-11 w-full rounded-lg border bg-white px-3 text-sm focus:outline-none focus:ring-2"
                                           :class="errors[f.k] ? 'border-rose-300 focus:ring-rose-500/15' : 'border-garis focus:border-navy focus:ring-navy/15'">
                                    <p class="mt-1 text-xs text-rose-600" x-show="errors[f.k]" x-text="errors[f.k]?.[0]"></p>
                                </div>
                            </template>
                            <div>
                                <label for="walas-password" class="mb-1.5 block text-sm font-medium text-slate-700">Password <span class="font-normal text-slate-400" x-show="ada">(kosongkan bila tidak diganti)</span></label>
                                <div class="flex gap-2">
                                    <input id="walas-password" type="text" x-model="form.password" autocomplete="new-password" :required="!ada" minlength="8"
                                           class="h-11 w-full rounded-lg border bg-white px-3 font-mono text-sm focus:outline-none focus:ring-2"
                                           :class="errors.password ? 'border-rose-300 focus:ring-rose-500/15' : 'border-garis focus:border-navy focus:ring-navy/15'">
                                    <button type="button" @click="acak()" class="h-11 shrink-0 rounded-lg border border-garis px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Buat acak</button>
                                </div>
                                <p class="mt-1 text-xs text-rose-600" x-show="errors.password" x-text="errors.password?.[0]"></p>
                            </div>
                        </div>
                        <div class="border-t border-garis px-6 py-4">
                            <p x-show="pesan" x-text="pesan" class="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert"></p>
                            <button type="submit" :disabled="proses" class="flex h-12 w-full items-center justify-center rounded-xl bg-navy text-sm font-bold text-white hover:bg-navy-600 disabled:cursor-wait disabled:opacity-70">
                                <span x-text="proses ? 'Menyimpan...' : 'Simpan akun'"></span>
                            </button>
                        </div>
                    </div>
                </template>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        function aturWalas(penautan, guru, urlDasar) {
            return {
                penautan, guru,
                kelas: null, ada: false, proses: false, pesan: '', errors: {}, hasil: null,
                form: { teacher_id: null, nama: '', username: '', password: '' },
                url(k) { return urlDasar + '/' + encodeURIComponent(k); },
                buka(k) {
                    const p = this.penautan[k];
                    this.kelas = k;
                    this.ada = !!p;
                    this.form = { teacher_id: p?.teacher_id ?? "", nama: p?.nama ?? '', username: p?.username ?? '', password: '' };
                    this.errors = {}; this.pesan = ''; this.hasil = null;
                },
                tutup() { if (this.hasil) return window.location.reload(); this.kelas = null; },
                isiDariGuru() {
                    const g = this.guru.find(x => x.id === this.form.teacher_id);
                    if (!g) return;
                    this.form.nama = g.nama;
                    if (!this.ada || !this.form.username) {
                        this.form.username = 'walas-' + this.kelas.toLowerCase().replace(/^xii\s+/, '').replace(/\s+/g, '');
                    }
                },
                acak() {
                    const huruf = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
                    const buf = new Uint32Array(10);
                    crypto.getRandomValues(buf);
                    this.form.password = Array.from(buf, n => huruf[n % huruf.length]).join('');
                },
                async simpan() {
                    this.proses = true; this.pesan = ''; this.errors = {};
                    try {
                        const res = await bankMini.kirim(this.url(this.kelas), { ...this.form, teacher_id: this.form.teacher_id || null }, "PUT");
                        this.hasil = { pesan: res.meta.message, username: this.form.username.toLowerCase(), password: this.form.password };
                    } catch (e) {
                        this.errors = e.errors || {};
                        this.pesan = Object.keys(this.errors).length ? '' : e.message;
                    } finally {
                        this.proses = false;
                    }
                },
                async hapus(k) {
                    if (!confirm('Hapus akun wali kelas ' + k + '? Wali kelas tidak bisa login lagi sampai akun dibuat ulang.')) return;
                    try {
                        const res = await bankMini.kirim(this.url(k), {}, 'DELETE');
                        Alpine.store('toast').muncul(res.meta.message);
                        setTimeout(() => window.location.reload(), 800);
                    } catch (e) {
                        Alpine.store('toast').muncul(e.message, 'gagal');
                    }
                },
            };
        }
    </script>
@endpush
