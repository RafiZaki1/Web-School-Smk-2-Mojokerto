@extends('bank-mini.layouts.guest', ['judul' => 'Login Petugas'])

@section('konten')
    @include('bank-mini.partials.form-login', [
        'aksi' => route('bank-mini.admin.login.submit'),
        'fieldId' => 'login',
        'labelId' => 'Username atau email',
        'placeholderId' => 'Username petugas',
        'catatan' => 'Gunakan akun petugas Bank Mini, bukan akun Tata Usaha.',
        'judulKartu' => 'Masuk Petugas Bank Mini',
        'subjudul' => 'Monitoring pembayaran kelas, kas tunai, dan laporan.',
    ])
    <p class="mt-6 text-center text-sm text-slate-500">
        Wali kelas?
        <a href="{{ route('bank-mini.walas.login') }}" class="font-semibold text-navy underline-offset-2 hover:underline">Masuk sebagai wali kelas</a>
        <span class="mx-1 text-slate-300" aria-hidden="true">|</span>
        Siswa?
        <a href="{{ route('bank-mini.login') }}" class="font-semibold text-navy underline-offset-2 hover:underline">Masuk portal siswa</a>
    </p>
@endsection
