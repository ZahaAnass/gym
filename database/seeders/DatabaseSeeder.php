<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Assessment;
use App\Models\Payment;
use App\Models\AuditLog;
use App\Models\Goal;
use App\Models\Program;
use App\Models\Session;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Roles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $coachRole = Role::firstOrCreate(['name' => 'coach', 'guard_name' => 'web']);
        $clientRole = Role::firstOrCreate(['name' => 'client', 'guard_name' => 'web']);

        // 2. Create Master Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@gym.com'],
            ['name' => 'Anass Admin', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $admin->assignRole($adminRole);

        // 3. Create Coaches
        $coaches = User::factory(5)->create()->each(function ($user) use ($coachRole) {
            $user->assignRole($coachRole);

            // Give each coach 2-3 Programs
            Program::factory(rand(2, 3))->create(['coach_id' => $user->id]);
        });

        // 4. Create Clients & Assign to Coaches
        $clients = User::factory(40)->create()->each(function ($client) use ($clientRole, $coaches) {
            $client->assignRole($clientRole);

            // Assign to a random coach
            $coach = $coaches->random();
            $client->update(['coach_id' => $coach->id]);

            // Add Assessments
            Assessment::factory(rand(1, 3))->create([
                'client_id' => $client->id,
                'coach_id' => $coach->id,
            ]);

            // Add Payments
            Payment::factory(rand(1, 4))->create(['user_id' => $client->id]);

            // Add Goals
            Goal::factory(rand(1, 2))->create(['user_id' => $client->id]);
        });

        // 5. Create Sessions and Attach Clients (Pivot Table)
        $programs = Program::all();
        foreach ($programs as $program) {
            // Create 3-5 sessions per program
            Session::factory(rand(3, 5))->create([
                'program_id' => $program->id,
                'coach_id' => $program->coach_id,
            ])->each(function ($session) use ($clients) {
                // Attach 3-8 random clients to this session
                $sessionClients = $clients->random(rand(3, 8))->pluck('id');

                // Populate the pivot table with attendance and remarks
                $pivotData = [];
                foreach ($sessionClients as $clientId) {
                    $pivotData[$clientId] = [
                        'is_attended' => fake()->boolean(80), // 80% attendance rate
                        'client_realizations' => fake()->optional(0.5)->sentence(),
                        'coach_remarks' => fake()->optional(0.5)->sentence(),
                    ];
                }
                $session->clients()->attach($pivotData);
            });
        }

        // 6. Generate System Audit Logs
        AuditLog::factory(150)->create([
            'user_id' => fn() => User::inRandomOrder()->first()->id
        ]);
    }
}
