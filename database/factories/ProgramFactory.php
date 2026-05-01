<?php

namespace Database\Factories;

use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgramFactory extends Factory
{
    protected $model = Program::class;

    public function definition(): array
    {
        $titles = [
            'Hypertrophie Push/Pull/Legs 4 Jours', 'Full Body Débutant (Sans matériel)',
            'Préparation Hyrox & Spartan Race', 'Force Athlétique (Méthode 5x5)',
            'Cardio HIIT Brûleur de Graisse', 'Mobilité, Core & Étirements',
            'Remise en forme post-blessure', 'Prise de Masse Sèche Intensive'
        ];

        return [
            'title' => $this->faker->randomElement($titles),
            'description' => "Objectif du programme : Amélioration globale de la condition physique.\n\nSemaine 1 à 4 : Périodisation linéaire.\n- Échauffement dynamique (10 min)\n- Corps de séance ciblé sur des mouvements polyarticulaires (Squat, Soulevé de terre, Développé couché)\n- Travail d'isolation en fin de séance\n- Retour au calme (5 min)\n\nNote : Les temps de repos doivent être strictement respectés pour maximiser l'hypertrophie musculaire.",
            'is_ai_generated' => $this->faker->boolean(40),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
