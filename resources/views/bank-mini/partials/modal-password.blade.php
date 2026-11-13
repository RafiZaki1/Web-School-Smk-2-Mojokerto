{{-- Modal Ganti Password (siswa & wali kelas). Variabel: $urlPassword, $catatanPassword. Dibuka dari sidebar atau banner dengan $dispatch('buka-password'). --}}
<div x-data="gantiPassword()" x-cloak x-show="buka" @buka-password.window="bukaModal()" @keydown.escape.window="tutup()"
     class="no-print fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="judul-password">
    <div class="absolute inset-0 bg-slate-900/50" @click="tutup()" x-show="buka" x-transition.opacity></div>
    <form @submit.prevent="simpan()" x-show="buka" x-transition
          class="relative w-full max-w-md rounded-t-2xl border border-garis bg-white p-6 sm:rounded-2xl">
        <div class="mb-5 flex items-start justify-between gap-4">
            <div>
                <h2 id="judul-password" class="text-lg font-bold text-slate-900">Ganti Password</h2>
                <p class="mt-1 text-sm text-slate-500">{{ $catatanPassword }}</p>
            </div>
            <button type="button" @click="tutup()" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Tutup">
                <x-bank-mini.icon name="close" />
            </button>
        </div>

        <div class="space-y-4">
            <template x-for="field in fields" :key="field.nama">
                <div>
                    <label :for="'pw-' + field.nama" class="mb-1.5 block text-sm font-medium text-slate-700" x-text="field.label"></label>
                    <input :id="'pw-' + field.nama" :type="lihat ? 'text' : 'password'" x-model="form[field.nama]" :autocomplete="field.auto" required
                           class="h-11 w-full rounded-lg border bg-white px-3 text-sm focus:outline-none focus:ring-2"
                           :class="errors[field.nama] ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15' : 'border-garis focus:border-navy focus:ring-navy/15'"
                           :aria-invalid="!!errors[field.nama]" :aria-describedby="'pw-err-' + field.nama">
                    <p :id="'pw-err-' + field.nama" class="mt-1 text-xs text-rose-600" x-show="errors[field.nama]" x-text="errors[field.nama]?.[0]"></p>
                </div>
            </template>
            <label class="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" x-model="lihat" class="h-4 w-4 rounded border-slate-300 text-navy focus:ring-navy">
                Tampilkan password
            </label>
        </div>

        <p x-show="pesan" x-text="pesan" class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert"></p>

        <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" @click="tutup()" class="h-11 rounded-lg border border-garis px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
            <button type="submit" :disabled="proses" class="h-11 rounded-lg bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
                <span x-text="proses ? 'Menyimpan...' : 'Simpan Password'"></span>
            </button>
        </div>
    </form>
</div>

<script>
    function gantiPassword() {
        return {
            buka: false,
            lihat: false,
            proses: false,
            pesan: '',
            errors: {},
            form: { password_lama: '', password_baru: '', password_baru_confirmation: '' },
            fields: [
                { nama: 'password_lama', label: 'Password lama', auto: 'current-password' },
                { nama: 'password_baru', label: 'Password baru', auto: 'new-password' },
                { nama: 'password_baru_confirmation', label: 'Ulangi password baru', auto: 'new-password' },
            ],
            bukaModal() {
                this.buka = true;
                this.$nextTick(() => document.getElementById('pw-password_lama')?.focus());
            },
            tutup() {
                this.buka = false;
                this.pesan = '';
                this.errors = {};
            },
            async simpan() {
                this.proses = true;
                this.pesan = '';
                this.errors = {};
                try {
                    const res = await bankMini.kirim(@json($urlPassword), this.form, 'PUT');
                    this.form = { password_lama: '', password_baru: '', password_baru_confirmation: '' };
                    this.tutup();
                    Alpine.store('toast').muncul(res.meta.message);
                    document.getElementById('banner-password')?.remove();
                } catch (e) {
                    this.errors = e.errors || {};
                    this.pesan = Object.keys(this.errors).length ? '' : e.message;
                } finally {
                    this.proses = false;
                }
            },
        };
    }
</script>
