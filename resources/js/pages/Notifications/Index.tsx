import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    CheckCircle2,
    CheckCheck,
    Info,
    AlertTriangle,
    CreditCard,
    Activity,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import InertiaPagination from '@/components/inertia-pagination';
import { useAppLanguage } from '@/hooks/use-app-language';
import { getPageTranslations } from '@/lang/pages';
import { toast } from 'sonner';

export default function NotificationsIndex({ notifications, unreadCount }: any) {
    const { language, isRTL } = useAppLanguage();
    const { flash } = usePage().props as any;
    const t = getPageTranslations(language).notifications;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.dashboard, href: '/dashboard' },
        { title: t.notifications, href: '/notifications' },
    ];

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const markAsRead = (id: string) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        if (unreadCount === 0) return;
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    // Helper to render the correct icon and color based on the notification payload
    const getNotificationIcon = (type?: string) => {
        switch (type) {
            case 'payment':
            case 'billing':
                return <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full"><CreditCard className="h-5 w-5" /></div>;
            case 'alert':
            case 'warning':
                return <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full"><AlertTriangle className="h-5 w-5" /></div>;
            case 'ai_assessment':
            case 'program':
                return <div className="p-2 bg-lime-100 dark:bg-lime-500/20 text-lime-600 dark:text-lime-400 rounded-full"><Activity className="h-5 w-5" /></div>;
            default:
                return <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full"><Info className="h-5 w-5" /></div>;
        }
    };

    // Format relative time (e.g., "2 hours ago")
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return t.justNow;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Bell className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            {t.notifications}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t.subtitle}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                    >
                        <CheckCheck className="mr-2 h-4 w-4" />
                        {t.markAll}
                    </Button>
                </div>

                {/* Inbox Card */}
                <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                    <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t.inbox}
                        </CardTitle>
                        {unreadCount > 0 && (
                            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3">
                                {unreadCount} {t.new}
                            </Badge>
                        )}
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {notifications.data.length === 0 ? (
                                <div className="text-center py-16 flex flex-col items-center">
                                    <Bell className="h-12 w-12 text-slate-300 dark:text-zinc-700 mb-3" />
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300">{t.caughtUp}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{t.noNew}</p>
                                </div>
                            ) : (
                                notifications.data.map((notification: any) => {
                                    const isUnread = notification.read_at === null;
                                    const data = notification.data || {};

                                    return (
                                        <div
                                            key={notification.id}
                                            className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50 relative ${isUnread ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}
                                        >
                                            {/* Unread Indicator Dot */}
                                            {isUnread && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 dark:bg-emerald-500 rounded-r-full" />
                                            )}

                                            <div className="shrink-0 mt-1">
                                                {getNotificationIcon(data.type)}
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h4 className={`text-base ${isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                                        {data.title || t.systemNotification}
                                                    </h4>
                                                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap flex items-center shrink-0">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {formatTimeAgo(notification.created_at)}
                                                    </span>
                                                </div>

                                                <p className={`text-sm ${isUnread ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                                    {data.message || t.defaultMessage}
                                                </p>

                                                {/* Action Links & Mark as Read */}
                                                <div className="pt-3 flex items-center gap-4">
                                                    {data.action_url && (
                                                        <Button variant="link" asChild className="p-0 h-auto text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                                                            <Link href={data.action_url}>
                                                                {data.action_text || t.viewDetails}
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {isUnread && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center transition-colors"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> {t.markRead}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6">
                    <InertiaPagination data={notifications} />
                </div>
            </div>
        </AppLayout>
    );
}
