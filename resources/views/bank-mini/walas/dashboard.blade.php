@extends('bank-mini.layouts.app', ['area' => 'walas', 'judul' => 'Dasbor Kelas '.$kelas, 'aktif' => 'dashboard', 'pakaiTahun' => true])

@section('konten')
    <p class="-mt-3 mb-6 text-sm text-slate-600">
        Pantau pembayaran SPP siswa {{ $kelas }}. Halaman ini hanya untuk melihat; pembayaran tunai dicatat petugas Bank Mini.
    </p>

    @include('bank-mini.partials.matriks-kelas', [
        'bisaBayar' => false,
        'tabStatus' => true,
        'kosongSiswa' => 'Data siswa kelas ini belum masuk. Hubungi petugas Bank Mini.',
        'kosongTagihan' => 'Petugas Bank Mini belum membuat tagihan untuk tahun ajaran ini. Pilih tahun ajaran lain di bagian atas.',
    ])
@endsection
