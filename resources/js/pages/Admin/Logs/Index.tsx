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
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import InertiaPagination from '@/components/inertia-pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppLanguage } from '@/hooks/use-app-language';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/analytics' },
    { title: 'System Logs', href: '/admin/logs' },
];

export default function LogsIndex({ logs, filters }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: { head: 'System Audit Logs | Admin', title: 'System Audit Logs', subtitle: 'Monitor all HTTP requests, system activities, and background jobs.', live: 'Live Tracking Active', filter: 'Filter:', all: 'All Statuses', success: 'Success HTTP 200', error: 'Failed / Error', timestamp: 'Timestamp', actor: 'Actor', activity: 'Endpoint Activity', status: 'Status', payload: 'Payload', empty: 'No logs matched your criteria.', viewJson: 'View JSON' },
        fr: { head: 'Journaux systeme | Admin', title: 'Journaux de controle systeme', subtitle: 'Surveillez les requetes HTTP, activites systeme et taches en arriere-plan.', live: 'Suivi en direct actif', filter: 'Filtre :', all: 'Tous les statuts', success: 'Succes HTTP 200', error: 'Echec / Erreur', timestamp: 'Horodatage', actor: 'Acteur', activity: 'Activite endpoint', status: 'Statut', payload: 'Payload', empty: 'Aucun journal ne correspond au filtre.', viewJson: 'Voir JSON' },
        ar: { head: 'سجلات تدقيق النظام | الادمن', title: 'سجلات تدقيق النظام', subtitle: 'مراقبة جميع طلبات HTTP وانشطة النظام والمهام الخلفية.', live: 'التتبع المباشر مفعل', filter: 'تصفية:', all: 'كل الحالات', success: 'ناجح HTTP 200', error: 'فشل / خطا', timestamp: 'الوقت', actor: 'المنفذ', activity: 'نشاط المسار', status: 'الحالة', payload: 'البيانات', empty: 'لا توجد سجلات مطابقة للفلاتر.', viewJson: 'عرض JSON' },
    }[language];
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
toast.success(flash.success);
}

        if (flash?.error) {
toast.error(flash.error);
}
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
            <Head title={t.head} />

            <div className="admin-page-container" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* Header Section */}
                <div className="admin-page-header">
                    <div>
                        <h2 className="admin-page-title">
                            <TerminalSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            {t.title}
                        </h2>
                        <p className="admin-page-subtitle">
                            {t.subtitle}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-500/20 font-medium shadow-sm">
                        <Activity className="h-4 w-4 animate-pulse" /> {t.live}
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
                                <Filter size={16} /> {t.filter}
                            </div>
                            <Select defaultValue={filters.status ?? "all"} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl h-11">
                                    <SelectValue placeholder={t.filter} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t.all}</SelectItem>
                                    <SelectItem value="success">{t.success}</SelectItem>
                                    <SelectItem value="error">{t.error}</SelectItem>
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
                                        <TableHead className="pl-6 py-4 font-semibold text-slate-600 dark:text-slate-300">{t.timestamp}</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">{t.actor}</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">{t.activity}</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">{t.status}</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-600 dark:text-slate-300">{t.payload}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {logs.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-16">
                                                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                                                    <ServerCrash className="h-10 w-10 mb-3 opacity-20" />
                                                    <p className="text-base font-medium">{t.empty}</p>
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
                                                            <Code className="h-3.5 w-3.5 mr-1" /> {t.viewJson}
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
