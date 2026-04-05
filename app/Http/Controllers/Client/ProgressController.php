<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProgressController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $assessments = $user->assessments()->latest()->get();

        return Inertia::render('Client/Progress/Index', [
            'assessments' => $assessments,
            // Pass chronological data specifically for potential chart rendering
            'chartData' => $user->assessments()->orderBy('created_at', 'asc')->get(['weight', 'ideal_weight_ai', 'created_at']),
            'upcoming_sessions' => $user->sessionsAsClient()
                ->with(['program', 'coach'])
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at', 'asc')
                ->take(5)
                ->get(),
        ]);
    }
}
