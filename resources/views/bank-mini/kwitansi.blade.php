@php use App\Helpers\BankMiniFormat as F; @endphp
<!DOCTYPE html>
<html lang="id">
<head>
    @include('bank-mini.partials.head', ['judul' => 'Kwitansi '.$transaksi->order_id])
</head>
<body class="min-h-screen bg-kanvas font-sans text-slate-800 antialiased">
    <div class="no-print mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 pt-6">
        <a href="{{ $kembali }}" class="inline-flex h-10 items-center gap-1.5 rounded-lg border border-garis bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Kembali</a>
        <span class="flex gap-2">
            <button type="button" onclick="window.print()" class="inline-flex h-10 items-center gap-2 rounded-lg border border-garis bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <x-bank-mini.icon name="printer" class="h-4 w-4" /> Cetak
            </button>
            <button type="button" id="tombol-unduh" onclick="unduhPdf()" class="inline-flex h-10 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-600">Unduh PDF</button>
        </span>
    </div>

    <main class="mx-auto max-w-2xl px-4 py-6">
        <article id="kwitansi" class="print-flat rounded-2xl border border-garis bg-white p-6 sm:p-10">
            <header class="flex items-start gap-4 border-b border-garis pb-6">
                <img src="{{ asset('images/brand/emblem-smkn2.png') }}" alt="" width="52" height="52" class="h-12 w-12 object-contain">
                <div class="flex-1">
                    <p class="text-lg font-bold text-navy">Bank Mini SMK Negeri 2 Kota Mojokerto</p>
                    <p class="text-sm text-slate-500">Kwitansi Pembayaran SPP</p>
                </div>
                <x-bank-mini.status-pill :status="$transaksi->status->value" />
            </header>

            <dl class="grid grid-cols-1 gap-x-8 gap-y-3 py-6 text-sm sm:grid-cols-2">
                <div><dt class="text-xs text-slate-500">No. kwitansi</dt><dd class="font-semibold text-slate-900">{{ $transaksi->order_id }}</dd></div>
                <div><dt class="text-xs text-slate-500">Tanggal bayar</dt><dd class="font-semibold text-slate-900">{{ F::tanggal($transaksi->paid_at, true) }} WIB</dd></div>
                <div><dt class="text-xs text-slate-500">Nama siswa</dt><dd class="font-semibold text-slate-900">{{ $transaksi->siswa->nama }}</dd></div>
                <div><dt class="text-xs text-slate-500">NISN · Kelas</dt><dd class="font-semibold text-slate-900">{{ $transaksi->siswa->nisn }} · {{ $transaksi->siswa->kelas }}</dd></div>
                <div><dt class="text-xs text-slate-500">Metode</dt><dd class="font-semibold text-slate-900">{{ $transaksi->metode->label() }}{{ $transaksi->channel_nama ? ' · '.$transaksi->channel_nama : '' }}</dd></div>
                <div>
                    <dt class="text-xs text-slate-500">{{ $transaksi->petugas ? 'Diterima oleh' : 'Referensi gateway' }}</dt>
                    <dd class="font-semibold text-slate-900">{{ $transaksi->petugas?->name ?? ($transaksi->reference ?? '-') }}</dd>
                </div>
            </dl>

            <table class="w-full text-sm">
                <caption class="sr-only">Rincian bulan yang dibayar</caption>
                <thead>
                    <tr class="border-y border-garis text-left text-xs font-semibold text-slate-500">
                        <th scope="col" class="py-2.5">Bulan</th>
                        <th scope="col" class="py-2.5 text-right">SPP</th>
                        <th scope="col" class="py-2.5 text-right">Tabungan</th>
                        <th scope="col" class="py-2.5 text-right">Jumlah</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-garis">
                    @foreach ($transaksi->tagihan as $t)
                        <tr>
                            <th scope="row" class="py-2.5 text-left font-medium text-slate-800">{{ $t->labelBulan() }}</th>
                            <td class="py-2.5 text-right text-slate-600">{{ F::rupiah($t->nominal_spp) }}</td>
                            <td class="py-2.5 text-right text-slate-600">{{ F::rupiah($t->nominal_tabungan) }}</td>
                            <td class="py-2.5 text-right font-medium text-slate-800">{{ F::rupiah($t->total()) }}</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot class="border-t-2 border-slate-300 text-sm">
                    <tr><td colspan="3" class="pt-3 text-right text-slate-500">Porsi SPP</td><td class="pt-3 text-right text-slate-800">{{ F::rupiah($transaksi->porsi_spp) }}</td></tr>
                    <tr><td colspan="3" class="pt-1 text-right text-slate-500">Porsi tabungan (masuk tabungan siswa)</td><td class="pt-1 text-right text-emerald-700">{{ F::rupiah($transaksi->porsi_tabungan) }}</td></tr>
                    @if ($transaksi->biaya_admin > 0)
                        <tr><td colspan="3" class="pt-1 text-right text-slate-500">Biaya admin channel</td><td class="pt-1 text-right text-slate-800">{{ F::rupiah($transaksi->biaya_admin) }}</td></tr>
                    @endif
                    <tr><td colspan="3" class="pt-2 text-right font-semibold text-slate-900">Total dibayar</td><td class="pt-2 text-right text-lg font-extrabold text-navy">{{ F::rupiah($transaksi->totalBayar()) }}</td></tr>
                </tfoot>
            </table>

            <p class="mt-8 text-xs text-slate-400">Kwitansi digital ini dibuat otomatis oleh sistem Bank Mini. Simpan sebagai bukti pembayaran yang sah.</p>
        </article>
    </main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" defer></script>
    <script>
        // Simpan kwitansi sebagai berkas PDF. Dengan ?unduh=1 (dipakai setelah bayar tunai dan tombol
        // Unduh di daftar transaksi) unduhan berjalan sendiri begitu halaman selesai dimuat.
        function unduhPdf() {
            const tombol = document.getElementById('tombol-unduh');
            if (typeof html2pdf === 'undefined') { window.print(); return; }
            tombol.disabled = true;
            html2pdf().set({
                filename: @js('kwitansi-'.$transaksi->order_id.'.pdf'),
                margin: 10,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            }).from(document.getElementById('kwitansi')).save().finally(() => { tombol.disabled = false; });
        }
        if (new URLSearchParams(location.search).has('unduh')) {
            window.addEventListener('load', () => setTimeout(unduhPdf, 600));
        }
    </script>
</body>
</html>
