<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class PublicContentController extends Controller
{
    /**
     * 🟢 THE PUBLIC ROUTE ('/')
     * Loads the landing page for guests in milliseconds using Redis.
     */
    public function showWelcome()
    {
        // Fetch the dynamic content from Redis, fallback to defaults if empty
        $content = Cache::get('cms:public_content', $this->getDefaultContent());

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'content' => $content, // Passes the dynamic text to React
        ]);
    }

    /**
     * 🟢 THE ADMIN ROUTE
     * Renders the CMS form in the Admin Dashboard.
     */
    public function index()
    {
        $content = Cache::get('cms:public_content', $this->getDefaultContent());

        return Inertia::render('Admin/Content/Index', [
            'content' => $content,
        ]);
    }

    /**
     * 🟢 THE ADMIN STORE ROUTE
     * Saves the updated content permanently into Redis RAM.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'hero_title' => 'required|string|max:255',
            'announcement' => 'nullable|string|max:255',
            'contact_email' => 'required|email|max:255',
        ]);

        // 🔥 ENTERPRISE UPGRADE: Store key-value settings in Redis permanently
        Cache::forever('cms:public_content', $validated);

        return back()->with('success', 'Public landing page content updated live via Redis!');
    }

    /**
     * Fallback default content if Redis is empty
     */
    private function getDefaultContent()
    {
        return [
            'hero_title' => 'The Future of Fitness is Intelligent.',
            'announcement' => '🎉 Welcome to our newly upgraded AI Gym facility!',
            'contact_email' => 'contact@aigym.com',
        ];
    }
}
