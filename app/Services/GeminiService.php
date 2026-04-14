<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $model = 'models/gemini-2.5-flash';

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
            $url = "https://generativelanguage.googleapis.com/v1beta/{$this->model}:generateContent?key={$this->apiKey}";

            // Increased timeout to 30 seconds for long workout generation
            $response = Http::timeout(30)->post($url, [
                'contents' => [['parts' => [['text' => $prompt."\n\nReturn ONLY valid JSON. No explanation, no markdown formatting."]]]],
            ]);

            if ($response->failed()) {
                Log::error('Gemini API Request Failed: ' . $response->body());
                return null;
            }

            $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$text) {
                return null;
            }

            // Clean the response from markdown block ticks if the AI accidentally includes them
            $clean = preg_replace('/```json|```/i', '', trim($text));
            $parsed = json_decode($clean, true);

            // 3. ONLY cache if the JSON was successfully parsed
            if ($parsed && isset($parsed['title']) && isset($parsed['description'])) {
                Cache::put($cacheKey, $parsed, now()->addDays(7));
                return $parsed;
            }

            return null;

        } catch (\Exception $e) {
            Log::error('Gemini API Exception: ' . $e->getMessage());
            return null;
        }
    }
}
