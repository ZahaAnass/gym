<?php

namespace Database\Factories;

use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;

class SessionFactory extends Factory
{
    protected $model = Session::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->randomElement(['Séance Jambes', 'Cardio Intensif', 'Haut du corps', 'Mobilité']),
            'scheduled_at' => $this->faker->dateTimeBetween('-1 week', '+2 weeks'),
            'duration_minutes' => $this->faker->randomElement([30, 45, 60, 90]),
            'max_participants' => $this->faker->numberBetween(5, 15),
            'created_at' => now(),
        ];
    }
}
