<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssessmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'height' => $this->faker->randomFloat(2, 150, 200),
            'weight' => $this->faker->randomFloat(2, 50, 120),
            'ideal_weight_ai' => $this->faker->randomFloat(2, 60, 90),
            'blood_pressure' => $this->faker->randomElement(['12/8', '13/9', '11/7', '14/9']),
            'allergies' => $this->faker->randomElement(['None', 'Peanuts', 'Lactose', 'Dust']),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
