@php use App\Helpers\BankMiniFormat as F; @endphp
@extends('bank-mini.layouts.app', ['area' => 'admin', 'judul' => 'Buka / Tutup Layanan', 'aktif' => 'layanan'])

@section('konten')
    <div class="grid gap-6 lg:grid-cols-[1fr_20rem]" x-data="statusLayanan(@js(route('bank-mini.admin.layanan.simpan')), @js($status))">
        <section class="rounded-2xl border border-garis bg-white p-5 sm:p-6" aria-labelledby="judul-status">
            <div class="flex flex-wrap items-center gap-3">
                <h2 id="judul-status" class="text-base font-bold text-slate-900">Portal siswa</h2>
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset"
                      :class="tutup ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200'"
                      x-text="tutup ? 'Sedang tutup' : 'Sedang buka'"></span>
            </div>
            <p class="mt-1 text-sm text-slate-500" x-show="diubah" x-text="diubah"></p>

            <form class="mt-5" @submit.prevent="simpan(!tutup)">
                <label for="pesan-tutup" class="block text-sm font-semibold text-slate-800">Pengumuman untuk siswa</label>
                <textarea id="pesan-tutup" x-model.trim="pesan" rows="3" maxlength="300" :disabled="tutup"
                          placeholder="Contoh: Bank Mini tutup selama libur semester. Buka kembali Senin, 4 Januari 2027."
                          class="mt-1.5 w-full rounded-lg border border-garis px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15 disabled:bg-kanvas disabled:text-slate-500"></textarea>
                <p class="mt-1 text-xs text-slate-500">Boleh dikosongkan; siswa akan melihat pengumuman standar. Untuk mengubah pengumuman, buka layanan lalu tutup lagi.</p>
                <p x-show="galat" x-text="galat" class="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert"></p>

                <button type="submit" :disabled="proses"
                        class="mt-5 inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                        :class="tutup ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'"
                        x-text="proses ? 'Menyimpan...' : (tutup ? 'Buka layanan sekarang' : 'Tutup layanan sekarang')"></button>
            </form>
        </section>

        <aside class="rounded-2xl border border-garis bg-white p-5 text-sm text-slate-600">
            <h2 class="text-sm font-bold text-slate-900">Saat layanan tutup</h2>
            <ul class="mt-3 list-disc space-y-2 pl-5">
                <li>Halaman login, dasbor, tagihan, dan riwayat siswa diganti pengumuman tutup.</li>
                <li>Siswa tidak bisa membuat pembayaran online baru.</li>
                <li>Pembayaran online yang sudah dibuat sebelum tutup tetap tercatat lunas bila dibayar.</li>
                <li>Panel petugas dan wali kelas tetap bisa dipakai, termasuk bayar tunai.</li>
            </ul>
        </aside>
    </div>
@endsection

@push('scripts')
    <script>
        function statusLayanan(url, awal) {
            const waktu = (s) => s.diubah_at ? 'Terakhir diubah ' + (s.diubah_oleh || 'petugas') + ', ' + new Date(s.diubah_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB' : '';

            return {
                tutup: awal.tutup, pesan: awal.pesan || '', diubah: waktu(awal), proses: false, galat: '',
                async simpan(tutup) {
                    this.proses = true;
                    this.galat = '';
                    try {
                        const res = await bankMini.kirim(url, { tutup, pesan: this.pesan }, 'PUT');
                        this.tutup = res.data.tutup;
                        this.diubah = waktu(res.data);
                        Alpine.store('toast').muncul(res.meta.message);
                    } catch (e) {
                        this.galat = bankMini.galatPertama(e.errors) || e.message;
                    } finally {
                        this.proses = false;
                    }
                },
            };
        }
    </script>
@endpush
