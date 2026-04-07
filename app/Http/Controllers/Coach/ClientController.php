<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the coach's assigned clients.
     */
    public function index(Request $request)
    {
        $coach = $request->user();

        $query = User::role('client')
            ->where('coach_id', $coach->id)
            ->with(['assessments' => function($q) {
                $q->latest()->take(1); // Get current weight
            }, 'goals' => function($q) {
                $q->where('status', 'active');
            }]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Coach/Clients/Index', [
            'clients' => $query->paginate(12)->withQueryString(),
            'filters' => $request->only(['search']),
            'stats' => [
                'total_clients' => $coach->clients()->count(),
            ]
        ]);
    }

    /**
     * 🔥 THE WOW FACTOR: The 360° Client Profile
     */
    public function show(User $client, Request $request)
    {
        $coach = $request->user();

        // Security Check: Ensure this client belongs to this coach
        abort_if($client->coach_id !== $coach->id, 403, 'Unauthorized access to this client.');

        // 1. Eager load all necessary relations for the 360 view
        $client->load([
            'goals',
            'assessments' => fn($q) => $q->orderBy('created_at', 'asc'), // Ascending for the chart
            'payments' => fn($q) => $q->latest()->take(1) // Just to see if they are active
        ]);

        // 2. Fetch Session History (Upcoming vs Past)
        $upcomingSessions = $client->sessionsAsClient()
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->take(5)
            ->get();

        $pastSessions = $client->sessionsAsClient()
            ->where('scheduled_at', '<', now())
            ->orderBy('scheduled_at', 'desc')
            ->take(5)
            ->get();

        // 3. Transform Assessment Data for Recharts (The beautiful chart)
        $chartData = $client->assessments->map(function ($assessment) {
            return [
                'date' => $assessment->created_at->format('M d'),
                'weight' => (float) $assessment->weight,
                'target' => (float) $assessment->ideal_weight_ai,
            ];
        });

        // 4. Calculate Financial Status (View Only for Coach)
        $lastPayment = $client->payments->first();
        $isFinancialyActive = $lastPayment && $lastPayment->status === 'completed' && $lastPayment->created_at->diffInDays(now()) <= 30;

        return Inertia::render('Coach/Clients/Show', [
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'joined_at' => $client->created_at->format('M d, Y'),
                'is_active' => $isFinancialyActive,
            ],
            'assessments' => $client->assessments->reverse()->values(), // Latest first for the table
            'chartData' => $chartData,
            'goals' => $client->goals,
            'upcomingSessions' => $upcomingSessions,
            'pastSessions' => $pastSessions,
        ]);
    }
}
