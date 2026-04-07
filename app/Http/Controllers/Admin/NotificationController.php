<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\SystemBroadcast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Notifications/Create');
    }

    public function broadcast(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,alert,success',
            'target_audience' => 'required|in:all,clients,coaches,unpaid_clients',
            'action_url' => 'nullable|url',
            'action_text' => 'nullable|string|max:50',
        ]);

        $users = collect();

        // Determine target audience
        switch ($validated['target_audience']) {
            case 'all':
                $users = User::all();
                break;
            case 'clients':
                $users = User::role('client')->get();
                break;
            case 'coaches':
                $users = User::role('coach')->get();
                break;
            case 'unpaid_clients':
                $users = User::role('client')->whereDoesntHave('payments', function ($q) {
                    $q->where('status', 'completed')
                        ->where('created_at', '>=', now()->subDays(30))
                        ->whereRaw('payments.id = (SELECT MAX(id) FROM payments p2 WHERE p2.user_id = users.id)');
                })->get();
                break;
        }

        if ($users->isEmpty()) {
            return back()->with('error', 'No users found in the selected target audience.');
        }

        // Send the notification to the collection of users
        Notification::send($users, new SystemBroadcast(
            $validated['title'],
            $validated['message'],
            $validated['type'],
            $validated['action_url'],
            $validated['action_text']
        ));

        return back()->with('success', "Notification successfully broadcasted to {$users->count()} users.");
    }
}
