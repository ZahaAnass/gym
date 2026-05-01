<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 🔥 FIX: Use assignedPrograms() instead of programs()
        $programs = $user->assignedPrograms()
            ->with('coach:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. Fetch their upcoming sessions so we can show them alongside the program
        $upcomingSessions = $user->sessionsAsClient()
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->take(5)
            ->get();

        // 3. Calculate some basic stats for the UI
        $completedSessionsCount = $user->sessionsAsClient()
            ->wherePivot('attended', true)
            ->count();


        return Inertia::render('Client/Programs/Index', [
            'programs' => $programs,
            'upcomingSessions' => $upcomingSessions,
            'stats' => [
                'completed_workouts' => $completedSessionsCount
            ]
        ]);
    }
}
