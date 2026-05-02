import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Dumbbell,
    AlertOctagon,
    CreditCard,
    Activity,
    ArrowRight
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppLanguage } from '@/hooks/use-app-language';
import { getDictionary } from '@/lang';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

// Breadcrumbs for your AppLayout
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Admin Overview', href: '/admin/analytics' },
];

export default function AdminDashboard({ stats, recent_logs }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = getDictionary(language).adminDashboard;

    // Format currency for the revenue stat
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD', // Change to EUR or USD if needed
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    // Helper for log method colors
    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'POST': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'PUT': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
            case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="admin-page-container">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t.subtitle}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg border">
                        <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                        {t.online}
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                    {/* Revenue Card */}
                    <Card className="shadow-sm border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t.totalRevenue}
                            </CardTitle>
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(stats.total_revenue)}
                            </div>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                                {t.revenueSub}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Active Clients Card */}
                    <Card className="shadow-sm border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t.activeClients}
                            </CardTitle>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.active_clients}
                            </div>
                            <Link href="/admin/users" className="text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline inline-flex items-center">
                                {t.manageClients} <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Active Coaches Card */}
                    <Card className="shadow-sm border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t.coaches}
                            </CardTitle>
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                <Dumbbell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.active_coaches}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t.coachesSub}
                            </p>
                        </CardContent>
                    </Card>

                    {/* System Errors Card */}
                    <Card className="shadow-sm border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t.errors}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stats.system_errors > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                <AlertOctagon className={`h-4 w-4 ${stats.system_errors > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.system_errors}
                            </div>
                            {stats.system_errors > 0 ? (
                                <Link href="/admin/logs?status=error" className="text-xs text-red-600 dark:text-red-400 mt-1 hover:underline inline-flex items-center">
                                    {t.reviewLogs} <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            ) : (
                                <p className="text-xs text-emerald-600 mt-1 font-medium">
                                    {t.perfect}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Recent Activity Snapshot */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.feed}</h3>
                        <Link href="/admin/logs" className="text-sm text-primary hover:underline flex items-center">
                            {t.viewAll} <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </div>

                    <Card className="shadow-sm overflow-hidden border-gray-200 dark:border-gray-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 font-medium">{t.timestamp}</th>
                                    <th className="px-6 py-4 font-medium">{t.actor}</th>
                                    <th className="px-6 py-4 font-medium">{t.action}</th>
                                    <th className="px-6 py-4 font-medium text-right">{t.status}</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/20">
                                {recent_logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                            {t.noActivity}
                                        </td>
                                    </tr>
                                ) : (
                                    recent_logs.map((log: any) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                                                {log.user ? log.user.name : t.systemAuto}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className={`border-none py-0.5 px-2 ${getMethodColor(log.method)}`}>
                                                        {log.method}
                                                    </Badge>
                                                    <span className="text-muted-foreground truncate max-w-[200px]" title={log.url}>
                                                            {log.url.replace(window.location.origin, '')}
                                                        </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Badge variant="outline" className={`capitalize ${log.status === 'success' ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800' : 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'}`}>
                                                    {log.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}
