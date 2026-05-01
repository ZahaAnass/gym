<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\User;
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

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

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

    // Added the create method so /coach/programs/create works!
    public function create(Request $request)
    {
        $client = null;

        if ($request->has('client_id')) {
            $client = User::findOrFail($request->client_id);
            if ($client->coach_id !== $request->user()->id) abort(403);
        }

        return Inertia::render('Coach/Programs/Create', [
            'client' => $client,
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

        // 🔥 FIX: We must set coach_id explicitly when making the new program
        $programData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'is_ai_generated' => $validated['is_ai_generated'] ?? false,
            'coach_id' => $request->user()->id
        ];

        // 1. Save to Coach's Library
        $program = Program::create($programData);

        Cache::forget("coach:{$request->user()->id}:programs_stats");

        // 2. If generating for a specific client, assign it!
        if (!empty($validated['client_id'])) {
            $client = User::findOrFail($validated['client_id']);
            $client->assignedPrograms()->attach($program->id);

            return redirect()->route('coach.clients.show', $client->id)
                ->with('success', 'AI Program successfully generated and assigned!');
        }

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

    public function generateAI(Request $request, GeminiService $gemini)
    {
        $request->validate([
            'goal' => 'required|string|max:100',
            'level' => 'required|string|max:50',
            'days' => 'required|integer|min:1|max:7',
            'equipment' => 'required|string|max:100',
            'notes' => 'nullable|string|max:500'
        ]);

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

        $cacheKey = 'ai_prog_' . md5($prompt);
        $result = $gemini->analyze($prompt, $cacheKey);

        if (!$result || !isset($result['title']) || !isset($result['description'])) {
            return response()->json(['error' => 'AI Generation failed to return the correct format. Please try again.'], 500);
        }

        return response()->json($result);
    }
}
