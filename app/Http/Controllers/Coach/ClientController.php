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
            ->with(['assessments' => fn ($q) => $q->latest()])
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

    public function show(User $client, Request $request)
    {
        abort_if($client->coach_id !== $request->user()->id, 403, 'Unauthorized access.');

        // Load 360° data including their currently assigned programs
        $client->load([
            'assessments' => fn ($q) => $q->latest(),
            'goals' => fn ($q) => $q->latest(),
            'payments' => fn ($q) => $q->latest(),
            'assignedPrograms' // 🔥 NEW
        ]);

        // 🔥 NEW: Fetch all programs the coach has built so they can assign them
        $programs = $request->user()->programs()->select('id', 'title')->get();

        return Inertia::render('Coach/Clients/Show', [
            'client' => $client,
            'programs' => $programs // Pass to React
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

    // 🔥 NEW: Assign Program Logic
    public function assignProgram(Request $request, User $client)
    {
        abort_if($client->coach_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id'
        ]);

        // Attach the program without deleting their previous programs
        $client->assignedPrograms()->syncWithoutDetaching([$validated['program_id']]);

        return back()->with('success', 'Program successfully assigned to the client!');
    }
}
