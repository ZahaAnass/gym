<?php

namespace Database\Factories;

use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;

class SessionFactory extends Factory
{
    protected $model = Session::class;

    public function definition(): array
    {
        $sessions = [
            'Bilan Biomécanique & Pesée', 'Coaching Privé : Force Haut du Corps',
            'Small Group : Circuit Cross-Training', 'Séance Jambes & Fessiers',
            'Cardio & Core (Abdos)', 'Technique d\'haltérophilie (Snatch)',
            'Réathlisation Genou/Dos', 'Bootcamp Extérieur'
        ];

        return [
            'title' => $this->faker->randomElement($sessions),
            // Génère des dates entre 1 mois dans le passé et 2 semaines dans le futur pour les graphiques
            'scheduled_at' => $this->faker->dateTimeBetween('-1 month', '+2 weeks'),
            'duration_minutes' => $this->faker->randomElement([30, 45, 60, 90]),
            'max_participants' => $this->faker->numberBetween(1, 10), // 1 pour coaching privé, plus pour les groupes
            'created_at' => now(),
        ];
    }
}
