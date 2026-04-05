<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicContentController extends Controller
{
    public function index()
    {
        // Placeholder for public content management (e.g., Homepage text, Gym rules)
        // Usually, this pulls from a `settings` table or a JSON config file.
        $content = [
            'hero_title' => 'Welcome to AI Gym',
            'announcement' => 'New Yoga classes starting next week!',
            'contact_email' => 'contact@gym.com',
        ];

        return Inertia::render('Admin/Content/Index', [
            'content' => $content,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hero_title' => 'required|string',
            'announcement' => 'nullable|string',
            'contact_email' => 'required|email',
        ]);

        // Logic to save this to your database or config file goes here.
        // For the presentation, you can just return a success message.

        return back()->with('success', 'Public content updated successfully.');
    }
}
