<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\ChatbotServiceInterface;
use App\Exceptions\RequestBlockedException;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChatbotMessageRequest;
use App\Services\LandingPage\ChatbotGuard;
use Illuminate\Http\JsonResponse;
use Throwable;

class ChatbotController extends Controller
{
    /**
     * Inisialisasi ChatbotController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected ChatbotServiceInterface $chatbotService,
        protected ChatbotGuard $guard,
    ) {}

    /**
     * Kirim pesan ke chatbot setelah melewati seluruh lapisan anti-spam.
     */
    public function send(ChatbotMessageRequest $request): JsonResponse
    {
        $ip = $request->ip() ?? 'unknown';
        $message = trim($request->validated('message'));

        try {
            $this->guard->ensureNotSpam($ip, $message);

            if ($this->guard->containsProfanity($message)) {
                return ResponseHelper::success($this->guard->gentleReply(), trans('alert.chatbot_replied'));
            }

            $this->guard->remember($ip, $message);
            $this->guard->enforceDailyLimits($ip);

            return ResponseHelper::success(
                $this->chatbotService->sendMessage($message, $request->validated('history') ?? []),
                trans('alert.chatbot_replied')
            );
        } catch (RequestBlockedException $th) {
            return ResponseHelper::error($th->data(), $th->getMessage(), $th->statusCode());
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
