<?php

namespace Database\Factories;

use App\Models\Assessment;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssessmentFactory extends Factory
{
    protected $model = Assessment::class;

    public function definition(): array
    {
        $weight = $this->faker->randomFloat(2, 55, 115); // Poids entre 55kg et 115kg

        return [
            'height' => $this->faker->randomFloat(2, 1.55, 1.95), // Taille en mètres
            'weight' => $weight,
            'ideal_weight_ai' => $weight - $this->faker->randomFloat(2, 2, 10), // L'IA propose une perte de 2 à 10kg
            'blood_pressure' => $this->faker->randomElement(['120/80', '115/75', '130/85', '110/70', '140/90']),
            'allergies' => $this->faker->randomElement(['Aucune', 'Aucune', 'Arachides', 'Lactose', 'Gluten', 'Asthme à l\'effort']),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
