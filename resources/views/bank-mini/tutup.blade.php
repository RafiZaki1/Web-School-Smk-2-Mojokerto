@extends('bank-mini.layouts.guest', ['judul' => 'Bank Mini sedang tutup'])

@section('konten')
    <section class="rounded-2xl border border-garis bg-white p-6 text-center sm:p-8" aria-labelledby="judul-tutup">
        <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <x-bank-mini.icon name="clock" />
        </span>
        <h1 id="judul-tutup" class="mt-4 text-xl font-bold text-slate-900">Bank Mini sedang tutup</h1>
        <p class="mt-2 text-sm leading-relaxed text-slate-600">
            {{ $status['pesan'] ?? 'Layanan pembayaran SPP online belum bisa dipakai untuk sementara. Silakan coba lagi nanti.' }}
        </p>
        <p class="mt-4 rounded-lg bg-kanvas px-3 py-2 text-xs text-slate-500">
            Pembayaran yang sudah kamu lakukan tetap tercatat. Tagihan dan riwayatmu bisa dilihat lagi setelah layanan dibuka.
        </p>

        <div class="mt-6 flex flex-col gap-2">
            <a href="{{ url()->current() }}" class="inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 text-sm font-bold text-white hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2">Muat ulang</a>
            @auth('siswa')
                <form method="POST" action="{{ route('bank-mini.logout') }}">
                    @csrf
                    <button type="submit" class="h-11 w-full rounded-xl border border-garis px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Keluar</button>
                </form>
            @endauth
        </div>
    </section>

    <p class="mt-5 text-center text-sm text-slate-500">
        Petugas atau wali kelas?
        <a href="{{ route('bank-mini.admin.login') }}" class="font-semibold text-navy hover:underline">Masuk petugas</a>
        <span aria-hidden="true">·</span>
        <a href="{{ route('bank-mini.walas.login') }}" class="font-semibold text-navy hover:underline">Masuk wali kelas</a>
    </p>
@endsection
