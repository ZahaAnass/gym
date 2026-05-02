<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Goal;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GoalController extends Controller
{
    private function resolveStatus(Goal $goal, float $currentValue): string
    {
        if ($goal->type !== 'numeric' || $goal->target_value === null) {
            return 'active';
        }

        if ($goal->direction === 'desc') {
            return $currentValue <= (float) $goal->target_value ? 'reached' : 'active';
        }

        return $currentValue >= (float) $goal->target_value ? 'reached' : 'active';
    }

    /**
     * Display a listing of the client's goals and overall statistics.
     */
    public function index(Request $request)
    {
        $goals = $request->user()->goals()->latest()->get();

        return Inertia::render('Client/Goals/Index', [
            'goals' => $goals,
            'stats' => [
                'total' => $goals->count(),
                'active' => $goals->where('status', 'active')->count(),
                'reached' => $goals->where('status', 'reached')->count(),
            ],
        ]);
    }

    /**
     * Store a newly created goal in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'target_value' => 'required|numeric|min:0.1',
            'deadline' => 'required|date|after:today',
        ]);

        $request->user()->goals()->create(array_merge($validated, [
            'type' => 'numeric',
            'direction' => 'asc',
            'current_value' => 0,
            'status' => 'active',
        ]));

        return back()->with('success', 'Goal successfully created! Let\'s get to work.');
    }

    /**
     * Update the client's progress on a specific goal.
     */
    public function update(Request $request, Goal $goal)
    {
        // Security Check: Ensure the client owns this goal
        abort_if($goal->user_id !== $request->user()->id, 403, 'Unauthorized access.');

        $validated = $request->validate([
            'current_value' => 'required|numeric|min:0',
        ]);

        $currentValue = (float) $validated['current_value'];
        $status = $this->resolveStatus($goal, $currentValue);

        $goal->update([
            'current_value' => $currentValue,
            'status' => $status,
            // force fresh AI advice after a progress change
            'ai_strategy_advice' => null,
        ]);

        if ($status === 'reached') {
            return back()->with('success', 'Congratulations on reaching your goal! 🏆');
        }

        return back()->with('success', 'Progress successfully updated.');
    }

    /**
     * Remove the specified goal from the database.
     */
    public function destroy(Goal $goal, Request $request)
    {
        // Security Check: Ensure the client owns this goal
        abort_if($goal->user_id !== $request->user()->id, 403, 'Unauthorized access.');

        $goal->delete();

        return back()->with('success', 'Goal removed from your tracker.');
    }

    /**
     * 🔥 THE WOW FACTOR: Generate AI Advice for a specific Goal
     * This takes the client's target and uses Gemini 2.5 Flash to write a
     * custom, step-by-step strategy on how to achieve it.
     */
    public function getAIAdvice(Goal $goal, Request $request, GeminiService $gemini)
    {
        // Security Check
        abort_if($goal->user_id !== $request->user()->id, 403, 'Unauthorized access.');

        // 1. Construct the Elite Trainer Prompt
        $prompt = sprintf(
            "Act as an elite personal trainer and life coach. Your client has set the following fitness goal:\n".
            "- Goal Title: %s\n".
            "- Target Value: %s\n".
            "- Current Value: %s\n".
            "- Deadline: %s\n\n".
            "Provide a highly motivating, step-by-step actionable strategy (exactly 3 short paragraphs) on exactly what they need to do daily/weekly to achieve this specific target before their deadline. Do not use markdown blocks. Return a valid JSON object with a single key 'description' containing the text string.",
            $goal->title,
            $goal->target_value,
            $goal->current_value,
            $goal->deadline
        );

        // 2. Fetch AI Response (Cached uniquely for this specific goal state)
        // Note: The unique cache key includes current_value so if they update their progress, they can get fresh advice!
        $cacheKey = 'goal_advice_'.$goal->id.'_val_'.$goal->current_value;
        $result = $gemini->analyze($prompt, $cacheKey);

        if (! $result || ! isset($result['description'])) {
            return back()->with('error', 'The AI Coach is currently busy. Please try again in a moment.');
        }

        // 3. Save the generated AI advice directly to the goal record
        $goal->update([
            'ai_strategy_advice' => $result['description'],
        ]);

        return back()->with('success', 'Gemini AI has generated your personalized action plan!');
    }
}
