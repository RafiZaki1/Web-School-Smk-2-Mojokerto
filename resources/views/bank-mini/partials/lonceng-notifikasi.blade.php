{{-- Lonceng pembayaran online untuk petugas. Diperbarui tiap 30 detik; pembayaran baru juga muncul sebagai toast. --}}
<div class="relative" x-data="loncengNotifikasi(@js(route('bank-mini.admin.notifikasi')), @js(route('bank-mini.admin.notifikasi.baca')))"
     @click.outside="buka = false" @keydown.escape.window="buka = false">
    <button type="button" @click="toggle()" :aria-expanded="buka" aria-haspopup="true"
            :aria-label="belum > 0 ? belum + ' pembayaran online baru' : 'Notifikasi pembayaran'"
            class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-garis bg-white text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
        <x-bank-mini.icon name="bell" class="h-5 w-5" />
        <span x-cloak x-show="belum > 0" x-text="belum > 9 ? '9+' : belum"
              class="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white"></span>
    </button>

    <div x-cloak x-show="buka" x-transition.origin.top.right role="menu"
         class="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-garis bg-white shadow-lg">
        <div class="flex items-center justify-between border-b border-garis px-4 py-3">
            <p class="text-sm font-bold text-slate-900">Pembayaran online</p>
            <button type="button" x-show="adaBelum" @click="bacaSemua()" class="text-xs font-semibold text-navy hover:underline">Tandai dibaca</button>
        </div>
        <ul class="max-h-96 divide-y divide-garis overflow-y-auto">
            <template x-for="n in items" :key="n.id">
                <li>
                    <a :href="n.url || '#'" role="menuitem" class="flex gap-3 px-4 py-3 hover:bg-slate-50" :class="!n.dibaca && 'bg-emerald-50/60'">
                        <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                            <x-bank-mini.icon name="check-circle" class="h-4 w-4" />
                        </span>
                        <span class="min-w-0 flex-1">
                            <span class="block text-sm font-semibold text-slate-900" x-text="n.judul"></span>
                            <span class="mt-0.5 block text-xs leading-relaxed text-slate-600" x-text="n.pesan"></span>
                            <span class="mt-1 block text-[11px] text-slate-400" x-text="n.waktu + ' WIB'"></span>
                        </span>
                    </a>
                </li>
            </template>
        </ul>
        <p x-show="items.length === 0" class="px-4 py-8 text-center text-sm text-slate-500">Belum ada pembayaran online yang masuk.</p>
    </div>
</div>

@once
    @push('scripts')
        <script>
            function loncengNotifikasi(urlDaftar, urlBaca) {
                return {
                    buka: false,
                    belum: 0,
                    items: [],
                    idTerakhir: null,
                    get adaBelum() { return this.items.some(n => !n.dibaca); },
                    init() {
                        this.muat(true);
                        setInterval(() => { if (!document.hidden) this.muat(false); }, 30000);
                    },
                    async muat(awal) {
                        try {
                            const res = await fetch(urlDaftar, { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' });
                            if (!res.ok) return;
                            const body = await res.json();
                            const items = body.data.items || [];
                            const baru = items.find(n => !n.dibaca);
                            if (!awal && baru && items[0] && items[0].id !== this.idTerakhir) {
                                Alpine.store('toast').muncul(baru.judul + '. ' + baru.pesan);
                            }
                            this.items = items;
                            this.belum = body.data.belum_dibaca;
                            this.idTerakhir = items[0]?.id ?? null;
                        } catch (e) {
                            // Gagal memuat diabaikan; dicoba lagi pada putaran berikutnya.
                        }
                    },
                    toggle() {
                        this.buka = !this.buka;
                        if (this.buka) this.muat(true);
                    },
                    async bacaSemua() {
                        try {
                            await bankMini.kirim(urlBaca);
                            this.items = this.items.map(n => ({ ...n, dibaca: true }));
                            this.belum = 0;
                        } catch (e) {
                            Alpine.store('toast').muncul(e.message, 'gagal');
                        }
                    },
                };
            }
        </script>
    @endpush
@endonce
