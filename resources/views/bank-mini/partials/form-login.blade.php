{{--
    Form login bersama siswa & petugas. Variabel: $aksi (URL), $fieldId ('username'|'login'), $ingatSaya (bool),
    $labelId, $placeholderId, $inputMode, $catatan (opsional), $judulKartu, $subjudul.
--}}
<div class="rounded-2xl border border-garis bg-white p-6 sm:p-8"
     x-data="formLogin(@js($aksi), @js($fieldId))">
    <h1 class="text-xl font-bold text-slate-900">{{ $judulKartu }}</h1>
    <p class="mt-1 text-sm text-slate-500">{{ $subjudul }}</p>

    @if (session('pesan_login'))
        <p class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">{{ session('pesan_login') }}</p>
    @endif

    <form class="mt-6 space-y-4" @submit.prevent="masuk()" novalidate>
        <div>
            <label for="{{ $fieldId }}" class="mb-1.5 block text-sm font-medium text-slate-700">{{ $labelId }}</label>
            <input id="{{ $fieldId }}" name="{{ $fieldId }}" type="text" x-model="form.{{ $fieldId }}" required autofocus
                   inputmode="{{ $inputMode ?? 'text' }}" autocomplete="username" placeholder="{{ $placeholderId }}"
                   class="h-11 w-full rounded-lg border bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2"
                   :class="errors.{{ $fieldId }} ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15' : 'border-garis focus:border-navy focus:ring-navy/15'"
                   :aria-invalid="!!errors.{{ $fieldId }}" aria-describedby="err-{{ $fieldId }}">
            <p id="err-{{ $fieldId }}" class="mt-1 text-xs text-rose-600" x-show="errors.{{ $fieldId }}" x-text="errors.{{ $fieldId }}?.[0]"></p>
        </div>

        <div>
            <label for="password" class="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div class="relative">
                <input id="password" name="password" :type="lihat ? 'text' : 'password'" x-model="form.password" required autocomplete="current-password"
                       class="h-11 w-full rounded-lg border bg-white pl-3 pr-11 text-sm focus:outline-none focus:ring-2"
                       :class="errors.password ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15' : 'border-garis focus:border-navy focus:ring-navy/15'"
                       :aria-invalid="!!errors.password" aria-describedby="err-password catatan-password">
                <button type="button" @click="lihat = !lihat" class="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                        :aria-label="lihat ? 'Sembunyikan password' : 'Tampilkan password'">
                    <span x-show="!lihat"><x-bank-mini.icon name="eye" class="h-[18px] w-[18px]" /></span>
                    <span x-show="lihat" x-cloak><x-bank-mini.icon name="eye-off" class="h-[18px] w-[18px]" /></span>
                </button>
            </div>
            <p id="err-password" class="mt-1 text-xs text-rose-600" x-show="errors.password" x-text="errors.password?.[0]"></p>
            @isset($catatan)
                <p id="catatan-password" class="mt-1.5 text-xs text-slate-500">{{ $catatan }}</p>
            @endisset
        </div>

        @if ($ingatSaya ?? false)
            <label class="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" x-model="form.remember" class="h-4 w-4 rounded border-slate-300 text-navy focus:ring-navy">
                Ingat saya di perangkat ini
            </label>
        @endif

        <p x-show="pesan" x-cloak x-text="pesan" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert"></p>

        <button type="submit" :disabled="proses"
                class="flex h-11 w-full items-center justify-center rounded-lg bg-navy text-sm font-semibold text-white hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
            <span x-text="proses ? 'Memeriksa...' : 'Masuk'">Masuk</span>
        </button>
    </form>
</div>

<script>
    function formLogin(aksi, fieldId) {
        return {
            form: { [fieldId]: '', password: '', remember: false },
            errors: {},
            pesan: '',
            lihat: false,
            proses: false,
            async masuk() {
                this.errors = {};
                this.pesan = '';
                if (!this.form[fieldId].trim() || !this.form.password) {
                    this.pesan = 'Isi username dan password terlebih dahulu.';
                    return;
                }
                this.proses = true;
                try {
                    const res = await bankMini.kirim(aksi, this.form);
                    window.location.href = res.data.redirect;
                } catch (e) {
                    this.errors = e.errors || {};
                    this.pesan = Object.keys(this.errors).length ? '' : e.message;
                    this.proses = false;
                }
            },
        };
    }
</script>
