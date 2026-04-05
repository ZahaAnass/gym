<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['roles', 'coach']);

        // 1. Advanced Search Filtering
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // 2. Role Filtering
        if ($role = $request->input('role')) {
            if ($role !== 'all') {
                $query->role($role);
            }
        }

        // 3. Coach Assignment Filtering
        if ($coach_id = $request->input('coach_id')) {
            if ($coach_id === 'unassigned') {
                $query->whereNull('coach_id')->role('client');
            } elseif ($coach_id !== 'all') {
                $query->where('coach_id', $coach_id);
            }
        }

        // 4. Dynamic Sorting
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('Admin/Users/Index', [
            'users' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'role', 'coach_id', 'sort', 'direction']),
            'coaches' => User::role('coach')->get(['id', 'name']),
            'stats' => [
                'total' => User::count(),
                'admins' => User::role('admin')->count(),
                'coaches' => User::role('coach')->count(),
                'clients' => User::role('client')->count(),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all(['name']),
            'coaches' => User::role('coach')->get(['id', 'name'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,name',
            'coach_id' => 'nullable|exists:users,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'coach_id' => $validated['role'] === 'client' ? $validated['coach_id'] : null,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('admin.users.index')->with('success', 'Account created successfully.');
    }

    public function edit(User $user)
    {
        $user->load('roles');

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => Role::all(['name']),
            'coaches' => User::role('coach')->get(['id', 'name'])
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => 'required|exists:roles,name',
            'coach_id' => 'nullable|exists:users,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'coach_id' => $validated['role'] === 'client' ? $validated['coach_id'] : null,
        ]);

        if (!empty($validated['password'])) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        $user->syncRoles([$validated['role']]);

        return redirect()->route('admin.users.index')->with('success', 'Account updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Critical Action Prevented: You cannot delete your own administrator account.');
        }

        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User account permanently deleted.');
    }
}
