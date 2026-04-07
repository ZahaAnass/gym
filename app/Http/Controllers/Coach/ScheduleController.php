<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $coach = $request->user();

        // Fetch all sessions for this coach, including the program they belong to
        $sessions = $coach->sessionsAsCoach()->with('program')->get();

        // 1. Transform database records into FullCalendar Event Objects
        $events = $sessions->map(function ($session) {
            $start = Carbon::parse($session->scheduled_at);
            $end = $start->copy()->addMinutes($session->duration_minutes);
            $isPast = $end->isPast();

            return [
                'id' => $session->id,
                'title' => $session->title,
                'start' => $start->toIso8601String(),
                'end' => $end->toIso8601String(),
                // Visual Design: Grey for past sessions, Indigo for upcoming sessions
                'backgroundColor' => $isPast ? '#64748b' : '#4f46e5',
                'borderColor' => $isPast ? '#64748b' : '#4f46e5',
                'extendedProps' => [
                    'duration' => $session->duration_minutes,
                    'program_title' => $session->program ? $session->program->title : 'Custom Session',
                    'max_participants' => $session->max_participants,
                    'is_past' => $isPast,
                ]
            ];
        });

        // 2. Cache simple dashboard statistics for the Coach
        $stats = Cache::remember("coach:{$coach->id}:schedule_stats", 300, function () use ($coach) {
            return [
                'upcoming_this_week' => $coach->sessionsAsCoach()
                    ->whereBetween('scheduled_at', [now(), now()->addDays(7)])
                    ->count(),
                'total_completed' => $coach->sessionsAsCoach()
                    ->where('scheduled_at', '<', now())
                    ->count(),
            ];
        });

        return Inertia::render('Coach/Schedule/Index', [
            'events' => $events,
            'stats' => $stats,
        ]);
    }
}
