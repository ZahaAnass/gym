<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;

class SystemAuditLogger
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (auth()->check() && ! str_contains($request->url(), '/logs')) {
            AuditLog::create([
                'user_id' => auth()->id(),
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'status' => $response->isSuccessful() ? 'success' : 'error',
                'message' => $request->route() ? $request->route()->getName() : null,
                'payload' => $request->except(['password', 'password_confirmation', '_token']),
            ]);
        }

        return $response;
    }
}
