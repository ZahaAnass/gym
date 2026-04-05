<?php
namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\Session;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionController extends Controller
{
    public function index()
    {
        // Fetch sessions taught by this coach, including the enrolled clients and the pivot data
        $sessions = auth()->user()->sessionsAsCoach()
            ->with(['program', 'clients'])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return Inertia::render('Coach/Sessions/Index', [
            'sessions' => $sessions
        ]);
    }

    public function storeNotes(Request $request, Session $session)
    {
        $request->validate([
            'client_id' => 'required|exists:users,id',
            'is_attended' => 'boolean',
            'realizations' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $session->clients()->updateExistingPivot($request->client_id, [
            'is_attended' => $request->is_attended ?? false,
            'client_realizations' => $request->realizations,
            'coach_remarks' => $request->remarks,
        ]);

        return back()->with('success', 'Notes de séance enregistrées.');
    }
}
