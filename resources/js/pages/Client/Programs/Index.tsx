import { Head, Link } from '@inertiajs/react';
import {
    Dumbbell, Calendar, Flame, Target, Sparkles, Clock, ChevronRight
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { useAppLanguage } from '@/hooks/use-app-language';
import type { BreadcrumbItem } from '@/types';

export default function ClientPrograms({ programs, upcomingSessions, stats }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: { dashboard: 'Dashboard', myPrograms: 'My Programs', head: 'My Programs', title: 'My Training Programs', subtitle: 'View the workout plans assigned to you by your coach.', completed: 'Completed', workouts: 'Workouts', noInstructions: 'No specific instructions provided.', noActive: 'No Active Programs', noActiveSub: "Your coach hasn't assigned a specific training program to you yet. Check back soon!", assignedToYou: 'Assigned to You', aiOptimized: 'AI Optimized', assignedBy: 'Assigned By', dateAssigned: 'Date Assigned', workoutPlan: 'Your Workout Plan', upcoming: 'Upcoming Sessions', noUpcoming: 'No upcoming sessions scheduled.', viewCalendar: 'View Calendar', workoutSession: 'Workout Session', openCalendar: 'Open Full Calendar' },
        fr: { dashboard: 'Tableau', myPrograms: 'Mes programmes', head: 'Mes programmes', title: 'Mes programmes d entrainement', subtitle: 'Consultez les plans d entrainement assignes par votre coach.', completed: 'Completes', workouts: 'Entrainements', noInstructions: 'Aucune instruction specifique.', noActive: 'Aucun programme actif', noActiveSub: "Votre coach n'a pas encore assigne de programme.", assignedToYou: 'Assigne a vous', aiOptimized: 'Optimise IA', assignedBy: 'Assigne par', dateAssigned: 'Date d assignation', workoutPlan: 'Votre plan d entrainement', upcoming: 'Sessions a venir', noUpcoming: 'Aucune session a venir.', viewCalendar: 'Voir calendrier', workoutSession: 'Session entrainement', openCalendar: 'Ouvrir calendrier complet' },
        ar: { dashboard: 'لوحة التحكم', myPrograms: 'برامجي', head: 'برامجي', title: 'برامج تدريبي', subtitle: 'عرض برامج التدريب المخصصة لك من طرف المدرب.', completed: 'مكتملة', workouts: 'تمارين', noInstructions: 'لا توجد تعليمات محددة.', noActive: 'لا توجد برامج نشطة', noActiveSub: 'لم يقم مدربك بتعيين برنامج تدريب بعد.', assignedToYou: 'مخصص لك', aiOptimized: 'محسن بالذكاء الاصطناعي', assignedBy: 'تم التعيين بواسطة', dateAssigned: 'تاريخ التعيين', workoutPlan: 'خطة التمرين الخاصة بك', upcoming: 'الجلسات القادمة', noUpcoming: 'لا توجد جلسات قادمة.', viewCalendar: 'عرض التقويم', workoutSession: 'جلسة تمرين', openCalendar: 'فتح التقويم الكامل' },
    }[language];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.dashboard, href: '/client/dashboard' },
        { title: t.myPrograms, href: '/client/programs' },
    ];
    // Helper to format the workout plan text properly
    const renderWorkoutContent = (content: any) => {
        if (!content) {
return <p className="text-slate-500 italic">{t.noInstructions}</p>;
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
            <Head title={t.head} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Dumbbell className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            {t.title}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t.subtitle}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
                            <Flame className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{t.completed}</p>
                                <p className="text-sm font-extrabold">{stats.completed_workouts} {t.workouts}</p>
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
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.noActive}</h3>
                                    <p className="text-slate-500 mt-2 max-w-sm">
                                        {t.noActiveSub}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            programs.map((program: any, index: number) => (
                                <Card key={program.id} className={`shadow-md border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden ${index === 0 ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-950' : ''}`}>
                                    {/* Program Header Banner */}
                                    <div className="bg-gradient-to-r from-emerald-600 to-lime-600 p-6 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                            <Dumbbell className="h-48 w-48" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                                                    {t.assignedToYou}
                                                </Badge>
                                                {program.is_ai_generated && (
                                                    <Badge className="bg-emerald-900/50 text-emerald-100 border border-emerald-400/30 backdrop-blur-md flex items-center gap-1">
                                                        <Sparkles className="h-3 w-3" /> {t.aiOptimized}
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
                                                    <p className="text-xs text-slate-500 font-medium">{t.assignedBy}</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Coach {program.coach?.name || 'System'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 font-medium">{t.dateAssigned}</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(program.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">{t.workoutPlan}</h4>
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
                                    <Calendar className="h-5 w-5 text-emerald-500" /> {t.upcoming}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {upcomingSessions.length === 0 ? (
                                    <div className="p-6 text-center">
                                        <p className="text-sm text-slate-500">{t.noUpcoming}</p>
                                        <Button variant="link" asChild className="mt-2 text-emerald-600">
                                            <Link href="/client/schedule">{t.viewCalendar}</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                        {upcomingSessions.map((session: any) => (
                                            <div key={session.id} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{session.title || t.workoutSession}</h4>
                                                    <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-zinc-800">
                                                        {session.duration_minutes || 60} min
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
                                                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                                                    {new Date(session.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
                                    <Button variant="outline" className="w-full text-xs font-bold" asChild>
                                        <Link href="/client/schedule">{t.openCalendar} <ChevronRight className="ml-2 h-3 w-3"/></Link>
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
