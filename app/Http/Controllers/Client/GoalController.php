<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Goal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GoalController extends Controller
{
    public function index()
    {
        $goals = auth()->user()->goals()->latest()->get();

        return Inertia::render('Client/Goals/Index', [
            'goals' => $goals,
            'stats' => [
                'total' => $goals->count(),
                'active' => $goals->where('status', 'active')->count(),
                'reached' => $goals->where('status', 'reached')->count(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'target_value' => 'required|numeric',
            'deadline' => 'required|date|after:today',
        ]);

        auth()->user()->goals()->create(array_merge($validated, [
            'current_value' => 0,
            'status' => 'active'
        ]));

        return back()->with('success', 'Goal successfully created! Let\'s get to work.');
    }

    public function update(Request $request, Goal $goal)
    {
        if ($goal->user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'current_value' => 'required|numeric',
            'status' => 'required|in:active,reached,failed'
        ]);

        $goal->update($validated);

        if ($validated['status'] === 'reached') {
            return back()->with('success', 'Congratulations on reaching your goal!');
        }

        return back()->with('success', 'Progress updated.');
    }

    public function destroy(Goal $goal)
    {
        if ($goal->user_id !== auth()->id()) abort(403);
        $goal->delete();
        return back()->with('success', 'Goal deleted.');
    }
}
