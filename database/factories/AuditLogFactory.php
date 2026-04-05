<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AuditLogFactory extends Factory
{
    public function definition(): array
    {
        $methods = ['GET', 'POST', 'PUT', 'DELETE'];
        $urls = ['/admin/users', '/coach/assessments', '/client/payments', '/login'];

        return [
            'url' => config('app.url').$this->faker->randomElement($urls),
            'method' => $this->faker->randomElement($methods),
            'status' => $this->faker->randomElement(['success', 'error']),
            'message' => $this->faker->sentence(),
            'payload' => ['user_agent' => $this->faker->userAgent(), 'ip' => $this->faker->ipv4()],
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
