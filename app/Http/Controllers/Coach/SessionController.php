<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Carbon\Carbon;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        $coach = $request->user();

        // Fetch upcoming and past sessions separately for the UI tabs
        $upcomingSessions = $coach->sessionsAsCoach()
            ->with(['program', 'clients' => function($q) { $q->select('users.id'); }])
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->paginate(10, ['*'], 'upcoming_page');

        $pastSessions = $coach->sessionsAsCoach()
            ->with(['program', 'clients' => function($q) { $q->select('users.id'); }])
            ->where('scheduled_at', '<', now())
            ->orderBy('scheduled_at', 'desc')
            ->paginate(10, ['*'], 'past_page');

        // Redis Caching for Coach Stats
        $stats = Cache::remember("coach:{$coach->id}:session_stats", 300, function () use ($coach) {
            return [
                'total_upcoming' => $coach->sessionsAsCoach()->where('scheduled_at', '>=', now())->count(),
                'total_completed' => $coach->sessionsAsCoach()->where('scheduled_at', '<', now())->count(),
                'this_week' => $coach->sessionsAsCoach()->whereBetween('scheduled_at', [now(), now()->addDays(7)])->count(),
            ];
        });

        // Get programs for the "Create Session" modal
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
            'program_id' => 'nullable|exists:programs,id',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|min:15|max:240',
            'max_participants' => 'required|integer|min:1|max:50',
        ]);

        $request->user()->sessionsAsCoach()->create($validated);

        Cache::forget("coach:{$request->user()->id}:session_stats");
        Cache::forget("coach:{$request->user()->id}:schedule_stats");

        return back()->with('success', 'New training session successfully scheduled.');
    }

    public function show(Session $session, Request $request)
    {
        // Security: Ensure coach owns this session
        abort_if($session->coach_id !== $request->user()->id, 403, 'Unauthorized access.');

        $session->load(['program', 'clients']);

        return Inertia::render('Coach/Sessions/Show', [
            'session' => $session
        ]);
    }

    /**
     * 🔥 THE WOW FACTOR: Logging Post-Workout Notes
     * This fulfills the "Prendre notes de séance" Use Case.
     */
    public function storeNotes(Request $request, Session $session)
    {
        abort_if($session->coach_id !== $request->user()->id, 403, 'Unauthorized access.');

        // Note: Make sure your `sessions` table has a `notes` text column!
        $validated = $request->validate([
            'notes' => 'required|string|max:2000',
        ]);

        $session->update([
            'notes' => $validated['notes']
        ]);

        return back()->with('success', 'Session notes successfully saved.');
    }

    public function destroy(Session $session, Request $request)
    {
        abort_if($session->coach_id !== $request->user()->id, 403);

        $session->delete();

        Cache::forget("coach:{$request->user()->id}:session_stats");
        Cache::forget("coach:{$request->user()->id}:schedule_stats");

        return redirect()->route('coach.sessions.index')->with('success', 'Session cancelled successfully.');
    }
}
