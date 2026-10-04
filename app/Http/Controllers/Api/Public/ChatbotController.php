<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\ChatbotServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Controller Chatbot AI Versi Awal (Tahap Seleksi Lomba)
 * 
 * Menerima pertanyaan pengguna dari form website,
 * meneruskan ke layanan AI, dan mengembalikan respons dasar.
 */
class ChatbotController extends Controller
{
    public function __construct(
        protected ChatbotServiceInterface $chatbotService
    ) {}

    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|min:1|max:500',
            'history' => 'nullable|array',
            'history.*.role' => 'nullable|string',
            'history.*.content' => 'nullable|string',
        ]);

        $message = trim($validated['message']);
        $history = $validated['history'] ?? [];

        try {
            $result = $this->chatbotService->sendMessage($message, $history);

            return ApiResponse::success(
                $result,
                'Chatbot response received successfully'
            );
        } catch (Throwable $e) {
            return ApiResponse::error(
                'Gagal memproses pesan: ' . $e->getMessage(),
                null,
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
