<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key') ?? '';
    }

    public function analyze(string $prompt, string $cacheKey)
    {
        // 1. Check cache FIRST (Do not use Cache::remember to avoid caching failures)
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        // 2. Prevent silent failures if API key is missing
        if (empty($this->apiKey)) {
            Log::error('Gemini API Error: API Key is missing from .env file.');
            return null;
        }

        try {
            $models = config('services.gemini.models', [
                'models/gemini-2.5-flash',
                'models/gemini-2.0-flash',
            ]);
            $maxAttempts = (int) config('services.gemini.max_attempts', 3);
            $timeout = (int) config('services.gemini.timeout', 30);

            foreach ($models as $model) {
                for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
                    $url = "https://generativelanguage.googleapis.com/v1beta/{$model}:generateContent?key={$this->apiKey}";

                    $response = Http::timeout($timeout)->post($url, [
                        'contents' => [[
                            'parts' => [[
                                'text' => $prompt . "\n\nReturn ONLY valid JSON. No explanation, no markdown formatting.",
                            ]],
                        ]],
                    ]);

                    if ($response->ok()) {
                        $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? null;

                        if (! $text) {
                            break;
                        }

                        // Clean markdown wrappers if model accidentally returns fenced JSON.
                        $clean = preg_replace('/```json|```/i', '', trim($text));
                        $parsed = json_decode($clean, true);

                        // Cache any valid JSON object/array. Controllers validate required keys.
                        if (is_array($parsed) && ! empty($parsed)) {
                            Cache::put($cacheKey, $parsed, now()->addDays(7));
                            return $parsed;
                        }

                        break;
                    }

                    $status = $response->status();
                    $body = $response->body();

                    // Retry transient overload/server failures with exponential backoff.
                    if (in_array($status, [429, 500, 502, 503, 504], true) && $attempt < $maxAttempts) {
                        Log::warning("Gemini transient failure ({$status}) on {$model}, attempt {$attempt}. Retrying...");
                        usleep((int) (250000 * (2 ** ($attempt - 1))));
                        continue;
                    }

                    Log::error("Gemini API Request Failed ({$status}) [{$model}]: {$body}");
                    break;
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Gemini API Exception: ' . $e->getMessage());
            return null;
        }
    }
}
