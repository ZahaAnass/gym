import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity, Calendar, Target, CreditCard, ArrowRight, TrendingDown, Sparkles, History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = ['#10b981', '#f43f5e']; // Emerald for Attended, Rose for Missed

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function ClientDashboard({ latestAssessment, nextSession, activeGoalsCount, chartData }: any) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Dashboard" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">

                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl text-white shadow-lg">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            {greeting}, {user.name.split(' ')[0]}!
                        </h2>
                        <p className="text-blue-100 mt-2 max-w-xl font-medium">
                            Welcome back to your training portal. Keep pushing towards your goals today!
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-white/20 px-5 py-2.5 rounded-xl backdrop-blur-sm shadow-sm border border-white/10">
                        <Sparkles className="h-5 w-5 text-blue-50" />
                        <span className="font-bold text-blue-50 tracking-wide">AI-Powered Journey</span>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">

                    <Card className="shadow-sm border-blue-100 dark:border-blue-900/50 rounded-3xl hover:shadow-md transition-all bg-white dark:bg-zinc-950">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Calendar className="h-4 w-4 text-blue-500" /> Up Next
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nextSession ? (
                                <div>
                                    <div className="text-xl font-black text-foreground mt-1 line-clamp-1">{nextSession.title}</div>
                                    <p className="text-sm font-medium text-muted-foreground mt-1">
                                        {new Date(nextSession.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none font-bold">
                                            Coach {nextSession.coach?.name.split(' ')[0]}
                                        </Badge>
                                        <span className="text-xs font-bold text-muted-foreground">{nextSession.duration_minutes} min</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <p className="text-sm text-muted-foreground italic">No upcoming classes scheduled.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-emerald-100 dark:border-emerald-900/50 rounded-3xl hover:shadow-md transition-all bg-white dark:bg-zinc-950">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Target className="h-4 w-4 text-emerald-500" /> Active Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-foreground mt-1">{activeGoalsCount}</div>
                            <p className="text-sm text-muted-foreground mt-1">Goals currently in progress</p>
                            <Button variant="link" className="p-0 h-auto mt-3 text-emerald-600 dark:text-emerald-400 font-bold" asChild>
                                <Link href="/client/goals" className="flex items-center">
                                    Update progress <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-purple-100 dark:border-purple-900/50 rounded-3xl hover:shadow-md transition-all bg-white dark:bg-zinc-950">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                                <TrendingDown className="h-4 w-4 text-purple-500" /> Current Weight
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latestAssessment ? (
                                <div>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <div className="text-4xl font-black text-foreground">{latestAssessment.weight}</div>
                                        <div className="text-sm text-muted-foreground font-bold">kg</div>
                                    </div>
                                    {latestAssessment.ideal_weight_ai && (
                                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-bold bg-purple-50 dark:bg-purple-900/20 py-1.5 px-2.5 rounded-lg inline-block">
                                            AI Target: {latestAssessment.ideal_weight_ai} kg
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="py-4">
                                    <p className="text-sm text-muted-foreground italic">No assessment data yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* 🔥 NEW: Analytics Charts Row */}
                {chartData && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* CHART 1: Weight History Area Chart */}
                        <Card className="lg:col-span-2 rounded-3xl shadow-sm border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <CardHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <Activity className="h-5 w-5 text-indigo-500" /> Biometric Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] p-6 pt-4">
                                {chartData.weight.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData.weight} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                                            <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} />
                                            <RechartsTooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#4f46e5" strokeWidth={4} fill="url(#colorWeight)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 italic font-medium">
                                        No biometric data logged yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* CHART 2: Attendance Pie Chart */}
                        <Card className="rounded-3xl shadow-sm border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <CardHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <History className="h-5 w-5 text-emerald-500" /> My Attendance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] flex flex-col p-6 pt-4">
                                {chartData.attendance.reduce((a:any, b:any) => a + b.value, 0) > 0 ? (
                                    <>
                                        <div className="flex-1 min-h-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={chartData.attendance}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {chartData.attendance.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                        itemStyle={{ fontWeight: 'bold' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {chartData.attendance.map((entry: any, index: number) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                                                        <span className="text-slate-600 dark:text-slate-300 font-medium">{entry.name}</span>
                                                    </div>
                                                    <span className="font-extrabold text-slate-900 dark:text-white">{entry.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 italic text-center font-medium">
                                        <Calendar className="h-8 w-8 mb-2 opacity-20" />
                                        No past sessions recorded yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Quick Actions Menu */}
                <div className="pt-4">
                    <h3 className="text-xl font-extrabold text-foreground mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        <Link href="/client/progress" className="group block">
                            <Card className="bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-slate-200 dark:border-zinc-800 transition-all rounded-3xl h-full shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                        <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h4 className="font-extrabold text-lg text-foreground">View Full Progress</h4>
                                    <p className="text-sm text-muted-foreground mt-2">Check AI reports & history</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/client/goals" className="group block">
                            <Card className="bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 border border-slate-200 dark:border-zinc-800 transition-all rounded-3xl h-full shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                        <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h4 className="font-extrabold text-lg text-foreground">Manage Goals</h4>
                                    <p className="text-sm text-muted-foreground mt-2">Set & update your targets</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/client/payments" className="group block">
                            <Card className="bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-amber-50 dark:hover:bg-amber-900/10 border border-slate-200 dark:border-zinc-800 transition-all rounded-3xl h-full shadow-sm hover:shadow-md hover:border-amber-200 dark:hover:border-amber-900/50">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <div className="h-14 w-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                        <CreditCard className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h4 className="font-extrabold text-lg text-foreground">Payments</h4>
                                    <p className="text-sm text-muted-foreground mt-2">View bills & subscriptions</p>
                                </CardContent>
                            </Card>
                        </Link>

                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
