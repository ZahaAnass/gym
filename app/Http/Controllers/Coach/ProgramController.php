<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $coach = $request->user();
        $query = $coach->programs();

        // 1. Search Filtering
        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        // 2. Redis Caching for Coach Stats (Improves dashboard load times)
        $stats = Cache::remember("coach:{$coach->id}:programs_stats", 300, function () use ($coach) {
            return [
                'total' => $coach->programs()->count(),
                'ai_generated' => $coach->programs()->where('is_ai_generated', true)->count(),
                'manual' => $coach->programs()->where('is_ai_generated', false)->count(),
            ];
        });

        return Inertia::render('Coach/Programs/Index', [
            'programs' => $query->latest()->paginate(12)->withQueryString(),
            'filters' => $request->only(['search']),
            'stats' => $stats
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'is_ai_generated' => 'boolean',
            'client_id' => 'nullable|exists:users,id',
        ]);

        // 🔥 FIX: Explicitly merge the coach_id so it is never null!
        $programData = array_merge($validated, [
            'coach_id' => $request->user()->id,
        ]);

        // 1. Create the program in the coach's library
        $program = Program::create($programData);

        // 2. If it was generated for a specific client, assign it immediately
        if (! empty($validated['client_id'])) {
            $program->clients()->attach($validated['client_id']);
            Cache::forget("coach:{$request->user()->id}:programs_stats");

            return redirect()->route('coach.clients.show', $validated['client_id'])
                ->with('success', 'AI Program generated and successfully assigned to the client!');
        }

        Cache::forget("coach:{$request->user()->id}:programs_stats");

        return redirect()->route('coach.programs.index')->with('success', 'Workout program successfully saved to library.');
    }

    public function destroy(Program $program, Request $request)
    {
        if ($program->coach_id !== $request->user()->id) {
            abort(403);
        }

        $program->delete();
        Cache::forget("coach:{$request->user()->id}:programs_stats");

        return back()->with('success', 'Program deleted successfully.');
    }

    /**
     * 🔥 THE WOW FACTOR: Advanced Prompt Engineering with Gemini
     */
    public function generateAI(Request $request, GeminiService $gemini)
    {
        // Require specific fitness parameters for a better AI response
        $request->validate([
            'goal' => 'required|string|max:100',
            'level' => 'required|string|max:50',
            'days' => 'required|integer|min:1|max:7',
            'equipment' => 'required|string|max:100',
            'notes' => 'nullable|string|max:500'
        ]);

        // Construct a highly specific prompt to force Gemini into "Elite Coach" mode
        $prompt = sprintf(
            "Act as an elite sports scientist and personal trainer. Create a highly effective workout program based on the following client constraints:\n" .
            "- Primary Goal: %s\n" .
            "- Fitness Level: %s\n" .
            "- Days per week available: %d\n" .
            "- Available Equipment: %s\n" .
            "- Medical/Additional Notes: %s\n\n" .
            "You MUST return ONLY a valid JSON object with absolutely no markdown formatting or extra text. The JSON must have exactly these two keys:\n" .
            "1. 'title': A catchy, professional name for the program (string).\n" .
            "2. 'description': The detailed day-by-day workout plan, including exercises, sets, and reps. Use \\n for line breaks to make it readable (string).",
            $request->goal, $request->level, $request->days, $request->equipment, $request->notes ?? 'None'
        );

        // Cache the AI response for 7 days based on the exact prompt hash
        $cacheKey = 'ai_prog_' . md5($prompt);
        $result = $gemini->analyze($prompt, $cacheKey);

        if (!$result || !isset($result['title']) || !isset($result['description'])) {
            return response()->json(['error' => 'AI Generation failed to return the correct format. Please try again.'], 500);
        }

        return response()->json($result);
    }
}
