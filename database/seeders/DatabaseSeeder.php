<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\AuditLog;
use App\Models\Goal;
use App\Models\Payment;
use App\Models\Program;
use App\Models\Session;
use App\Models\User;
use App\Notifications\SystemBroadcast;
use Database\Factories\DatabaseNotificationFactory;
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
            Goal::factory(rand(1, 2))->create([
                'user_id' => $client->id,
                'coach_id' => $coach->id, // 👈 Added this line
            ]);
        });

        // 5. Create Sessions and Attach Clients (The FIXED Logic)
        $programs = Program::all();
        foreach ($programs as $program) {
            // Find 3-8 random clients that BELONG to the coach who made this program
            $programClients = User::role('client')
                ->where('coach_id', $program->coach_id)
                ->inRandomOrder()
                ->take(rand(3, 8))
                ->pluck('id');

            // Attach the clients to the Program
            $program->clients()->attach($programClients);

            // Create 3-5 sessions for this program
            Session::factory(rand(3, 5))->create([
                'program_id' => $program->id,
                'coach_id' => $program->coach_id,
            ])->each(function ($session) use ($programClients) {
                // Attach the EXACT SAME clients to the sessions
                $pivotData = [];
                foreach ($programClients as $clientId) {
                    $pivotData[$clientId] = [
                        'attended' => fake()->boolean(80), // New Column
                        'notes' => fake()->optional(0.7)->sentence(), // New Column
                    ];
                }
                $session->clients()->attach($pivotData);
            });
        }

        // 6. Generate System Audit Logs
        AuditLog::factory(150)->create([
            'user_id' => fn () => User::inRandomOrder()->first()->id,
        ]);

        // 7. 🔥 Seed Notifications
        // First, give the Admin a realistic welcome notification
        $admin->notify(new SystemBroadcast(
            'System Setup Complete',
            'All database seeding has finished successfully. The system is ready for production.',
            'success'
        ));

        // Generate 5 to 10 random notifications for EVERY user using our new Factory
        $allUsers = User::all();
        foreach ($allUsers as $user) {
            DatabaseNotificationFactory::new()->count(rand(5, 10))->create([
                'notifiable_id' => $user->id,
                'notifiable_type' => User::class,
            ]);
        }
    }
}
