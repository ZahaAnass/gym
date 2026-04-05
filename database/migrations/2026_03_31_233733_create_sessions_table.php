<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Changed from 'sessions' to 'gym_sessions'
        Schema::create('gym_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->foreignId('coach_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->dateTime('scheduled_at');
            $table->integer('duration_minutes');
            $table->integer('max_participants');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gym_sessions');
    }
};
