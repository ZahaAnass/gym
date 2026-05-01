<?php

namespace Database\Factories;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuditLogFactory extends Factory
{
    protected $model = AuditLog::class;

    public function definition(): array
    {
        $actions = [
            ['method' => 'POST', 'url' => '/login', 'status' => '200', 'message' => 'Connexion utilisateur réussie.'],
            ['method' => 'POST', 'url' => '/coach/programs/generate-ai', 'status' => '201', 'message' => 'Génération d\'un programme IA via Google Gemini.'],
            ['method' => 'POST', 'url' => '/client/payments/checkout', 'status' => '200', 'message' => 'Webhook Stripe: Paiement validé avec succès.'],
            ['method' => 'DELETE', 'url' => '/coach/clients/3/programs/12', 'status' => '200', 'message' => 'Programme retiré du dossier client.'],
            ['method' => 'GET', 'url' => '/admin/users', 'status' => '403', 'message' => 'Accès refusé : tentative de contournement des permissions admin.'],
        ];

        $log = $this->faker->randomElement($actions);

        return [
            'url' => config('app.url') . $log['url'],
            'method' => $log['method'],
            'status' => $log['status'],
            'message' => $log['message'],
            'payload' => json_encode([
                'user_agent' => $this->faker->userAgent(),
                'ip' => $this->faker->ipv4()
            ]),
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
