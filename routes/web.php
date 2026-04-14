<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
// Admin Controllers
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\PublicContentController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Client\GoalController;
use App\Http\Controllers\Client\PaymentController as ClientPaymentController;
use App\Http\Controllers\Client\ProgressController;
// Coach Controllers
use App\Http\Controllers\Client\ScheduleController as ClientScheduleController;
use App\Http\Controllers\Coach\AssessmentController;
use App\Http\Controllers\Coach\ClientController;
use App\Http\Controllers\Coach\ProgramController;
use App\Http\Controllers\Coach\ScheduleController as CoachScheduleController;
// Client Controllers
use App\Http\Controllers\Coach\SessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Middleware\EnsureActiveSubscription;
use Illuminate\Support\Facades\Route;

// 🟢 PUBLIC ROUTES
Route::get('/', [PublicContentController::class, 'showWelcome'])->name('home');

// 🟢 AUTHENTICATED REDIRECTOR & SHARED ROUTES
Route::middleware(['auth', 'verified', EnsureActiveSubscription::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Shared Notifications (Bell Icon)
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
});

// 🟢 ADMIN: Enterprise Management
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Advanced Analytics (Cached with Predis)
    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics');

    // Users & Roles
    Route::resource('users', UserController::class);

    Route::get('unpaid', [AdminPaymentController::class, 'unpaid'])->name('unpaid');
    Route::post('unpaid/notify/{user}', [AdminPaymentController::class, 'sendReminder'])->name('unpaid.notify');
    Route::post('unpaid/mark-paid/{user}', [AdminPaymentController::class, 'markAsPaid'])->name('unpaid.markPaid');
    Route::get('unpaid/export', [AdminPaymentController::class, 'exportCsv'])->name('payments.export');

    // Broadcast Center
    Route::get('notifications', [AdminNotificationController::class, 'create'])->name('notifications.create');
    Route::post('notifications/broadcast', [AdminNotificationController::class, 'broadcast'])->name('notifications.broadcast');

    // System
    Route::get('logs', [AuditLogController::class, 'index'])->name('logs.index');
    Route::get('content', [PublicContentController::class, 'index'])->name('content.index');
    Route::post('content', [PublicContentController::class, 'store'])->name('content.store');

});

// 🟢 COACH: Client Management & AI Tools
Route::middleware(['auth', 'role:coach'])->prefix('coach')->name('coach.')->group(function () {
    // Roster & Deep Dive
    Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show'); // The 360° Client View

    // 🔥 Assigning Goals and Programs to Clients
    Route::post('clients/{client}/goals', [ClientController::class, 'storeGoal'])->name('clients.goals.store');
    Route::post('clients/{client}/programs', [ClientController::class, 'assignProgram'])->name('clients.programs.assign');

    // AI Programs
    Route::resource('programs', ProgramController::class);
    Route::post('programs/generate-ai', [ProgramController::class, 'generateAI'])->name('programs.ai');

    // Calendar & Sessions
    Route::get('schedule', [CoachScheduleController::class, 'index'])->name('schedule.index'); // FullCalendar View
    Route::resource('sessions', SessionController::class);
    Route::post('sessions/{session}/notes', [SessionController::class, 'storeNotes'])->name('sessions.notes');

    Route::post('sessions/{session}/attendance', [SessionController::class, 'updateAttendance'])->name('sessions.attendance');

    // AI Assessments
    Route::get('assessments/create/{client}', [AssessmentController::class, 'create'])->name('assessments.create');
    Route::post('assessments', [AssessmentController::class, 'store'])->name('assessments.store');
});

// 🟢 CLIENT: Progress, Goals & Stripe
Route::middleware(['auth', 'role:client', EnsureActiveSubscription::class])->prefix('client')->name('client.')->group(function () {
    // Dashboard & Progress
    Route::get('progress', [ProgressController::class, 'index'])->name('progress.index');
    Route::get('schedule', [ClientScheduleController::class, 'index'])->name('schedule.index'); // Client Calendar

    // Goals + AI Advice
    Route::resource('goals', GoalController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::post('goals/{goal}/ai-advice', [GoalController::class, 'getAIAdvice'])->name('goals.ai');

    // Stripe Payments & Invoices
    Route::get('payments', [ClientPaymentController::class, 'index'])->name('payments.index');
    Route::post('payments/checkout', [ClientPaymentController::class, 'processStripe'])->name('payments.checkout');

    // NEW: Stripe Return URLs
    Route::get('payments/success', [ClientPaymentController::class, 'success'])->name('payments.success');
    Route::get('payments/cancel', [ClientPaymentController::class, 'cancel'])->name('payments.cancel');

    Route::get('payments/{payment}/invoice', [ClientPaymentController::class, 'downloadInvoice'])->name('payments.invoice');
});

require __DIR__.'/settings.php';
