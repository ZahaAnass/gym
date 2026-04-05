import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Activity, Calendar, Clock, TrendingDown, User as UserIcon, Bot, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';

export default function ProgressIndex({ assessments, upcoming_sessions }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Progress', href: '/client/progress' },
    ];

    const latestAssessment = assessments[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Progress" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Progress & AI Insights
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your physical development and upcoming training sessions.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Biometrics & AI Feedback */}
                    <Card className="shadow-sm border-indigo-200 dark:border-indigo-900/50 rounded-2xl overflow-hidden">
                        <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
                            <CardTitle className="flex items-center gap-2 text-lg text-indigo-900 dark:text-indigo-100">
                                <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                Latest Gemini AI Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {latestAssessment ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-sm text-center">
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Current Weight</p>
                                            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{latestAssessment.weight} <span className="text-lg text-slate-400">kg</span></p>
                                        </div>
                                        <div className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-md text-center relative overflow-hidden">
                                            <Sparkles className="absolute top-2 right-2 h-4 w-4 text-white/40" />
                                            <p className="text-sm font-medium text-indigo-100 mb-1">AI Target Weight</p>
                                            <p className="text-4xl font-extrabold">{latestAssessment.ideal_weight_ai || '--'} <span className="text-lg text-indigo-200">kg</span></p>
                                        </div>
                                    </div>

                                    {latestAssessment.advice && (
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800">
                                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                                <TrendingDown className="h-4 w-4 text-indigo-500" /> AI Strategy Recommendation
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {latestAssessment.advice}
                                            </p>
                                        </div>
                                    )}
                                    <div className="text-xs text-slate-400 text-center">
                                        Last assessment run by your coach on {new Date(latestAssessment.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <Bot className="h-12 w-12 text-slate-300 dark:text-zinc-700 mb-3" />
                                    <p className="text-slate-500 font-medium">No AI assessment data available yet.</p>
                                    <p className="text-sm text-slate-400 mt-1">Ask your coach to run an assessment during your next session.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Sessions / Planning */}
                    <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden h-fit">
                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5 text-indigo-500" />
                                Upcoming Training Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {upcoming_sessions.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">
                                        No upcoming classes scheduled with your coach.
                                    </div>
                                ) : (
                                    upcoming_sessions.map((session: any) => (
                                        <div key={session.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{session.title}</h4>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md"><Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-500"/> {session.duration_minutes} min</span>
                                                    <span className="flex items-center"><UserIcon className="h-3.5 w-3.5 mr-1.5"/> Coach {session.coach?.name}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-none px-3 py-1">
                                                    {new Date(session.scheduled_at).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
