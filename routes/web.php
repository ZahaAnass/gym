<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\PaymentController as AdminPayment;
use App\Http\Controllers\Admin\PublicContentController;
use App\Http\Controllers\Admin\UserController; // <-- Added
use App\Http\Controllers\Client\GoalController;
use App\Http\Controllers\Client\PaymentController as ClientPayment;
use App\Http\Controllers\Client\ProgressController;
use App\Http\Controllers\Coach\AssessmentController;
use App\Http\Controllers\Coach\ClientController as CoachClient;
use App\Http\Controllers\Coach\ProgramController;
use App\Http\Controllers\Coach\SessionController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', ['canRegister' => Features::enabled(Features::registration())]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 🔴 ADMINISTRATOR: Full Management [cite: 114]
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('analytics', [AdminDashboard::class, 'stats'])->name('analytics'); //
        Route::resource('users', UserController::class); //
        Route::get('unpaid', [AdminPayment::class, 'unpaid'])->name('payments.unpaid'); //
        Route::get('logs', [AuditLogController::class, 'index'])->name('logs.index'); //
        Route::resource('content', PublicContentController::class); // <-- Added
    });

    // 🔵 COACH: Fitness & AI Logic [cite: 143]
    Route::middleware(['role:coach'])->prefix('coach')->name('coach.')->group(function () {
        Route::get('clients', [CoachClient::class, 'index'])->name('clients.index');
        Route::resource('programs', ProgramController::class);
        Route::post('programs/generate-ai', [ProgramController::class, 'generateAI'])->name('programs.ai');
        Route::resource('sessions', SessionController::class);
        Route::post('sessions/{session}/notes', [SessionController::class, 'storeNotes'])->name('sessions.notes');
        Route::get('assessments/create/{client}', [AssessmentController::class, 'create'])->name('assessments.create');
        Route::post('assessments', [AssessmentController::class, 'store'])->name('assessments.store');
    });

    // 🟢 CLIENT: Personal Progress & Financials [cite: 104]
    Route::middleware(['role:client'])->prefix('client')->name('client.')->group(function () {
        Route::get('progress', [ProgressController::class, 'index'])->name('progress.index');
        Route::resource('goals', GoalController::class);
        Route::get('payments', [ClientPayment::class, 'index'])->name('payments.index');
        Route::post('payments/stripe', [ClientPayment::class, 'processStripe'])->name('payments.stripe');
    });
});

require __DIR__.'/settings.php';
