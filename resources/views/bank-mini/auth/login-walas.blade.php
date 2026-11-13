@extends('bank-mini.layouts.guest', ['judul' => 'Login Wali Kelas'])

@section('konten')
    @include('bank-mini.partials.form-login', [
        'aksi' => route('bank-mini.admin.login.submit'),
        'fieldId' => 'login',
        'labelId' => 'Username',
        'placeholderId' => 'Username dari petugas Bank Mini',
        'catatan' => 'Akun wali kelas dibuat oleh petugas Bank Mini. Lupa password? Minta petugas mengaturnya ulang.',
        'judulKartu' => 'Masuk Wali Kelas',
        'subjudul' => 'Pantau pembayaran SPP dan tabungan siswa di kelas Anda.',
    ])
    <p class="mt-6 text-center text-sm text-slate-500">
        Petugas Bank Mini?
        <a href="{{ route('bank-mini.admin.login') }}" class="font-semibold text-navy underline-offset-2 hover:underline">Masuk sebagai petugas</a>
    </p>
@endsection
