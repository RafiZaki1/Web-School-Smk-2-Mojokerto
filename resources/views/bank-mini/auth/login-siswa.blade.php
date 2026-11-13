@extends('bank-mini.layouts.guest', ['judul' => 'Login Siswa'])

@section('konten')
    @include('bank-mini.partials.form-login', [
        'aksi' => route('bank-mini.login.submit'),
        'fieldId' => 'username',
        'ingatSaya' => true,
        'labelId' => 'Username',
        'placeholderId' => 'Username dari sekolah',
        'catatan' => 'Belum menerima akun atau lupa password? Hubungi petugas Bank Mini atau wali kelasmu.',
        'judulKartu' => 'Masuk Portal SPP',
        'subjudul' => 'Cek tagihan, bayar SPP online, dan lihat tabunganmu.',
    ])
    <p class="mt-6 text-center text-sm text-slate-500">
        Petugas Bank Mini?
        <a href="{{ route('bank-mini.admin.login') }}" class="font-semibold text-navy underline-offset-2 hover:underline">Masuk sebagai petugas</a>
    </p>
@endsection
