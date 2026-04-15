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

        // 1. Fetch ONLY the programs assigned to this specific client
        $programs = $user->programs()
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

        // 4. Return the read-only Client view
        return Inertia::render('Client/Programs/Index', [
            'programs' => $programs,
            'upcomingSessions' => $upcomingSessions,
            'stats' => [
                'completed_workouts' => $completedSessionsCount
            ]
        ]);
    }
}
