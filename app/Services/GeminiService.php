<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

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
        return Cache::remember($cacheKey, now()->addDays(7), function () use ($prompt) {
            if (! $this->apiKey) {
                return null;
            }

            $url = "https://generativelanguage.googleapis.com/v1beta/{$this->model}:generateContent?key={$this->apiKey}";

            $response = Http::timeout(15)->post($url, [
                'contents' => [['parts' => [['text' => $prompt."\n\nReturn ONLY valid JSON. No explanation."]]]],
            ]);

            if ($response->failed()) {
                return null;
            }

            $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? null;
            if (! $text) {
                return null;
            }

            $clean = preg_replace('/```json|```/', '', trim($text));

            return json_decode($clean, true);
        });
    }
}
