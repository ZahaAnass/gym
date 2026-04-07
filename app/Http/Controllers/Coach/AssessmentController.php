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
    public function create(User $client, Request $request)
    {
        // Security: Ensure this coach actually trains this client
        abort_if($client->coach_id !== $request->user()->id, 403, 'Unauthorized access to this client.');

        return Inertia::render('Coach/Assessments/Create', [
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
            ],
        ]);
    }

    /**
     * 🔥 THE WOW FACTOR: AI Medical & Physical Analysis
     */
    public function store(Request $request, GeminiService $gemini)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:users,id',
            'height' => 'required|numeric|min:100|max:250', // in cm
            'weight' => 'required|numeric|min:30|max:300', // in kg
            'blood_pressure' => 'required|string|max:50',
            'allergies' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:500',
        ]);

        $client = User::findOrFail($validated['client_id']);
        abort_if($client->coach_id !== $request->user()->id, 403);

        // 1. Construct the AI Prompt for the Virtual Sports Doctor
        $prompt = sprintf(
            "Act as an elite sports physician and fitness nutritionist. Analyze the following client biometrics:\n".
            "- Height: %s cm\n".
            "- Current Weight: %s kg\n".
            "- Blood Pressure: %s\n".
            "- Allergies/Conditions: %s\n".
            "- Coach Notes: %s\n\n".
            "You MUST return ONLY a valid JSON object. Do not use markdown blocks. The JSON must have exactly these two keys:\n".
            "1. 'ideal_weight_ai': Calculate their optimal athletic weight in kg based on their height (number only).\n".
            "2. 'advice': Write a professional, 3-paragraph medical and training strategy for this client based on their biometrics and conditions (string).",
            $validated['height'],
            $validated['weight'],
            $validated['blood_pressure'],
            $validated['allergies'] ?? 'None',
            $validated['notes'] ?? 'None'
        );

        // 2. Call the Gemini Service (No caching here because health data is dynamic)
        // We use a random string for the cache key to bypass it, or you can update the service to accept null.
        $result = $gemini->analyze($prompt, 'assessment_'.uniqid());

        if (! $result || ! isset($result['ideal_weight_ai']) || ! isset($result['advice'])) {
            return back()->with('error', 'AI Analysis failed to process the biometrics. Please try again.');
        }

        // 3. Save the Bilan Physique & Sanitaire to the database
        Assessment::create([
            'client_id' => $client->id,
            'coach_id' => $request->user()->id,
            'height' => $validated['height'],
            'weight' => $validated['weight'],
            'blood_pressure' => $validated['blood_pressure'],
            'allergies' => $validated['allergies'],
            'ideal_weight_ai' => $result['ideal_weight_ai'],
            'advice' => $result['advice'],
        ]);

        return redirect()->route('coach.clients.show', $client->id)
            ->with('success', 'AI Health Assessment successfully generated and saved to the client profile.');
    }
}
