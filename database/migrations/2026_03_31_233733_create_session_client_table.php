<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_client', function (Blueprint $table) {
            $table->id();
            // Point to the newly named 'gym_sessions' table
            $table->foreignId('session_id')->constrained('gym_sessions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_attended')->default(false);
            $table->text('client_realizations')->nullable();
            $table->text('coach_remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_client');
    }
};
