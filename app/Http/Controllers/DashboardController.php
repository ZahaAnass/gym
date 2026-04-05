<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            return redirect()->route('admin.analytics');

        } elseif ($user->hasRole('coach')) {
            // Fetch summary for the Coach Dashboard
            $activeClientsCount = $user->clients()->count();

            $upcomingSession = $user->sessionsAsCoach()
                ->with('program')
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at', 'asc')
                ->first();

            $totalPrograms = $user->programs()->count();

            return Inertia::render('Coach/Dashboard', [
                'activeClientsCount' => $activeClientsCount,
                'upcomingSession' => $upcomingSession,
                'totalPrograms' => $totalPrograms,
            ]);

        } else {
            // Fetch summary for the Client Dashboard
            $user->load(['assessments' => function($q) {
                $q->latest()->take(1);
            }]);

            $nextSession = $user->sessionsAsClient()
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at', 'asc')
                ->with('coach', 'program')
                ->first();

            $activeGoalsCount = $user->goals()->where('status', 'active')->count();

            return Inertia::render('Client/Dashboard', [
                'latestAssessment' => $user->assessments->first(),
                'nextSession' => $nextSession,
                'activeGoalsCount' => $activeGoalsCount,
            ]);
        }
    }
}
