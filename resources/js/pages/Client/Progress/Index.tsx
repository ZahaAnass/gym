import { Head, Link } from '@inertiajs/react';
import {
    Activity, Calendar, Clock, TrendingDown, User as UserIcon, Bot, Sparkles, Scale, ArrowRight
} from 'lucide-react';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function ProgressIndex({ assessments, chartData, upcoming_sessions }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Progress & AI Insights', href: '/client/progress' },
    ];

    // Get the absolute latest assessment for the highlight cards
    const latestAssessment = assessments[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Progress & AI Insights | Client" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Progress & AI Insights
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Track your physical development, AI recommendations, and upcoming training sessions.
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left/Main Column: Biometrics & AI Feedback */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Highlight Biometrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950 overflow-hidden">
                                <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                                    <Scale className="h-6 w-6 text-indigo-500 mb-3" />
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Current Weight</p>
                                    <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                                        {latestAssessment ? latestAssessment.weight : '--'} <span className="text-xl sm:text-2xl text-slate-400">kg</span>
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-md border-transparent rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Bot className="h-16 w-16" />
                                </div>
                                <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center text-center relative z-10">
                                    <Sparkles className="h-6 w-6 text-indigo-200 mb-3" />
                                    <p className="text-sm font-bold text-indigo-100 uppercase tracking-wider mb-1">AI Ideal Target</p>
                                    <p className="text-4xl sm:text-5xl font-extrabold">
                                        {latestAssessment ? latestAssessment.ideal_weight_ai : '--'} <span className="text-xl sm:text-2xl text-indigo-200">kg</span>
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Progression Chart */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-5">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingDown className="h-5 w-5 text-indigo-500" /> Biometric History
                                </CardTitle>
                                <CardDescription>Your weight progression mapped over time.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {chartData.length < 2 ? (
                                    <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                                        <TrendingDown className="h-12 w-12 mb-3 opacity-20" />
                                        <p className="font-medium text-slate-700 dark:text-slate-300">Not enough data to display chart.</p>
                                        <p className="text-sm mt-1">Your coach needs to run at least two AI assessments.</p>
                                    </div>
                                ) : (
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value: number) => [`${value} kg`, 'Weight']}
                                                />
                                                {latestAssessment?.ideal_weight_ai && (
                                                    <ReferenceLine y={latestAssessment.ideal_weight_ai} stroke="#8b5cf6" strokeDasharray="3 3" label={{ position: 'top', value: 'AI Target', fill: '#8b5cf6', fontSize: 12 }} />
                                                )}
                                                <Line type="monotone" dataKey="weight" stroke="#4f46e5" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* AI Health Advice */}
                        {latestAssessment?.advice && (
                            <div className="p-6 sm:p-8 rounded-3xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-xl">
                                        <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h4 className="text-lg font-extrabold text-purple-900 dark:text-purple-100">
                                        Doctor Gemini's Strategy
                                    </h4>
                                </div>
                                <p className="text-sm sm:text-base text-purple-800 dark:text-purple-200 leading-relaxed whitespace-pre-wrap">
                                    {latestAssessment.advice}
                                </p>
                                <p className="text-xs text-purple-400 dark:text-purple-500/60 mt-4 font-medium uppercase tracking-wider">
                                    Generated on {new Date(latestAssessment.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Upcoming Sessions */}
                    <div className="space-y-6">
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950 sticky top-24">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-5">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5 text-indigo-500" />
                                    Upcoming Schedule
                                </CardTitle>
                                <CardDescription>Your next classes.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {upcoming_sessions.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500">
                                            <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                            <p className="text-sm font-medium">No upcoming classes.</p>
                                        </div>
                                    ) : (
                                        upcoming_sessions.map((session: any) => (
                                            <div key={session.id} className="p-5 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{session.title}</h4>

                                                <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-indigo-500" />
                                                        {new Date(session.scheduled_at).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <UserIcon className="h-4 w-4 text-emerald-500" />
                                                        Coach {session.coach?.name || 'Staff'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/30">
                                    <Button asChild variant="outline" className="w-full bg-white dark:bg-zinc-950 rounded-xl">
                                        <Link href="/client/schedule">
                                            View Full Calendar <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
