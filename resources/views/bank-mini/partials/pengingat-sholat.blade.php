{{--
    Pengingat waktu sholat untuk semua halaman Bank Mini (siswa, petugas, wali kelas).
    Jadwal dihitung di browser dari posisi matahari untuk koordinat sekolah (config/bank_mini.php),
    sudut Subuh 20° dan Isya 18° seperti Kemenag, ditambah ihtiyat 2 menit. Tanpa layanan luar.
--}}
<div class="relative" x-data="pengingatSholat(@js(config('bank_mini.sholat')))" @click.outside="buka = false" @keydown.escape.window="buka = false">
    <button type="button" @click="buka = !buka" :aria-expanded="buka" aria-haspopup="true"
            class="hidden h-10 items-center gap-2 rounded-xl border sm:flex border-garis bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            :class="masuk && 'border-emerald-300 bg-emerald-50 text-emerald-800'">
        <x-bank-mini.icon name="bell" class="h-4 w-4 text-slate-400" />
        <span class="sr-only">Waktu sholat berikutnya:</span>
        <span x-text="berikut.nama"></span>
        <span class="tabular-nums" x-text="berikut.jam"></span>
    </button>

    <div x-cloak x-show="buka" x-transition.origin.top.right class="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-garis bg-white shadow-lg">
        <p class="border-b border-garis px-4 py-3 text-sm font-bold text-slate-900">Waktu sholat hari ini</p>
        <ul class="divide-y divide-garis text-sm">
            <template x-for="w in jadwal" :key="w.nama">
                <li class="flex items-center justify-between px-4 py-2" :class="w.nama === berikut.nama && !berikut.besok && 'bg-navy-50/60 font-semibold text-navy'">
                    <span x-text="w.nama"></span><span class="tabular-nums" x-text="w.jam"></span>
                </li>
            </template>
        </ul>
        <p class="border-t border-garis px-4 py-2 text-[11px] leading-relaxed text-slate-400">Perkiraan untuk {{ config('bank_mini.sholat.kota') }} (WIB). Ikuti adzan masjid setempat.</p>
    </div>

    {{-- Muncul saat waktu sholat masuk, bertahan 15 menit atau sampai ditutup --}}
    <div x-cloak x-show="masuk && !ditutup" x-transition role="status"
         class="no-print fixed inset-x-0 top-[4.5rem] z-[65] flex justify-center px-4">
        <div class="flex max-w-lg items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm shadow-lg">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white"><x-bank-mini.icon name="bell" class="h-4 w-4" /></span>
            <p class="text-slate-700">Sudah masuk waktu <strong class="text-slate-900" x-text="masuk?.nama"></strong> (<span class="tabular-nums" x-text="masuk?.jam"></span> WIB). Yuk sholat dulu, urusan di sini bisa dilanjutkan setelahnya.</p>
            <button type="button" class="-mr-1 rounded p-1 text-slate-400 hover:text-slate-600" @click="tutup()" aria-label="Tutup pengingat sholat">
                <x-bank-mini.icon name="close" class="h-4 w-4" />
            </button>
        </div>
    </div>
</div>

@once
    @push('scripts')
        <script>
            // Jam desimal (WIB) lima waktu sholat untuk satu tanggal.
            function jadwalSholat(tgl, lat, lng, zona) {
                const r = Math.PI / 180, sin = d => Math.sin(d * r), cos = d => Math.cos(d * r), tan = d => Math.tan(d * r);
                const acos = x => Math.acos(Math.min(1, Math.max(-1, x))) / r, norm = (x, n) => ((x % n) + n) % n;
                const D = Date.UTC(tgl.y, tgl.m - 1, tgl.d, 12 - zona) / 86400000 + 2440587.5 - 2451545.0;
                const g = norm(357.529 + 0.98560028 * D, 360), q = norm(280.459 + 0.98564736 * D, 360);
                const L = norm(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360), e = 23.439 - 0.00000036 * D;
                const RA = norm(Math.atan2(cos(e) * sin(L), cos(L)) / r, 360) / 15, dek = Math.asin(sin(e) * sin(L)) / r;
                let eqt = q / 15 - RA; if (eqt > 12) eqt -= 24; if (eqt < -12) eqt += 24;
                const zuhur = 12 + zona - lng / 15 - eqt;
                const busur = a => acos((-sin(a) - sin(lat) * sin(dek)) / (cos(lat) * cos(dek))) / 15;
                const tinggiAshar = Math.atan(1 / (1 + tan(Math.abs(lat - dek)))) / r;
                const ashar = acos((sin(tinggiAshar) - sin(lat) * sin(dek)) / (cos(lat) * cos(dek))) / 15;
                const ihtiyat = 2 / 60;
                return [['Subuh', zuhur - busur(20)], ['Dzuhur', zuhur], ['Ashar', zuhur + ashar], ['Maghrib', zuhur + busur(0.833)], ['Isya', zuhur + busur(18)]]
                    .map(([nama, jam]) => ({ nama, desimal: jam + ihtiyat }));
            }

            function pengingatSholat(lokasi) {
                const ZONA = 7, TAHAN_MENIT = 15;
                const teks = h => String(Math.floor(h)).padStart(2, '0') + '.' + String(Math.floor((h % 1) * 60)).padStart(2, '0');
                // Tanggal dan jam sekarang di WIB, apa pun zona waktu perangkatnya.
                const wib = () => { const d = new Date(Date.now() + ZONA * 3600000); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), jam: d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600 }; };

                return {
                    buka: false, jadwal: [], berikut: { nama: '', jam: '' }, masuk: null, ditutup: false,
                    init() { this.perbarui(); setInterval(() => this.perbarui(), 20000); },
                    perbarui() {
                        const kini = wib();
                        this.jadwal = jadwalSholat(kini, lokasi.lat, lokasi.lng, ZONA).map(w => ({ ...w, jam: teks(w.desimal) }));
                        const nanti = this.jadwal.find(w => w.desimal > kini.jam);
                        this.berikut = nanti ? { ...nanti, besok: false } : { ...this.jadwal[0], besok: true };
                        const baru = this.jadwal.find(w => kini.jam >= w.desimal && kini.jam < w.desimal + TAHAN_MENIT / 60) || null;
                        if (baru?.nama !== this.masuk?.nama) {
                            const kunci = `${kini.y}-${kini.m}-${kini.d}-${baru?.nama}`;
                            let sudah = false;
                            try { sudah = sessionStorage.getItem('sholat-ditutup') === kunci; } catch (e) { /* penyimpanan diblokir: tampilkan saja */ }
                            this.ditutup = sudah;
                        }
                        this.masuk = baru;
                    },
                    tutup() {
                        this.ditutup = true;
                        const kini = wib();
                        try { sessionStorage.setItem('sholat-ditutup', `${kini.y}-${kini.m}-${kini.d}-${this.masuk?.nama}`); } catch (e) { /* abaikan */ }
                    },
                };
            }
        </script>
    @endpush
@endonce
