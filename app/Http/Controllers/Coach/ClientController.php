<?php
namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index() {
        $clients = User::role('client')->where('coach_id', auth()->id())->get();
        return Inertia::render('Coach/Clients/Index', ['clients' => $clients]);
    }
}
