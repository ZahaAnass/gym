<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $clients = $request->user()->clients()
            ->with([
                'assessments' => fn ($q) => $q->latest(),
                'assignedPrograms', // Loaded correctly!
                'sessionsAsClient' => fn ($q) => $q->wherePivot('attended', true)
            ])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Coach/Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Request $request, User $client)
    {
        // 🔒 SECURITY: Ensure this coach actually owns this client
        if ($client->coach_id !== $request->user()->id) {
            abort(403, 'Unauthorized: This client is not assigned to you.');
        }

        // 1. Load Client Data
        $client->load([
            'assessments' => fn($q) => $q->orderBy('created_at', 'asc'),
            'goals' => fn($q) => $q->orderBy('created_at', 'desc')->take(5),
            'assignedPrograms' => fn($q) => $q->orderBy('created_at', 'desc'),
        ]);

        // 2. Load Session History
        $recentSessions = $client->sessionsAsClient()->where('scheduled_at', '<=', now())->orderBy('scheduled_at', 'desc')->take(5)->get();
        $upcomingSessions = $client->sessionsAsClient()->where('scheduled_at', '>=', now())->orderBy('scheduled_at', 'asc')->take(3)->get();

        // 3. Calculate Stats for the UI
        $attendedCount = $client->sessionsAsClient()->wherePivot('attended', true)->count();
        $missedCount = $client->sessionsAsClient()->where('scheduled_at', '<', now())->wherePivot('attended', false)->count();

        // 4. Format Biometrics for Recharts
        $biometricsChart = $client->assessments->map(function ($a) {
            return ['date' => $a->created_at->format('M d'), 'weight' => (float) $a->weight];
        });

        // 5. Fetch the coach's saved programs for the Assign Modal
        $availablePrograms = $request->user()->programs()->select('programs.id', 'programs.title')->get();

        return Inertia::render('Coach/Clients/Show', [
            'client' => $client,
            'recentSessions' => $recentSessions,
            'upcomingSessions' => $upcomingSessions,
            'availablePrograms' => $availablePrograms,
            'stats' => [
                'attended' => $attendedCount,
                'missed' => $missedCount,
                'total_sessions' => $attendedCount + $missedCount
            ],
            'chartData' => ['biometrics' => $biometricsChart]
        ]);
    }

    // Goal Creation Logic
    public function storeGoal(Request $request, User $client)
    {
        abort_if($client->coach_id !== $request->user()->id, 403, 'Unauthorized access.');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:text,numeric',
            'target_value' => 'nullable|required_if:type,numeric|numeric',
            'current_value' => 'nullable|required_if:type,numeric|numeric',
            'unit' => 'nullable|required_if:type,numeric|string|max:10',
            'direction' => 'nullable|required_if:type,numeric|in:asc,desc',
            'deadline' => 'required|date|after:today',
        ]);

        $client->goals()->create([
            'coach_id' => $request->user()->id,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'target_value' => $validated['target_value'],
            'current_value' => $validated['current_value'] ?? 0,
            'unit' => $validated['unit'],
            'direction' => $validated['direction'],
            'deadline' => $validated['deadline'],
            'status' => 'active',
        ]);

        return back()->with('success', 'Goal successfully assigned to client!');
    }

    // Assign Program Logic
    public function assignProgram(Request $request, User $client)
    {
        abort_if($client->coach_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id'
        ]);

        $client->assignedPrograms()->syncWithoutDetaching([$validated['program_id']]);

        return back()->with('success', 'Program successfully assigned to the client!');
    }

    // Remove Program Logic
    public function removeProgram(Request $request, User $client, $programId)
    {
        abort_if($client->coach_id !== $request->user()->id, 403);

        $client->assignedPrograms()->detach($programId);

        return back()->with('success', 'Program unassigned successfully.');
    }
}
