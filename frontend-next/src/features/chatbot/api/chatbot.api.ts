import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { ChatbotResponse, ChatHistoryItem } from "../types/chatbot.type";

// Kirim satu pesan ke SADA beserta riwayat singkat percakapan.
export const postChatbotMessageApi = async (message: string, history: ChatHistoryItem[] = []): Promise<ChatbotResponse> => {
  const { data } = await http.post<ApiEnvelope<ChatbotResponse>>("/api/v1/public/chatbot", { message, history });
  return data.data;
};
