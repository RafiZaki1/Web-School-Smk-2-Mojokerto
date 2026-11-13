export type ChatRole = "user" | "bot";

export type ChatAction =
  | { type: "select-room"; slug: string; label: string }
  | { type: "show-route"; from: string; to: string; label: string };

// Satu pesan di percakapan SADA (dan chat kuis jurusan).
export interface ChatMessageItem {
  id: number | string;
  role: ChatRole;
  content: string;
  time?: string;
  hint?: string;
  error?: boolean;
  action?: ChatAction | null;
  resultCode?: string;
}

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

// Respons API chatbot. Bentuknya bisa membawa aksi denah.
export interface ChatbotResponse {
  reply?: string;
  answer?: string;
  room_slug?: string;
  target_room?: string;
  route_from?: string;
  route_to?: string;
}
