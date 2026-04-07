import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    User, Activity, Target, Calendar, Bot, ArrowLeft, Plus, CheckCircle2, TrendingDown, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function ClientProfile({ client, assessments, chartData, goals, upcomingSessions, pastSessions }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My Roster', href: '/coach/clients' },
        { title: client.name, href: `/coach/clients/${client.id}` },
    ];

    const latestAssessment = assessments[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${client.name} | 360° Profile`} />

            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg border-4 border-white dark:border-zinc-950">
                            {client.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {client.name}
                                </h2>
                                <Badge className={client.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-none' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-none'}>
                                    {client.is_active ? 'Access Active' : 'Account Overdue'}
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{client.email} • Joined {client.joined_at}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" asChild className="bg-white dark:bg-zinc-900">
                            <Link href="/coach/clients"><ArrowLeft className="mr-2 h-4 w-4"/> Back</Link>
                        </Button>
                        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Link href={`/coach/assessments/create/${client.id}`}>
                                <Bot className="mr-2 h-4 w-4"/> Run AI Assessment
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 pt-4">

                    {/* Left Column: Biometrics & Chart */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Progress Chart */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-indigo-500" /> Biometric Progression
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {chartData.length < 2 ? (
                                    <div className="py-12 text-center text-slate-500 flex flex-col items-center">
                                        <TrendingDown className="h-10 w-10 mb-2 opacity-20" />
                                        <p>Not enough data to display chart.</p>
                                        <p className="text-xs mt-1">Run at least two AI assessments to track progression.</p>
                                    </div>
                                ) : (
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                />
                                                {/* Draw Target Line if the latest assessment has one */}
                                                {latestAssessment?.ideal_weight_ai && (
                                                    <ReferenceLine y={latestAssessment.ideal_weight_ai} stroke="#8b5cf6" strokeDasharray="3 3" label={{ position: 'top', value: 'AI Target', fill: '#8b5cf6', fontSize: 12 }} />
                                                )}
                                                <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* AI Health Advice Bilan */}
                        {latestAssessment && latestAssessment.advice && (
                            <Card className="shadow-sm border-purple-200 dark:border-purple-900/50 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10">
                                <CardContent className="p-6">
                                    <h4 className="font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2 mb-3">
                                        <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        Latest Gemini Health Strategy
                                    </h4>
                                    <p className="text-sm text-purple-800 dark:text-purple-300 leading-relaxed whitespace-pre-wrap">
                                        {latestAssessment.advice}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Goals & Schedule */}
                    <div className="space-y-6">

                        {/* Goals */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 h-fit">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 py-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Target className="h-4 w-4 text-emerald-500" /> Active Goals
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-zinc-800">
                                {goals.length === 0 ? (
                                    <p className="p-6 text-center text-sm text-slate-500">No active goals set by client.</p>
                                ) : (
                                    goals.map((goal: any) => (
                                        <div key={goal.id} className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{goal.title}</h4>
                                                {goal.status === 'reached' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2 mb-1 overflow-hidden">
                                                <div
                                                    className={`h-full ${goal.status === 'reached' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                    style={{ width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>{goal.current_value}</span>
                                                <span>{goal.target_value} target</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Upcoming Schedule */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 h-fit">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 py-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500" /> Upcoming Classes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-zinc-800">
                                {upcomingSessions.length === 0 ? (
                                    <p className="p-6 text-center text-sm text-slate-500">No upcoming sessions booked.</p>
                                ) : (
                                    upcomingSessions.map((session: any) => (
                                        <div key={session.id} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{session.title}</h4>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                <span className="flex items-center"><Clock className="h-3 w-3 mr-1"/> {new Date(session.scheduled_at).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
