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

        // 1. Fetch assessments ordered chronologically for the chart
        $assessments = $user->assessments()->orderBy('created_at', 'asc')->get();

        // 2. Transform the data exactly how Recharts needs it
        $chartData = $assessments->map(function ($assessment) {
            return [
                'date' => $assessment->created_at->format('M d'),
                'weight' => (float) $assessment->weight,
                'target' => (float) $assessment->ideal_weight_ai,
            ];
        });

        // 3. Fetch the client's upcoming schedule
        $upcomingSessions = $user->sessionsAsClient()
            ->with(['program', 'coach'])
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('Client/Progress/Index', [
            // We reverse the assessments here so the UI can easily grab index [0] as the "latest"
            'assessments' => $assessments->reverse()->values(),
            'chartData' => $chartData,
            'upcoming_sessions' => $upcomingSessions,
        ]);
    }
}
