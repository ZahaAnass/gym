<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('Coach/Programs/Index', [
            'programs' => auth()->user()->programs()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'is_ai_generated' => 'boolean',
        ]);

        auth()->user()->programs()->create($validated);

        return back()->with('success', 'Programme d\'entraînement enregistré.');
    }

    public function generateAI(Request $request, GeminiService $gemini)
    {
        $request->validate(['notes' => 'required|string']);

        $prompt = 'Create a workout program based on: '.$request->notes.'. Return ONLY valid JSON in this exact format: {"title": "string", "description": "detailed string with line breaks"}';
        $cacheKey = 'ai_prog_'.md5($request->notes);

        $result = $gemini->analyze($prompt, $cacheKey);

        return response()->json($result);
    }
}
