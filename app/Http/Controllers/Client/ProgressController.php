<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgressController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Fetch assessments chronologically for the Chart
        $assessments = $user->assessments()->orderBy('created_at', 'asc')->get();

        // 2. Transform the data exactly how Recharts needs it
        $chartData = $assessments->map(function ($assessment) {
            return [
                'date' => $assessment->created_at->format('M d'),
                'weight' => (float) $assessment->weight,
                'target' => (float) $assessment->ideal_weight_ai,
            ];
        });

        // 3. Fetch goals (now including coach-assigned numeric goals)
        $goals = $user->goals()->orderBy('created_at', 'desc')->get();

        // 4. 🔥 FIXED: Calculate real attendance rate using the new 'attended' column
        $totalSessions = $user->sessionsAsClient()->count();
        $attendedSessions = $user->sessionsAsClient()->wherePivot('attended', true)->count();
        $attendanceRate = $totalSessions > 0 ? round(($attendedSessions / $totalSessions) * 100) : 100;

        return Inertia::render('Client/Progress/Index', [
            'assessments' => $assessments->reverse()->values(), // Reversed for the "Latest" stats card
            'chartData' => $chartData,
            'goals' => $goals,
            'attendance_rate' => $attendanceRate,
        ]);
    }
}
