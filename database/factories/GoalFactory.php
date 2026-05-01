<?php

namespace Database\Factories;

use App\Models\Goal;
use Illuminate\Database\Eloquent\Factories\Factory;

class GoalFactory extends Factory
{
    protected $model = Goal::class;

    public function definition(): array
    {
        $isNumeric = $this->faker->boolean(75); // 75% d'objectifs chiffrés (Poids, RM, etc.)

        $aiAdvice = [
            "Stratégie IA : Maintenez un déficit calorique léger (300 kcal/jour) et augmentez votre apport en protéines à 1.8g/kg de poids de corps. Privilégiez 3 séances de renforcement musculaire par semaine.",
            "Stratégie IA : Intégrez une surcharge progressive sur les exercices polyarticulaires (+2.5kg par semaine). Assurez-vous de dormir au moins 7h à 8h pour optimiser la récupération du système nerveux.",
            "Stratégie IA : Augmentez le volume d'entraînement en zone 2 (fréquence cardiaque basse) pour construire une base aérobie solide avant d'ajouter des séances de fractionné à haute intensité (HIIT).",
            "Stratégie IA : Améliorez la mobilité de vos hanches et chevilles 10 minutes par jour pour débloquer votre amplitude de mouvement et éviter les blessures articulaires."
        ];

        return [
            'title' => $this->faker->randomElement(['Atteindre 15% de Bodyfat', 'Passer 100kg au Squat', 'Courir 10km en moins de 50min', 'Perdre 5 kilos avant l\'été', 'Réussir mes premiers Muscle-Ups']),
            'type' => $isNumeric ? 'numeric' : 'text',
            'target_value' => $isNumeric ? $this->faker->randomFloat(2, 10, 150) : null,
            'current_value' => $isNumeric ? $this->faker->randomFloat(2, 0, 90) : null,
            'unit' => $isNumeric ? $this->faker->randomElement(['kg', 'km', '%', 'reps']) : null,
            'direction' => $isNumeric ? $this->faker->randomElement(['asc', 'desc']) : null,
            'deadline' => $this->faker->dateTimeBetween('+1 week', '+4 months')->format('Y-m-d'),
            'ai_strategy_advice' => $this->faker->optional(0.8)->randomElement($aiAdvice),
            'status' => $this->faker->randomElement(['active', 'active', 'active', 'reached', 'failed']),
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
