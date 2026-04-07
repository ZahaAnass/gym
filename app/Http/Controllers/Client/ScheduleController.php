<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $client = $request->user();

        // Fetch only sessions this specific client is enrolled in
        $sessions = $client->sessionsAsClient()->with(['program', 'coach'])->get();

        $events = $sessions->map(function ($session) {
            $start = Carbon::parse($session->scheduled_at);
            $end = $start->copy()->addMinutes($session->duration_minutes);
            $isPast = $end->isPast();

            return [
                'id' => $session->id,
                'title' => $session->title,
                'start' => $start->toIso8601String(),
                'end' => $end->toIso8601String(),
                // Visuals: Grey for past, Emerald for future enrolled classes
                'backgroundColor' => $isPast ? '#64748b' : '#10b981',
                'borderColor' => $isPast ? '#64748b' : '#10b981',
                'extendedProps' => [
                    'duration' => $session->duration_minutes,
                    'coach_name' => $session->coach ? $session->coach->name : 'Staff',
                    'is_past' => $isPast,
                ]
            ];
        });

        return Inertia::render('Client/Schedule/Index', [
            'events' => $events,
        ]);
    }
}
