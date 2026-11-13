@php use App\Helpers\BankMiniFormat as F; $siswa = $transaksi->siswa; @endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice {{ $transaksi->order_id }}</title>
</head>
<body style="margin:0;padding:0;background:#F4F6FA;font-family:Arial,Helvetica,sans-serif;color:#1E293B;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FA;padding:24px 12px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;">
                <tr>
                    <td style="padding:24px 28px;border-bottom:1px solid #E2E8F0;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="56" valign="middle">
                                    <img src="{{ asset('images/brand/emblem-smkn2.png') }}" alt="SMK Negeri 2 Kota Mojokerto" width="48" height="48" style="display:block;border:0;">
                                </td>
                                <td valign="middle">
                                    <p style="margin:0;font-size:16px;font-weight:bold;color:#0F2954;">Bank Mini SMK Negeri 2 Kota Mojokerto</p>
                                    <p style="margin:2px 0 0;font-size:13px;color:#64748B;">Invoice Pembayaran SPP</p>
                                </td>
                                <td align="right" valign="middle">
                                    <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#ECFDF5;color:#047857;font-size:12px;font-weight:bold;">LUNAS</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:24px 28px 8px;">
                        <p style="margin:0 0 12px;font-size:15px;">Halo {{ $siswa?->nama }},</p>
                        <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">
                            Pembayaran SPP sebesar <strong>{{ F::rupiah($transaksi->totalBayar()) }}</strong> sudah kami terima
                            pada {{ F::tanggal($transaksi->paid_at, true) }} WIB. Bulan di bawah ini sudah tercatat lunas di Bank Mini.
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding:16px 28px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
                            <tr>
                                <td style="padding:4px 0;color:#64748B;width:42%;">No. invoice</td>
                                <td style="padding:4px 0;font-weight:bold;">{{ $transaksi->order_id }}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;color:#64748B;">Nama siswa</td>
                                <td style="padding:4px 0;font-weight:bold;">{{ $siswa?->nama }}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;color:#64748B;">NISN · Kelas</td>
                                <td style="padding:4px 0;font-weight:bold;">{{ $siswa?->nisn }} · {{ $siswa?->kelas }}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;color:#64748B;">Metode bayar</td>
                                <td style="padding:4px 0;font-weight:bold;">{{ $transaksi->channel_nama ?? 'Payment Gateway' }}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;color:#64748B;">Referensi Tripay</td>
                                <td style="padding:4px 0;font-weight:bold;">{{ $transaksi->reference ?? '-' }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 28px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;">
                            <tr style="background:#F8FAFC;">
                                <th align="left" style="padding:10px 8px;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;color:#64748B;font-weight:bold;">Bulan</th>
                                <th align="right" style="padding:10px 8px;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;color:#64748B;font-weight:bold;">SPP</th>
                                <th align="right" style="padding:10px 8px;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;color:#64748B;font-weight:bold;">Tabungan</th>
                                <th align="right" style="padding:10px 8px;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;color:#64748B;font-weight:bold;">Jumlah</th>
                            </tr>
                            @foreach ($transaksi->tagihan as $t)
                                <tr>
                                    <td style="padding:9px 8px;border-bottom:1px solid #F1F5F9;">{{ $t->labelBulan() }}</td>
                                    <td align="right" style="padding:9px 8px;border-bottom:1px solid #F1F5F9;color:#475569;">{{ F::rupiah($t->nominal_spp) }}</td>
                                    <td align="right" style="padding:9px 8px;border-bottom:1px solid #F1F5F9;color:#475569;">{{ F::rupiah($t->nominal_tabungan) }}</td>
                                    <td align="right" style="padding:9px 8px;border-bottom:1px solid #F1F5F9;font-weight:bold;">{{ F::rupiah($t->total()) }}</td>
                                </tr>
                            @endforeach
                            <tr>
                                <td colspan="3" align="right" style="padding:12px 8px 3px;color:#64748B;">Porsi SPP</td>
                                <td align="right" style="padding:12px 8px 3px;">{{ F::rupiah($transaksi->porsi_spp) }}</td>
                            </tr>
                            <tr>
                                <td colspan="3" align="right" style="padding:3px 8px;color:#64748B;">Porsi tabungan (masuk tabungan siswa)</td>
                                <td align="right" style="padding:3px 8px;color:#047857;">{{ F::rupiah($transaksi->porsi_tabungan) }}</td>
                            </tr>
                            <tr>
                                <td colspan="3" align="right" style="padding:3px 8px;color:#64748B;">Biaya admin channel</td>
                                <td align="right" style="padding:3px 8px;">{{ F::rupiah($transaksi->biaya_admin) }}</td>
                            </tr>
                            <tr>
                                <td colspan="3" align="right" style="padding:10px 8px 4px;font-weight:bold;">Total dibayar</td>
                                <td align="right" style="padding:10px 8px 4px;font-size:16px;font-weight:bold;color:#0F2954;">{{ F::rupiah($transaksi->totalBayar()) }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:24px 28px;">
                        <a href="{{ $urlKwitansi }}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#0F2954;color:#FFFFFF;font-size:14px;font-weight:bold;text-decoration:none;">Lihat kwitansi di portal</a>
                        <p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#64748B;">Kwitansi bisa dicetak setelah masuk ke portal Bank Mini dengan NISN. Simpan email ini sebagai bukti pembayaran.</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding:16px 28px;border-top:1px solid #E2E8F0;font-size:12px;line-height:1.6;color:#94A3B8;">
                        Email ini dikirim otomatis oleh sistem Bank Mini SMK Negeri 2 Kota Mojokerto. Bila ada nominal yang tidak sesuai, hubungi petugas Bank Mini di sekolah dengan menyebutkan nomor invoice di atas.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
