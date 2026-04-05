import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    ShieldAlert,
    Activity,
    Clock,
    Filter,
    TerminalSquare,
    Code,
    ServerCrash
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BreadcrumbItem } from '@/types';
import InertiaPagination from '@/components/inertia-pagination';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/analytics' },
    { title: 'System Logs', href: '/admin/logs' },
];

export default function LogsIndex({ logs, filters }: any) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleStatusFilter = (status: string) => {
        router.get("/admin/logs", { status }, { preserveState: true, replace: true });
    };

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
            case 'POST': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
            case 'PUT': return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
            case 'DELETE': return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'success'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
            : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Audit Logs | Admin" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <TerminalSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            System Audit Logs
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Monitor all HTTP requests, system activities, and background jobs.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-500/20 font-medium shadow-sm">
                        <Activity className="h-4 w-4 animate-pulse" /> Live Tracking Active
                    </div>
                </div>

                {/* Main Content Card */}
                <Card className="shadow-sm border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-visible bg-white dark:bg-zinc-950">

                    {/* Toolbar */}
                    <div className="p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <ShieldAlert className="h-4 w-4 text-indigo-500" /> Security & Request History
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mr-1">
                                <Filter size={16} /> Filter:
                            </div>
                            <Select defaultValue={filters.status ?? "all"} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl h-11">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="success">Success HTTP 200</SelectItem>
                                    <SelectItem value="error">Failed / Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Logs Table */}
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table className="w-full text-sm text-left">
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 hover:bg-transparent">
                                        <TableHead className="pl-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Timestamp</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Actor</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Endpoint Activity</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-600 dark:text-slate-300">Payload</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {logs.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-16">
                                                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                                                    <ServerCrash className="h-10 w-10 mb-3 opacity-20" />
                                                    <p className="text-base font-medium">No logs matched your criteria.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.data.map((log: any) => (
                                            <TableRow key={log.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">

                                                <TableCell className="pl-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                        <Clock className="h-3.5 w-3.5 mr-2" />
                                                        {new Date(log.created_at).toLocaleString('en-GB', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                        })}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            {log.user?.name || 'System / Guest'}
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {log.user?.email || 'Automated Action'}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className={`border-none py-0.5 px-2 font-mono text-xs ${getMethodColor(log.method)}`}>
                                                            {log.method}
                                                        </Badge>
                                                        <span className="text-sm font-mono text-slate-500 dark:text-slate-400 max-w-[200px] sm:max-w-[300px] truncate" title={log.url}>
                                                            {log.url.replace(window.location.origin, '')}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge variant="outline" className={`capitalize border-none px-2 py-0.5 ${getStatusColor(log.status)}`}>
                                                        {log.status}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right pr-6">
                                                    <details className="cursor-pointer group relative inline-block text-left">
                                                        <summary className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 list-none bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md transition-colors">
                                                            <Code className="h-3.5 w-3.5 mr-1" /> View JSON
                                                        </summary>

                                                        {/* Premium Tooltip for JSON */}
                                                        <div className="absolute right-0 mt-2 w-80 p-4 bg-slate-900 text-slate-50 dark:bg-black rounded-xl shadow-2xl border border-slate-800 text-left z-50 text-xs font-mono break-all hidden group-open:block max-h-72 overflow-y-auto">
                                                            <div className="mb-3 font-semibold text-slate-400 border-b border-slate-800 pb-2">
                                                                Action Route: {log.message || 'N/A'}
                                                            </div>
                                                            <pre className="whitespace-pre-wrap text-emerald-400">
                                                                {log.payload ? JSON.stringify(log.payload, null, 2) : '{}'}
                                                            </pre>
                                                            {log.exception_message && (
                                                                <div className="mt-3 text-red-400 border-t border-slate-800 pt-2 font-semibold">
                                                                    Exception: {log.exception_message}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </details>
                                                </TableCell>

                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6">
                    <InertiaPagination data={logs} />
                </div>

            </div>
        </AppLayout>
    );
}
