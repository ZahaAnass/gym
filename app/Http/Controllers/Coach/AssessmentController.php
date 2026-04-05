<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\User;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    public function create(User $client)
    {
        // Security: Ensure this client actually belongs to the logged-in coach
        if ($client->coach_id !== auth()->id()) {
            abort(403, 'This client is not assigned to you.');
        }

        return Inertia::render('Coach/Assessments/Create', [
            'client' => $client,
            'history' => $client->assessments()->latest()->take(3)->get() // Pass recent history
        ]);
    }

    public function store(Request $request, GeminiService $gemini)
    {
        $data = $request->validate([
            'client_id' => 'required|exists:users,id',
            'height' => 'required|numeric|min:100|max:250',
            'weight' => 'required|numeric|min:30|max:300',
            'blood_pressure' => 'nullable|string',
            'allergies' => 'nullable|string',
        ]);

        // Prompt Gemini
        $prompt = "Client: H:{$data['height']}cm, W:{$data['weight']}kg. Allergies: {$data['allergies']}. Return JSON: {'ideal_weight': float, 'bmi_status': string, 'advice': string}";
        $cacheKey = 'ai_assessment_' . md5(json_encode($data));

        $aiData = $gemini->analyze($prompt, $cacheKey);

        // Save to Database
        Assessment::create(array_merge($data, [
            'coach_id' => auth()->id(),
            'ideal_weight_ai' => $aiData['ideal_weight'] ?? null,
        ]));

        // We redirect back to the client list after a successful AI generation
        return redirect()->route('coach.clients.index')->with('success', 'Bilan physique généré et enregistré par l\'IA !');
    }
}
