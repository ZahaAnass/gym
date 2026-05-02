import { Head } from '@inertiajs/react';
import {
    TrendingUp,
    Users,
    Activity,
    CreditCard,
    LineChart as LineChartIcon
} from 'lucide-react';
import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppLanguage } from '@/hooks/use-app-language';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function AnalyticsIndex({ stats }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: {
            breadcrumb: 'Admin Analytics', head: 'Enterprise Analytics | Admin', title: 'Enterprise Analytics', subtitle: 'High-level overview of gym performance, cached securely via Redis.',
            totalRevenue: 'Total Lifetime Revenue', activeMemberships: 'Active Memberships', totalUsers: 'Total System Users', growth: '6-Month Revenue Growth', growthSub: 'Monthly income from completed client subscriptions.', revenue: 'Revenue',
        },
        fr: {
            breadcrumb: 'Analytique Admin', head: "Analytique Entreprise | Admin", title: "Analytique d'entreprise", subtitle: "Vue d'ensemble des performances de la salle, mise en cache de maniere securisee via Redis.",
            totalRevenue: 'Revenu total cumule', activeMemberships: 'Abonnements actifs', totalUsers: "Utilisateurs totaux du systeme", growth: 'Croissance du revenu sur 6 mois', growthSub: 'Revenu mensuel issu des abonnements clients completes.', revenue: 'Revenu',
        },
        ar: {
            breadcrumb: 'تحليلات الادمن', head: 'تحليلات المؤسسة | الادمن', title: 'تحليلات المؤسسة', subtitle: 'نظرة شاملة على اداء النادي مع تخزين مؤقت امن عبر Redis.',
            totalRevenue: 'اجمالي الايرادات الكلية', activeMemberships: 'الاشتراكات النشطة', totalUsers: 'اجمالي مستخدمي النظام', growth: 'نمو الايرادات خلال 6 اشهر', growthSub: 'الدخل الشهري من اشتراكات العملاء المكتملة.', revenue: 'الايرادات',
        },
    }[language];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.breadcrumb, href: '/admin/analytics' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0 }).format(amount || 0);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="admin-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="admin-page-header">
                    <div>
                        <h2 className="admin-page-title">
                            <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            {t.title}
                        </h2>
                        <p className="admin-page-subtitle">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.totalRevenue}</span>
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(stats.total_revenue)}</span>
                            </div>
                            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.activeMemberships}</span>
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.active_clients}</span>
                            </div>
                            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center">
                                <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.totalUsers}</span>
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total_users}</span>
                            </div>
                            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Revenue Chart */}
                <Card className="admin-surface">
                    <CardHeader className="border-b border-slate-100 dark:border-zinc-800 pb-6">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <LineChartIcon className="h-5 w-5 text-indigo-500" /> {t.growth}
                        </CardTitle>
                        <CardDescription>{t.growthSub}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={Array.isArray(stats.chart_data) ? stats.chart_data : Object.values(stats.chart_data || {})} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val} DH`} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number) => [`${value} MAD`, t.revenue]}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
