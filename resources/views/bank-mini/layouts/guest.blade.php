<!DOCTYPE html>
<html lang="id">
<head>
    @include('bank-mini.partials.head', ['judul' => $judul ?? 'Masuk'])
</head>
<body class="min-h-screen bg-kanvas font-sans text-slate-800 antialiased">
    <main class="flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div class="w-full max-w-[400px]">
            <div class="mb-6 flex justify-center">
                <x-bank-mini.brand size="lg" />
            </div>
            @yield('konten')
        </div>
    </main>
</body>
</html>
