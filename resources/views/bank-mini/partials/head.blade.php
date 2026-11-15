<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="robots" content="noindex, nofollow">
<title>{{ $judul ?? 'Bank Mini' }} · Bank Mini SMKN 2 Mojokerto</title>
<link rel="icon" href="{{ asset('favicon.png') }}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{{-- Plus Jakarta Sans: typeface buatan Indonesia, angka tabular jelas untuk nominal rupiah. --}}
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
{{-- Fase 1 memakai Tailwind Play CDN karena backend ini belum punya pipeline Vite untuk Blade. Ganti ke build Vite sebelum produksi. --}}
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
<script>
    tailwind.config = {
        theme: {
            extend: {
                fontFamily: { sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
                colors: {
                    navy: { DEFAULT: '#0F2954', 50: '#EEF2F8', 100: '#DCE4F1', 600: '#18396F', 700: '#0F2954', 800: '#0B1F40' },
                    kanvas: '#F8FAFC',
                    garis: '#E2E8F0',
                },
            },
        },
    };
</script>
<style>
    [x-cloak] { display: none !important; }
    body { font-feature-settings: "tnum" 1; }
    @media print {
        .no-print { display: none !important; }
        body { background: #fff !important; }
        .print-flat { border: 0 !important; box-shadow: none !important; padding: 0 !important; }
    }
</style>
<script>
    // Helper bersama: kirim JSON ke endpoint Bank Mini (ApiRequest + ResponseHelper) dengan CSRF.
    window.bankMini = {
        csrf: document.querySelector('meta[name="csrf-token"]').content,
        async kirim(url, data = {}, method = 'POST') {
            let res;
            try {
                res = await fetch(url, {
                    method,
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': this.csrf,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify(data),
                });
            } catch (e) {
                throw Object.assign(new Error('Tidak bisa terhubung ke server. Periksa koneksi internet lalu coba lagi.'), { errors: {} });
            }
            let body = null;
            try { body = await res.json(); } catch (e) { body = null; }
            if (res.status === 419) {
                throw Object.assign(new Error('Sesi halaman kedaluwarsa. Muat ulang halaman lalu coba lagi.'), { errors: {} });
            }
            if (!res.ok || !body || body.success !== true) {
                const pesan = body?.meta?.message || 'Permintaan gagal diproses. Coba lagi.';
                throw Object.assign(new Error(pesan), { errors: body?.data || {}, status: res.status });
            }
            return body;
        },
        rupiah(n) {
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(n || 0));
        },
        // Unduh kwitansi sebagai PDF tanpa meninggalkan halaman: halaman kwitansi dimuat di iframe
        // luar layar dengan ?unduh=1, lalu halaman itu sendiri yang membuat dan menyimpan PDF-nya.
        unduhKwitansi(url) {
            if (!url) return;
            const bingkai = document.createElement('iframe');
            bingkai.setAttribute('aria-hidden', 'true');
            bingkai.tabIndex = -1;
            bingkai.style.cssText = 'position:fixed;left:-10000px;top:0;width:820px;height:1160px;border:0;';
            bingkai.src = url + (url.includes('?') ? '&' : '?') + 'unduh=1';
            document.body.appendChild(bingkai);
            setTimeout(() => bingkai.remove(), 60000);
        },
        galatPertama(errors) {
            const nilai = Object.values(errors || {})[0];
            return Array.isArray(nilai) ? nilai[0] : null;
        },
    };

    document.addEventListener('alpine:init', () => {
        Alpine.store('cari', {
            q: '',
            cocok(teks) {
                const q = this.q.trim().toLowerCase();
                return q === '' || String(teks).toLowerCase().includes(q);
            },
        });
        Alpine.store('toast', {
            pesan: '',
            jenis: 'sukses',
            tampil: false,
            _t: null,
            muncul(pesan, jenis = 'sukses') {
                this.pesan = pesan;
                this.jenis = jenis;
                this.tampil = true;
                clearTimeout(this._t);
                this._t = setTimeout(() => (this.tampil = false), 6000);
            },
        });
    });
</script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
