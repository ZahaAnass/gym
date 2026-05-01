import { Head, Link } from '@inertiajs/react';
import {
    Dumbbell, Calendar, Flame, Target, Sparkles, Clock, ChevronRight
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/client/dashboard' },
    { title: 'My Programs', href: '/client/programs' },
];

export default function ClientPrograms({ programs, upcomingSessions, stats }: any) {
    // Helper to format the workout plan text properly
    const renderWorkoutContent = (content: any) => {
        if (!content) {
return <p className="text-slate-500 italic">No specific instructions provided.</p>;
}

        // Render the raw text with preserved line breaks
        return (
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800">
                {content}
            </p>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Programs" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Dumbbell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            My Training Programs
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            View the workout plans assigned to you by your coach.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
                            <Flame className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Completed</p>
                                <p className="text-sm font-extrabold">{stats.completed_workouts} Workouts</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: The Assigned Programs (READ ONLY) */}
                    <div className="lg:col-span-2 space-y-6">
                        {programs.length === 0 ? (
                            <Card className="border-dashed border-2 border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/20">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <Target className="h-12 w-12 text-slate-300 dark:text-zinc-600 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Active Programs</h3>
                                    <p className="text-slate-500 mt-2 max-w-sm">
                                        Your coach hasn't assigned a specific training program to you yet. Check back soon!
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            programs.map((program: any, index: number) => (
                                <Card key={program.id} className={`shadow-md border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden ${index === 0 ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-950' : ''}`}>
                                    {/* Program Header Banner */}
                                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                            <Dumbbell className="h-48 w-48" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                                                    Assigned to You
                                                </Badge>
                                                {program.is_ai_generated && (
                                                    <Badge className="bg-indigo-900/50 text-indigo-100 border border-indigo-400/30 backdrop-blur-md flex items-center gap-1">
                                                        <Sparkles className="h-3 w-3" /> AI Optimized
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-extrabold mb-1">{program.title}</h3>
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-zinc-800">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                                    {program.coach?.name ? program.coach.name.charAt(0) : 'C'}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">Assigned By</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Coach {program.coach?.name || 'System'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 font-medium">Date Assigned</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(program.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Your Workout Plan</h4>
                                            {/* READ ONLY TEXT */}
                                            {renderWorkoutContent(program.description)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* RIGHT COLUMN: Upcoming Schedule */}
                    <div className="space-y-6">
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/30 border-b border-slate-100 dark:border-zinc-800">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-indigo-500" /> Upcoming Sessions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {upcomingSessions.length === 0 ? (
                                    <div className="p-6 text-center">
                                        <p className="text-sm text-slate-500">No upcoming sessions scheduled.</p>
                                        <Button variant="link" asChild className="mt-2 text-indigo-600">
                                            <Link href="/client/schedule">View Calendar</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                        {upcomingSessions.map((session: any) => (
                                            <div key={session.id} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{session.title || 'Workout Session'}</h4>
                                                    <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-zinc-800">
                                                        {session.duration_minutes || 60} min
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
                                                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                                                    {new Date(session.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
                                    <Button variant="outline" className="w-full text-xs font-bold" asChild>
                                        <Link href="/client/schedule">Open Full Calendar <ChevronRight className="ml-2 h-3 w-3"/></Link>
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
