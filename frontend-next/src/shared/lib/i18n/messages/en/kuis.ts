/** Kuis minat jurusan: halaman kuis, percakapan dengan SADA, dan halaman hasil. */
export const kuisMessages: Record<string, string> = {
  "Kuis Pilih Jurusan - SMKN 2 Kota Mojokerto": "Major Selection Quiz - SMKN 2 Mojokerto",
  "Ngobrol singkat dengan SADA tentang hobi dan minatmu untuk menemukan jurusan yang paling cocok di SMKN 2 Kota Mojokerto.":
    "Have a quick chat with SADA about your hobbies and interests to find the best-fitting major at SMKN 2 Mojokerto.",
  "Kuis Minat": "Interest Quiz",
  "Bingung pilih jurusan? Ngobrol dulu yuk!": "Not sure which major to pick? Let's chat first!",
  "SADA akan menanyakan beberapa hal tentang hobi dan minatmu. Ceritakan dengan kata-katamu sendiri, lalu kami cocokkan dengan jurusan yang paling sesuai. Nama dan email boleh dikosongkan.":
    "SADA will ask a few things about your hobbies and interests. Tell us in your own words, and we'll match you with the most suitable major. Name and email are optional.",
  "{jumlah} Pertanyaan": "{jumlah} Questions",
  "Dijawab dengan kata-katamu sendiri": "Answered in your own words",
  "{jumlah} Menit": "{jumlah} Minutes",
  "Santai, seperti chatting": "Relaxed, just like chatting",
  "{jumlah} Jurusan": "{jumlah} Majors",

  // Percakapan
  "Ngobrol dengan SADA": "Chat with SADA",
  "{jawab}/{total} pertanyaan": "{jawab}/{total} questions",
  "Mulai ulang kuis": "Restart quiz",
  "Server sedang tidak bisa dihubungi. Kamu tetap bisa menjawab, tetapi hasil baru bisa dihitung setelah server kembali normal.":
    "The server can't be reached right now. You can still answer, but results can only be calculated once the server is back.",
  "Ketik nama kamu...": "Type your name...",
  "Ketik email kamu...": "Type your email...",
  "Ketik jawabanmu...": "Type your answer...",
  "Hai! Aku **SADA** 👋 Aku bakal bantu kamu menemukan jurusan yang cocok lewat obrolan singkat.\n\nAda {total} pertanyaan tentang hobi dan minatmu. Jawab saja dengan kata-katamu sendiri, tidak ada jawaban benar atau salah.":
    "Hi! I'm **SADA** 👋 I'll help you find the right major through a short chat.\n\nThere are {total} questions about your hobbies and interests. Just answer in your own words—there are no right or wrong answers.",
  "Sebelum mulai, boleh tahu nama kamu? Kalau tidak mau, tekan **Lewati** saja.": "Before we start, may I know your name? If you'd rather not, just press **Skip**.",
  "Pertanyaan {nomor} dari {total}": "Question {nomor} of {total}",
  "Senang kenalan, **{nama}**!": "Nice to meet you, **{nama}**!",
  "Oke, tidak apa-apa!": "Okay, no problem!",
  "Kalau mau, tulis email kamu supaya hasilnya gampang dicari lagi. Boleh juga dilewati.": "If you like, enter your email so your result is easy to find again. You can also skip this.",
  "Sip! Kita mulai ya.": "Great! Let's begin.",
  "Sepertinya format emailnya belum benar, misalnya **nama@email.com**. Coba ketik lagi, atau tekan **Lewati**.":
    "That email doesn't look right—for example **name@email.com**. Try typing it again, or press **Skip**.",
  "Makasih sudah cerita! Tunggu sebentar ya, aku cocokkan jawabanmu dengan jurusan yang ada...":
    "Thanks for sharing! Give me a moment while I match your answers with our majors...",
  "Hasilnya sudah keluar! 🎉 Jurusan yang paling cocok untuk {nama}:": "Your result is in! 🎉 The best-fitting major for {nama}:",
  "Hasilnya sudah keluar! 🎉 Jurusan yang paling cocok untukmu:": "Your result is in! 🎉 The best-fitting major for you:",
  "{persen}% cocok": "{persen}% match",
  "**Kenapa bisa {persen}%?** {cocok} dari {total} jawabanmu berkaitan dengan {kode}, totalnya {poin} dari {maks} poin ({poin} ÷ {maks} × 100%). Rincian tiap jurusan ada di hasil lengkap.":
    "**Why {persen}%?** {cocok} of your {total} answers relate to {kode}, for a total of {poin} out of {maks} points ({poin} ÷ {maks} × 100%). The breakdown for every major is in the full result.",
  "Kode hasilmu: **{kode}**\nSimpan kode ini untuk membuka lagi jawaban dan hasilmu kapan saja. Guru BK juga akan meninjau hasil ini.":
    "Your result code: **{kode}**\nKeep this code to reopen your answers and result anytime. A school counselor will also review this result.",
  "Maaf, jawabanmu gagal dikirim. Coba kirim ulang ya.": "Sorry, your answers couldn't be sent. Please try again.",
  "Lihat hasil lengkap": "View full result",
  "Jawaban untuk: {soal}": "Answer for: {soal}",
  "Kirim ulang jawaban": "Resend answers",
  "Mulai kuis baru": "Start a new quiz",
  "SADA sedang mencocokkan jawabanmu...": "SADA is matching your answers...",

  // Pertanyaan (sama dengan config/major_quiz.php)
  "Kalau kamu dikasih modal dan alat lengkap buat bikin satu karya atau produk sendiri, kamu paling pengen bikin apa? (Misal: bikin aplikasi/game, desain poster/video keren, racik makanan/minuman kemasan unik, masak menu spesial, atau bikin usaha jasa keuangan?)":
    "If you were given the budget and all the tools to make your own creation or product, what would you most want to make? (For example: an app/game, a cool poster/video, a unique packaged food/drink, a special dish, or a financial services business?)",
  "Jawab apa adanya, misalnya: pengen bikin aplikasi absensi buat sekolah.": "Answer honestly, for example: I want to build an attendance app for school.",
  "Bayangkan sekolah mau ngadain acara bazar besar. Kamu paling semangat kalau kebagian tugas apa? (Misal: ngurus uang kas & catat laba-rugi, desain dekorasi & promosi medsos, bikin sistem web pemesanan, masak hidangan utama di dapur, atau ngolah bahan mentah jadi jajanan awet?)":
    "Imagine the school is holding a big bazaar. Which task would you be most excited to get? (For example: managing the cash & recording profit and loss, designing decorations & social media promos, building a web ordering system, cooking the main dishes, or turning raw ingredients into long-lasting snacks?)",
  "Misalnya: pegang uang kas, atau masak hidangan utama.": "For example: handling the cash, or cooking the main dishes.",
  "Kalau lagi santai di rumah atau di sekolah, aktivitas produktif apa yang paling bikin kamu betah: ngutak-atik sistem HP/komputer, gambar/ngedit foto & video, eksperimen meracik bahan makanan, atau ngerapihin catatan dan hitungan uang?":
    "When you're relaxing at home or school, which productive activity keeps you hooked the most: tinkering with phone/computer systems, drawing/editing photos & videos, experimenting with food ingredients, or tidying up notes and money calculations?",
  "Misalnya: ngedit video, atau ngerapihin catatan keuangan.": "For example: editing videos, or organizing financial notes.",
  'Saat kamu main game, nonton YouTube/TikTok, atau jajan di luar, hal apa yang pernah bikin kamu mikir "Kok bisa ya orang bikin kayak gini?" dan bikin kamu penasaran pengen nyoba bikin sendiri?':
    'When you play games, watch YouTube/TikTok, or buy snacks, what has ever made you think "How do people make this?" and made you curious to try making it yourself?',
  "Misalnya: penasaran cara bikin animasi, atau resep kue yang ditonton.": "For example: curious how animations are made, or a cake recipe you watched.",
  "Masalah seperti apa yang paling seru buat kamu pecahkan sampai tuntas? (Nyari letak error di HP/aplikasi, nyocokin hitungan uang yang selisih, nyari komposisi warna/gambar yang pas, atau nyoba-nyoba takaran resep sampai rasanya pas?)":
    "What kind of problem is the most fun for you to solve completely? (Finding the error in a phone/app, reconciling money totals that don't match, finding the right color/image composition, or trying recipe measurements until the taste is just right?)",
  "Misalnya: nyari kenapa aplikasi error, atau takaran resep yang pas.": "For example: finding why an app errors, or the right recipe measurements.",
  "Bayangkan beberapa tahun lagi kamu lulus dan bekerja. Kamu lebih betah kerja rapi di kantor perbankan, duduk fokus ngoding/desain di depan layar komputer, sibuk berkreasi di dapur restoran/hotel, atau meneliti kualitas produk pangan di laboratorium/pabrik?":
    "Imagine you've graduated and are working a few years from now. Would you rather work neatly in a bank office, focus on coding/design at a computer screen, get creative in a restaurant/hotel kitchen, or research food product quality in a lab/factory?",
  "Jawab tempat kerja yang kamu bayangkan.": "Describe the workplace you imagine.",
  "Saat mengerjakan sesuatu, kamu lebih suka bekerja mengikuti prosedur/aturan hitung yang pasti, mencari celah logika teknologi, bebas berekspresi secara visual, atau praktik fisik langsung menghasilkan produk makanan?":
    "When working on something, do you prefer following clear procedures/calculation rules, finding logical loopholes in technology, expressing yourself freely through visuals, or hands-on work producing food products?",
  "Pilih yang paling kamu rasakan, dan ceritakan alasannya.": "Choose what feels most like you, and explain why.",

  // Cek hasil
  "Sudah pernah mengisi?": "Already took the quiz?",
  "Masukkan kode hasil yang kamu terima untuk melihat kembali jawaban dan rekomendasi jurusanmu.":
    "Enter the result code you received to view your answers and major recommendation again.",
  "Kode hasil kuis": "Quiz result code",
  "Contoh: K7MX2QPA": "Example: K7MX2QPA",
  "Lihat Hasil": "View Result",
  "Riwayat di perangkat ini": "History on this device",
  "Tanpa nama": "Unnamed",
  "Kode {kode}": "Code {kode}",
  "Salin link hasil kuis:": "Copy the quiz result link:",
  "Link tersalin": "Link copied",
  "Salin link hasil": "Copy result link",

  // Halaman hasil
  "Hasil Kuis Jurusan": "Major Quiz Result",
  "Kembali ke kuis": "Back to the quiz",
  "Hasil kuis belum bisa dimuat karena server sedang tidak bisa dihubungi. Coba muat ulang halaman ini beberapa saat lagi.":
    "The quiz result can't be loaded because the server can't be reached. Try reloading this page in a moment.",
  "Hasil Kuis Minat Jurusan": "Major Interest Quiz Result",
  "Hai {nama}, ini jurusan yang cocok untukmu": "Hi {nama}, here's the major that suits you",
  "Ini jurusan yang cocok untukmu": "Here's the major that suits you",
  "Kode hasil:": "Result code:",
  "Diisi {tanggal}": "Submitted {tanggal}",
  "Simpan kode atau link ini untuk membuka kembali hasilmu kapan saja.": "Keep this code or link to reopen your result anytime.",
  "Sudah ditinjau guru BK pada {tanggal}": "Reviewed by a school counselor on {tanggal}",
  "Sudah ditinjau guru BK": "Reviewed by a school counselor",
  "Rekomendasi awal sistem adalah": "The system's initial recommendation was",
  "Setelah ditinjau, jurusan yang disarankan untukmu adalah": "After review, the major recommended for you is",
  "Rekomendasi Guru BK": "Counselor's Recommendation",
  "Rekomendasi Utama": "Top Recommendation",
  kecocokan: "match",
  "Analisis Kecocokan": "Match Analysis",
  "Peluang Karir": "Career Opportunities",
  "Kenapa {kode} cocok untukmu?": "Why does {kode} suit you?",
  "Dari {total} jawabanmu,": "Of your {total} answers,",
  "{jumlah} jawaban": "{jumlah} answers",
  "berkaitan dengan bidang {bidang}": "relate to {bidang}",
  Totalnya: "That totals",
  "{poin} dari {maks} poin": "{poin} of {maks} points",
  "jadi kecocokannya": "so the match is",
  "sehingga kecocokannya {persen}%.": "so the match is {persen}%.",
  "Jurusan {kode} disarankan oleh guru BK setelah meninjau seluruh jawabanmu.": "The {kode} major was recommended by a school counselor after reviewing all your answers.",
  "Jawabanmu belum banyak menyinggung bidang tertentu, jadi {kode} dipilih dari kecocokan tertinggi yang ada.":
    "Your answers didn't point strongly to any one field, so {kode} was chosen as the highest available match.",
  "Opsi Alternatif": "Alternative Option",
  "Lihat jurusan {kode}": "View the {kode} major",
  "Rincian Kecocokan": "Match Breakdown",
  "Hasil ini dibuat dengan versi kuis lama, jadi rincian poinnya belum tersedia. Isi ulang kuis untuk melihat hitungannya.":
    "This result was made with an older quiz version, so a point breakdown isn't available. Retake the quiz to see the calculation.",
  "Cara menghitung persentase": "How the percentage is calculated",
  "Setiap jawabanmu dinilai untuk tiap jurusan:": "Each of your answers is scored for every major:",
  "kalau sangat berkaitan,": "if strongly related,",
  "kalau sedikit berkaitan,": "if slightly related,",
  "kalau tidak berkaitan.": "if unrelated.",
  "Kamu menjawab {jumlah} pertanyaan, jadi poin maksimal tiap jurusan adalah {jumlah} × 2 =":
    "You answered {jumlah} questions, so the maximum points for each major is {jumlah} × 2 =",
  "{jumlah} poin": "{jumlah} points",
  "Persentase = poin yang didapat ÷ {maks} × 100%. Contoh: 6 poin berarti 6 ÷ {maks} × 100% = {contoh}%.":
    "Percentage = points earned ÷ {maks} × 100%. Example: 6 points means 6 ÷ {maks} × 100% = {contoh}%.",
  "Tiap jurusan dihitung terpisah, jadi jumlah semuanya tidak harus 100%. Persentase ini bukan nilai ujian, hanya petunjuk seberapa kuat jawabanmu mengarah ke tiap jurusan.":
    "Each major is calculated separately, so the totals don't need to add up to 100%. This percentage isn't a test score, just an indication of how strongly your answers point to each major.",
  "sangat berkaitan": "strongly related",
  "sedikit berkaitan": "slightly related",
  "{jumlah} jawaban {label} (+{poin})": "{jumlah} {label} answers (+{poin})",
  dan: "and",
  "{poin} dari {maks} poin = {persen}%": "{poin} of {maks} points = {persen}%",
  "dari {rincian}.": "from {rincian}.",
  "tidak ada jawaban yang berkaitan dengan jurusan ini.": "no answers related to this major.",
  "{jumlah} jawaban mengarah ke sini.": "{jumlah} answers point here.",
  "Lihat jawaban yang dihitung": "View the counted answers",
  "Jawaban {nomor}:": "Answer {nomor}:",
  "Jawaban Kamu": "Your Answers",
  "Mengarah ke:": "Points to:",
  "Lihat Jurusan {kode}": "View the {kode} Major",
  "Info Pendaftaran": "Admission Info",
  "Isi Ulang Kuis": "Retake the Quiz",
  "Hasil kuis ini hanya gambaran awal dan akan ditinjau guru BK. Diskusikan juga dengan orang tua, atau":
    "This quiz result is only an initial picture and will be reviewed by a school counselor. Discuss it with your parents too, or",
  "tanya SADA": "ask SADA",
  "asisten virtual sekolah.": "the school's virtual assistant.",

  // Analisis kecocokan (config/major_quiz.php)
  "Jawabanmu menunjukkan kamu suka membuat sesuatu dengan logika dan mencari penyebab masalah teknis. Di RPL kamu akan belajar membangun website, aplikasi mobile, dan database dari nol.":
    "Your answers show you enjoy building things with logic and tracking down the causes of technical problems. In RPL you'll learn to build websites, mobile apps, and databases from scratch.",
  "Ketertarikanmu pada logika dan cara kerja sistem cukup terlihat, jadi RPL layak kamu pertimbangkan juga.":
    "Your interest in logic and how systems work stands out, so RPL is worth considering too.",
  "Jawabanmu menunjukkan sisi kreatif yang kuat, terutama soal gambar, desain, atau video. DKV adalah tempat untuk mengasah kreativitas itu menjadi keahlian desain profesional.":
    "Your answers show a strong creative side, especially in drawing, design, or video. DKV is the place to sharpen that creativity into professional design skills.",
  "Sisi kreatif dan selera visualmu cukup menonjol, jadi DKV bisa menjadi pilihan alternatif.":
    "Your creative side and visual taste stand out, so DKV could be an alternative choice.",
  "Dari jawabanmu, kamu tertarik pada proses memasak, meracik resep, dan menyajikan hidangan. Di Tata Boga kamu akan belajar memasak, membuat kue dan roti, hingga mengelola dapur restoran.":
    "From your answers, you're interested in cooking, creating recipes, and serving dishes. In Culinary Arts you'll learn to cook, make cakes and bread, and even run a restaurant kitchen.",
  "Kamu juga terlihat tertarik pada proses meracik dan memasak, jadi Tata Boga patut dipertimbangkan.":
    "You also seem interested in preparing and cooking food, so Culinary Arts is worth considering.",
  "Jawabanmu menunjukkan ketertarikan pada proses mengolah bahan menjadi produk yang tahan lama dan siap jual. APHP membekalimu mengolah hasil pertanian dan perikanan menjadi produk kemasan.":
    "Your answers show an interest in turning ingredients into long-lasting, ready-to-sell products. APHP equips you to process farm and fishery produce into packaged products.",
  "Rasa ingin tahumu terhadap proses pengolahan bahan cukup tinggi, jadi APHP juga cocok untukmu.":
    "Your curiosity about processing ingredients is high, so APHP suits you too.",
  "Jawabanmu menunjukkan kamu rapi dengan data dan angka, teliti mencatat keuangan, dan nyaman melayani orang. LPS menyiapkanmu bekerja di perbankan dan keuangan syariah.":
    "Your answers show you're organized with data and numbers, careful with financial records, and comfortable serving people. LPS prepares you to work in Islamic banking and finance.",
  "Kamu cukup nyaman dengan angka dan pelayanan, jadi LPS bisa menjadi pilihan lain.": "You're comfortable with numbers and service, so LPS could be another option.",
};
