// Konfigurasi & helper SADA chatbot (di luar komponen agar murni dan mudah diuji)

export const SADA_AVATAR = "/images/sada-avatar.svg";

export const QUICK_PROMPTS = [
  { label: "Jurusan SMKN 2", prompt: "Apa saja program keahlian / jurusan di SMKN 2 Mojokerto?" },
  { label: "Info PPDB", prompt: "Bagaimana jalur dan syarat pendaftaran PPDB di SMKN 2 Mojokerto?" },
  { label: "Fasilitas & Lab", prompt: "Fasilitas dan laboratorium apa saja yang tersedia di SMKN 2?" },
  { label: "Denah Interaktif", prompt: "Bagaimana cara melihat dan mencari rute denah ruangan di website ini?" },
  { label: "Ekstrakurikuler", prompt: "Apa saja kegiatan ekstrakurikuler unggulan di SMKN 2 Mojokerto?" },
  { label: "Kontak & Lokasi", prompt: "Di mana alamat dan kontak resmi SMK Negeri 2 Kota Mojokerto?" },
];

const BLOCKED_WORDS = [
  "anjing",
  "babi",
  "bangsat",
  "kontol",
  "memek",
  "jembut",
  "tolol",
  "goblok",
  "bajingan",
  "pantek",
  "kampret",
  "asu",
  "bgst",
  "idiot",
  "lonte",
  "ngentot",
];

export const WELCOME_TEXT =
  "Halo! 👋\nSelamat datang di Roomchat **SADA**.\nAda yang bisa saya bantu seputar jurusan, denah ruangan, atau PPDB di SMK Negeri 2 Kota Mojokerto?";

export const POLITE_REPLY =
  "Mohon maaf, SADA hanya bisa membantu dengan bahasa yang santun 😊\n\nAda yang bisa SADA bantu terkait jurusan, fasilitas, atau pendaftaran PPDB?";

let counter = 0;

export function createMessage(role, content, extra = {}) {
  counter += 1;
  return {
    id: `${role}-${counter}`,
    role,
    content,
    time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    ...extra,
  };
}

export const containsBlockedWord = (text) => {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some((word) => new RegExp(`\\b${word}\\b`).test(lower));
};

/** Batas 5 pesan per menit; mengembalikan detik tunggu atau 0 bila boleh. */
export function createRateLimiter(limit = 5, windowMs = 60000) {
  let stamps = [];
  return () => {
    const now = Date.now();
    stamps = stamps.filter((stamp) => now - stamp < windowMs);
    if (stamps.length >= limit) return Math.ceil((windowMs - (now - stamps[0])) / 1000);
    stamps.push(now);
    return 0;
  };
}

/** Tombol aksi denah bila balasan API menyebut ruangan/rute. */
export function extractAction(response) {
  if (response?.room_slug || response?.target_room) {
    return { type: "select-room", slug: response.room_slug || response.target_room, label: "Lihat di Denah Interaktif" };
  }
  if (response?.route_from && response?.route_to) {
    return { type: "show-route", from: response.route_from, to: response.route_to, label: "Tampilkan rute di denah" };
  }
  return null;
}

export function runAction(action) {
  if (!action) return;
  if (action.type === "select-room") {
    window.dispatchEvent(new CustomEvent("sada:select-room", { detail: { slug: action.slug } }));
  } else if (action.type === "show-route") {
    window.dispatchEvent(new CustomEvent("sada:show-route", { detail: { from: action.from, to: action.to } }));
  }
}
