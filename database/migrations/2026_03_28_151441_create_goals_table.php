<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // The Client
            $table->foreignId('coach_id')->nullable()->constrained('users')->cascadeOnDelete(); // The Coach
            $table->string('title');

            // 🔥 NEW: Dynamic Goal Tracking
            $table->enum('type', ['text', 'numeric'])->default('text');
            $table->decimal('target_value', 8, 2)->nullable();
            $table->decimal('current_value', 8, 2)->nullable()->default(0);
            $table->string('unit')->nullable(); // e.g., 'kg', 'km', '%'
            $table->enum('direction', ['asc', 'desc'])->nullable(); // 'desc' for weight loss, 'asc' for muscle gain

            $table->date('deadline');
            $table->text('ai_strategy_advice')->nullable();
            $table->enum('status', ['active', 'reached', 'failed'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
