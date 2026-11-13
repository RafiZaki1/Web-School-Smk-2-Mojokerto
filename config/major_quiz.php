<?php

return [

    'use_ai' => (bool) env('MAJOR_QUIZ_USE_AI', true),

    'alternative_min_percentage' => 40,

    'estimated_minutes' => '3-5',

    'answer_max_length' => 500,

    'daily_limit_per_ip' => (int) env('MAJOR_QUIZ_DAILY_LIMIT_PER_IP', 3),
    'daily_limit_total' => (int) env('MAJOR_QUIZ_DAILY_LIMIT_TOTAL', 300),

    'questions' => [
        [
            'id' => 1,
            'question' => 'Kalau kamu dikasih modal dan alat lengkap buat bikin satu karya atau produk sendiri, kamu paling pengen bikin apa? (Misal: bikin aplikasi/game, desain poster/video keren, racik makanan/minuman kemasan unik, masak menu spesial, atau bikin usaha jasa keuangan?)',
            'hint' => 'Jawab apa adanya, misalnya: pengen bikin aplikasi absensi buat sekolah.',
            'required' => true,
            'weight' => 2,
        ],
        [
            'id' => 2,
            'question' => 'Bayangkan sekolah mau ngadain acara bazar besar. Kamu paling semangat kalau kebagian tugas apa? (Misal: ngurus uang kas & catat laba-rugi, desain dekorasi & promosi medsos, bikin sistem web pemesanan, masak hidangan utama di dapur, atau ngolah bahan mentah jadi jajanan awet?)',
            'hint' => 'Misalnya: pegang uang kas, atau masak hidangan utama.',
            'required' => true,
            'weight' => 1,
        ],
        [
            'id' => 3,
            'question' => 'Kalau lagi santai di rumah atau di sekolah, aktivitas produktif apa yang paling bikin kamu betah: ngutak-atik sistem HP/komputer, gambar/ngedit foto & video, eksperimen meracik bahan makanan, atau ngerapihin catatan dan hitungan uang?',
            'hint' => 'Misalnya: ngedit video, atau ngerapihin catatan keuangan.',
            'required' => true,
            'weight' => 2,
        ],
        [
            'id' => 4,
            'question' => 'Saat kamu main game, nonton YouTube/TikTok, atau jajan di luar, hal apa yang pernah bikin kamu mikir "Kok bisa ya orang bikin kayak gini?" dan bikin kamu penasaran pengen nyoba bikin sendiri?',
            'hint' => 'Misalnya: penasaran cara bikin animasi, atau resep kue yang ditonton.',
            'required' => true,
            'weight' => 1,
        ],
        [
            'id' => 5,
            'question' => 'Masalah seperti apa yang paling seru buat kamu pecahkan sampai tuntas? (Nyari letak error di HP/aplikasi, nyocokin hitungan uang yang selisih, nyari komposisi warna/gambar yang pas, atau nyoba-nyoba takaran resep sampai rasanya pas?)',
            'hint' => 'Misalnya: nyari kenapa aplikasi error, atau takaran resep yang pas.',
            'required' => true,
            'weight' => 2,
        ],
        [
            'id' => 6,
            'question' => 'Bayangkan beberapa tahun lagi kamu lulus dan bekerja. Kamu lebih betah kerja rapi di kantor perbankan, duduk fokus ngoding/desain di depan layar komputer, sibuk berkreasi di dapur restoran/hotel, atau meneliti kualitas produk pangan di laboratorium/pabrik?',
            'hint' => 'Jawab tempat kerja yang kamu bayangkan.',
            'required' => true,
            'weight' => 1,
        ],
        [
            'id' => 7,
            'question' => 'Saat mengerjakan sesuatu, kamu lebih suka bekerja mengikuti prosedur/aturan hitung yang pasti, mencari celah logika teknologi, bebas berekspresi secara visual, atau praktik fisik langsung menghasilkan produk makanan?',
            'hint' => 'Pilih yang paling kamu rasakan, dan ceritakan alasannya.',
            'required' => true,
            'weight' => 1,
        ],
    ],

    'majors' => [
        'rpl' => [
            'focus' => 'Logika pemrograman (coding), pembuatan aplikasi web/mobile/game, manajemen database, sistem komputer, dan pemecahan masalah teknis (debugging/troubleshooting).',
            'why_match' => 'Jawabanmu menunjukkan kamu suka membuat sesuatu dengan logika dan mencari penyebab masalah teknis. Di RPL kamu akan belajar membangun website, aplikasi mobile, dan database dari nol.',
            'alternative_why_match' => 'Ketertarikanmu pada logika dan cara kerja sistem cukup terlihat, jadi RPL layak kamu pertimbangkan juga.',
            'keywords' => ['coding', 'ngoding', 'koding', 'pemrograman', 'programmer', 'program', 'aplikasi', 'website', 'web', 'software', 'developer', 'database', 'debugging', 'error', 'bug', 'sistem', 'logika', 'informatika', 'robot', 'hacker', 'ngulik'],
        ],
        'dkv' => [
            'focus' => 'Kreativitas visual, desain grafis, ilustrasi, fotografi, videografi/editing, animasi, tipografi, dan menyampaikan pesan lewat karya visual.',
            'why_match' => 'Jawabanmu menunjukkan sisi kreatif yang kuat, terutama soal gambar, desain, atau video. DKV adalah tempat untuk mengasah kreativitas itu menjadi keahlian desain profesional.',
            'alternative_why_match' => 'Sisi kreatif dan selera visualmu cukup menonjol, jadi DKV bisa menjadi pilihan alternatif.',
            'keywords' => ['gambar', 'menggambar', 'desain', 'design', 'desainer', 'editing', 'ngedit', 'poster', 'ilustrasi', 'animasi', 'fotografi', 'videografi', 'lukis', 'melukis', 'sketsa', 'tipografi', 'warna', 'kreatif'],
        ],
        'boga' => [
            'focus' => 'Seni memasak dapur (kitchen), pembuatan kue dan roti (pastry & bakery), penyajian makanan (plating), kreasi resep hidangan siap saji, serta operasional restoran/perhotelan.',
            'why_match' => 'Dari jawabanmu, kamu tertarik pada proses memasak, meracik resep, dan menyajikan hidangan. Di Tata Boga kamu akan belajar memasak, membuat kue dan roti, hingga mengelola dapur restoran.',
            'alternative_why_match' => 'Kamu juga terlihat tertarik pada proses meracik dan memasak, jadi Tata Boga patut dipertimbangkan.',
            'keywords' => ['masak', 'memasak', 'masakan', 'kue', 'baking', 'resep', 'dapur', 'chef', 'koki', 'pastry', 'roti', 'plating', 'katering', 'catering', 'racik', 'meracik', 'takaran', 'bumbu'],
        ],
        'aphp' => [
            'focus' => 'Teknologi pengolahan pangan, mengubah bahan mentah pertanian/perikanan menjadi produk kemasan bernilai jual tinggi dan tahan lama, pengawetan, uji mutu laboratorium pangan, dan produksi skala industri.',
            'why_match' => 'Jawabanmu menunjukkan ketertarikan pada proses mengolah bahan menjadi produk yang tahan lama dan siap jual. APHP membekalimu mengolah hasil pertanian dan perikanan menjadi produk kemasan.',
            'alternative_why_match' => 'Rasa ingin tahumu terhadap proses pengolahan bahan cukup tinggi, jadi APHP juga cocok untukmu.',
            'keywords' => ['olahan', 'mengolah', 'pengolahan', 'keripik', 'selai', 'kemasan', 'pengawetan', 'awet', 'pangan', 'laboratorium', 'lab', 'uji', 'produksi', 'pabrik', 'umkm', 'kimia', 'biologi', 'eksperimen', 'mutu'],
        ],
        'lps' => [
            'focus' => 'Manajemen keuangan, akuntansi perbankan, ketelitian administrasi, layanan nasabah (teller/customer service), pengelolaan kas, dan ekonomi syariah.',
            'why_match' => 'Jawabanmu menunjukkan kamu rapi dengan data dan angka, teliti mencatat keuangan, dan nyaman melayani orang. LPS menyiapkanmu bekerja di perbankan dan keuangan syariah.',
            'alternative_why_match' => 'Kamu cukup nyaman dengan angka dan pelayanan, jadi LPS bisa menjadi pilihan lain.',
            'keywords' => ['akuntansi', 'akuntan', 'pembukuan', 'laporan', 'laba', 'rugi', 'kas', 'bendahara', 'menghitung', 'hitung', 'kasir', 'teller', 'bank', 'perbankan', 'keuangan', 'administrasi', 'syariah', 'melayani', 'nasabah'],
        ],
    ],
];
