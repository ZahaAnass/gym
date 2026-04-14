<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\Program;
use App\Notifications\SessionScheduledNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        $coach = $request->user();

        $upcomingSessions = $coach->sessionsAsCoach()
            ->with(['program', 'clients'])
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->paginate(10, ['*'], 'upcoming_page');

        $pastSessions = $coach->sessionsAsCoach()
            ->with(['program', 'clients'])
            ->where('scheduled_at', '<', now())
            ->orderBy('scheduled_at', 'desc')
            ->paginate(10, ['*'], 'past_page');

        $stats = Cache::remember("coach:{$coach->id}:session_stats", 300, function () use ($coach) {
            return [
                'total_upcoming' => $coach->sessionsAsCoach()->where('scheduled_at', '>=', now())->count(),
                'total_completed' => $coach->sessionsAsCoach()->where('scheduled_at', '<', now())->count(),
                'this_week' => $coach->sessionsAsCoach()->whereBetween('scheduled_at', [now(), now()->addDays(7)])->count(),
            ];
        });

        $programs = $coach->programs()->get(['id', 'title']);

        return Inertia::render('Coach/Sessions/Index', [
            'upcomingSessions' => $upcomingSessions,
            'pastSessions' => $pastSessions,
            'programs' => $programs,
            'stats' => $stats
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'program_id' => 'nullable|exists:programs,id', // Can be null for custom sessions
            'scheduled_at' => 'required|date',
            'duration_minutes' => 'required|integer|min:15|max:240',
            'max_participants' => 'required|integer|min:1|max:50',
        ]);

        // 1. Create the session
        $session = $request->user()->sessionsAsCoach()->create($validated);

        // 2. AUTOMATIC ASSIGNMENT & EMAILS (The Wow Factor)
        if (!empty($validated['program_id'])) {
            $program = Program::with('clients')->find($validated['program_id']);

            if ($program && $program->clients->count() > 0) {
                // Attach all clients in this program to the new session roster
                $session->clients()->attach($program->clients->pluck('id'));

                // Email all those clients!
                Notification::send($program->clients, new SessionScheduledNotification($session));
            }
        }

        Cache::forget("coach:{$request->user()->id}:session_stats");
        Cache::forget("coach:{$request->user()->id}:schedule_stats");

        return back()->with('success', 'Session scheduled and clients notified!');
    }

    public function show(Session $session, Request $request)
    {
        abort_if($session->coach_id !== $request->user()->id, 403, 'Unauthorized access.');

        $session->load(['program', 'clients']);

        return Inertia::render('Coach/Sessions/Show', [
            'session' => $session
        ]);
    }

    // 🚀 NEW: Save Attendance & Notes directly to the pivot table
    public function updateAttendance(Request $request, Session $session)
    {
        abort_if($session->coach_id !== $request->user()->id, 403);

        $request->validate([
            'attendance' => 'required|array',
            'attendance.*.user_id' => 'required|exists:users,id',
            'attendance.*.attended' => 'required|boolean',
            'attendance.*.notes' => 'nullable|string|max:1000',
        ]);

        foreach ($request->attendance as $record) {
            $session->clients()->updateExistingPivot($record['user_id'], [
                'attended' => $record['attended'],
                'notes' => $record['notes'],
            ]);
        }

        return back()->with('success', 'Attendance and session notes saved successfully!');
    }

    public function destroy(Session $session, Request $request)
    {
        abort_if($session->coach_id !== $request->user()->id, 403);
        $session->delete();
        Cache::forget("coach:{$request->user()->id}:session_stats");
        Cache::forget("coach:{$request->user()->id}:schedule_stats");

        return back()->with('success', 'Session cancelled successfully.');
    }
}
