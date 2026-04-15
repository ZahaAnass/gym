<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
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
            // -- Coach Dashboard Logic --
            $activeClientsCount = $user->clients()->count();
            $totalPrograms = $user->programs()->count();
            $upcomingSession = $user->sessionsAsCoach()
                ->with('program')
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at', 'asc')
                ->first();

            $recentSessions = $user->sessionsAsCoach()
                ->withCount([
                    'clients as total_roster',
                    'clients as attended_count' => fn ($q) => $q->where('session_user.attended', true),
                ])
                ->where('scheduled_at', '>=', now()->subDays(30))
                ->where('scheduled_at', '<=', now())
                ->orderBy('scheduled_at', 'asc')
                ->get();

            $attendanceTrend = $recentSessions->map(function ($session) {
                return [
                    'name' => Carbon::parse($session->scheduled_at)->format('M d'),
                    'Attended' => $session->attended_count,
                    'Missed' => $session->total_roster - $session->attended_count,
                ];
            });

            $programDistribution = $user->programs()
                ->withCount('clients')
                ->get()
                ->map(fn ($program) => ['name' => $program->title, 'value' => $program->clients_count])
                ->filter(fn ($p) => $p['value'] > 0)
                ->values();

            return Inertia::render('Coach/Dashboard', [
                'activeClientsCount' => $activeClientsCount,
                'upcomingSession' => $upcomingSession,
                'totalPrograms' => $totalPrograms,
                'chartData' => [
                    'attendance' => $attendanceTrend,
                    'programs' => $programDistribution,
                ],
            ]);

        } else {
            // -- 🔥 NEW: Client Dashboard Logic --
            // 1. Eager load the coach relationship here
            $user->load(['assessments' => function ($q) {
                $q->orderBy('created_at', 'asc');
            }, 'coach']);

            $nextSession = $user->sessionsAsClient()
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at', 'asc')
                ->with('coach', 'program')
                ->first();

            $activeGoalsCount = $user->goals()->where('status', 'active')->count();

            $weightChart = $user->assessments->map(function ($a) {
                return [
                    'date' => $a->created_at->format('M d'),
                    'weight' => (float) $a->weight,
                ];
            });

            $attended = $user->sessionsAsClient()->wherePivot('attended', true)->count();
            $missed = $user->sessionsAsClient()
                ->where('scheduled_at', '<', now())
                ->wherePivot('attended', false)
                ->count();

            return Inertia::render('Client/Dashboard', [
                'latestAssessment' => $user->assessments->last(),
                'nextSession' => $nextSession,
                'activeGoalsCount' => $activeGoalsCount,
                'coach' => $user->coach, // 2. Pass the coach to the view
                'chartData' => [
                    'weight' => $weightChart,
                    'attendance' => [
                        ['name' => 'Classes Attended', 'value' => $attended],
                        ['name' => 'Classes Missed', 'value' => $missed],
                    ],
                ],
            ]);
        }
    }
}
