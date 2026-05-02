import { Head, Link, usePage } from '@inertiajs/react';
import {
    Users,
    Calendar,
    Dumbbell,
    Activity,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Target
} from 'lucide-react';
import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const PIE_COLORS = ['#10b981', '#34d399', '#84cc16', '#14b8a6', '#22c55e'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function CoachDashboard({ activeClientsCount, upcomingSession, totalPrograms, chartData }: any) {
    const { language, isRTL } = useDashboardLanguage();
    const { auth } = usePage().props as any;
    const user = auth.user;
    const t = {
        en: {
            head: 'Coach Dashboard', morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening',
            welcome: 'Welcome to your coaching command center. Ready to inspire and lead your athletes today?',
            ai: 'Gemini AI Online', roster: 'Active Roster', clientsAssigned: 'Clients assigned to you', manageRoster: 'Manage roster',
            next: 'Teaching Next', noClasses: 'No upcoming classes scheduled.', customSession: 'Custom Session',
            library: 'Workout Library', programsCount: 'Programs created in library', openBuilder: 'Open AI Builder',
            attendance: '30-Day Attendance Trends', noSessionData: 'No session data recorded in the last 30 days.',
            distribution: 'Program Distribution', noPrograms: 'No clients assigned to programs yet.',
            toolkit: 'Coach Toolkit', myClients: 'My Clients', myClientsSub: 'Manage roster, set goals & track progress',
            aiGenerator: 'AI Generator', aiGeneratorSub: 'Build advanced programs with Gemini AI',
            calendar: 'Class Calendar', calendarSub: 'Schedule sessions and record attendance',
        },
        fr: {
            head: 'Tableau Coach', morning: 'Bonjour', afternoon: 'Bon apres-midi', evening: 'Bonsoir',
            welcome: 'Bienvenue dans votre centre de coaching. Pret a guider vos athletes ?',
            ai: 'Gemini AI en ligne', roster: 'Roster Actif', clientsAssigned: 'Clients assignes', manageRoster: 'Gerer le roster',
            next: 'Prochain Cours', noClasses: 'Aucun cours prevu.', customSession: 'Session personnalisée',
            library: 'Bibliotheque Programmes', programsCount: 'Programmes dans la bibliotheque', openBuilder: 'Ouvrir AI Builder',
            attendance: 'Tendance presence 30 jours', noSessionData: 'Aucune donnee de session sur 30 jours.',
            distribution: 'Distribution des programmes', noPrograms: 'Aucun client assigne a un programme.',
            toolkit: 'Outils Coach', myClients: 'Mes Clients', myClientsSub: 'Gerer roster, objectifs et progression',
            aiGenerator: 'Generateur IA', aiGeneratorSub: 'Creer des programmes avances avec Gemini AI',
            calendar: 'Calendrier', calendarSub: 'Planifier les sessions et presences',
        },
        ar: {
            head: 'لوحة المدرب', morning: 'صباح الخير', afternoon: 'مساء الخير', evening: 'مساء الخير',
            welcome: 'مرحبا بك في مركز التدريب. جاهز لقيادة الرياضيين اليوم؟',
            ai: 'Gemini AI متصل', roster: 'القائمة النشطة', clientsAssigned: 'عملاء معينون لك', manageRoster: 'ادارة القائمة',
            next: 'الحصة القادمة', noClasses: 'لا توجد حصص قادمة.', customSession: 'حصة مخصصة',
            library: 'مكتبة البرامج', programsCount: 'برامج موجودة في المكتبة', openBuilder: 'فتح منشئ الذكاء الاصطناعي',
            attendance: 'اتجاه الحضور 30 يوما', noSessionData: 'لا توجد بيانات جلسات خلال 30 يوما.',
            distribution: 'توزيع البرامج', noPrograms: 'لا يوجد عملاء مرتبطون بالبرامج بعد.',
            toolkit: 'عدة المدرب', myClients: 'عملائي', myClientsSub: 'ادارة القائمة والاهداف والتقدم',
            aiGenerator: 'مولد AI', aiGeneratorSub: 'بناء برامج متقدمة عبر Gemini AI',
            calendar: 'تقويم الحصص', calendarSub: 'جدولة الجلسات وتسجيل الحضور',
        },
    }[language];

    const hour = new Date().getHours();
    const greeting = hour < 12 ? t.morning : hour < 18 ? t.afternoon : t.evening;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="app-page-container">

                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-lime-600 to-emerald-600 p-8 rounded-3xl text-white shadow-lg">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            {greeting}, Coach {user.name.split(' ')[0]}!
                        </h2>
                        <p className="text-lime-100 mt-2 max-w-xl font-medium">{t.welcome}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-white/20 px-5 py-2.5 rounded-xl backdrop-blur-sm shadow-sm border border-white/10">
                        <Sparkles className="h-5 w-5 text-lime-50" />
                        <span className="font-bold text-lime-50 tracking-wide">{t.ai}</span>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="shadow-sm border-teal-100 dark:border-teal-900/50 rounded-3xl hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Users className="h-4 w-4 text-teal-500" /> {t.roster}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-foreground mt-1">{activeClientsCount}</div>
                            <p className="text-sm text-muted-foreground mt-1">{t.clientsAssigned}</p>
                            <Button variant="link" className="p-0 h-auto mt-3 text-teal-600 dark:text-teal-400 font-bold" asChild>
                                <Link href="/coach/clients" className="flex items-center">
                                    {t.manageRoster} <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-lime-100 dark:border-lime-900/50 rounded-3xl hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Calendar className="h-4 w-4 text-lime-500" /> {t.next}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {upcomingSession ? (
                                <div>
                                    <div className="text-xl font-black text-foreground mt-1 line-clamp-1">{upcomingSession.title}</div>
                                    <p className="text-sm font-medium text-muted-foreground mt-1">
                                        {new Date(upcomingSession.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <Badge variant="secondary" className="bg-lime-50 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400 border-none font-bold">
                                            {upcomingSession.program?.title || t.customSession}
                                        </Badge>
                                        <span className="text-xs font-bold text-muted-foreground">{upcomingSession.duration_minutes} min</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <p className="text-sm text-muted-foreground italic">{t.noClasses}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-emerald-100 dark:border-emerald-900/50 rounded-3xl hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Dumbbell className="h-4 w-4 text-emerald-500" /> {t.library}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-foreground mt-1">{totalPrograms}</div>
                            <p className="text-sm text-muted-foreground mt-1">{t.programsCount}</p>
                            <Button variant="link" className="p-0 h-auto mt-3 text-emerald-600 dark:text-emerald-400 font-bold" asChild>
                                <Link href="/coach/programs" className="flex items-center">
                                    {t.openBuilder} <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Charts Row */}
                {chartData && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* CHART 1: Attendance Bar Chart */}
                        <Card className="lg:col-span-2 rounded-3xl shadow-sm border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <CardHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" /> {t.attendance}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] p-6 pt-4">
                                {chartData.attendance.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData.attendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} allowDecimals={false} />
                                            <Tooltip
                                                cursor={{fill: 'transparent'}}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                            />
                                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 600 }} />
                                            <Bar dataKey="Attended" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                            <Bar dataKey="Missed" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 italic font-medium">
                                        {t.noSessionData}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* CHART 2: Program Distribution Pie Chart */}
                        <Card className="rounded-3xl shadow-sm border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <CardHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <Target className="h-5 w-5 text-lime-500" /> {t.distribution}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] flex flex-col p-6 pt-4">
                                {chartData.programs.length > 0 ? (
                                    <>
                                        <div className="flex-1 min-h-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={chartData.programs}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {chartData.programs.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                        itemStyle={{ fontWeight: 'bold' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="mt-2 space-y-2 max-h-[100px] overflow-y-auto pr-2">
                                            {chartData.programs.map((entry: any, index: number) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                                                        <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[150px]" title={entry.name}>{entry.name}</span>
                                                    </div>
                                                    <span className="font-extrabold text-slate-900 dark:text-white">{entry.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 italic text-center font-medium">
                                        <Activity className="h-8 w-8 mb-2 opacity-20" />
                                        {t.noPrograms}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Quick Actions Menu */}
                <div className="pt-4">
                    <h3 className="text-xl font-extrabold text-foreground mb-4">{t.toolkit}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        <Link href="/coach/clients" className="group block">
                            <Card className="bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-teal-50 dark:hover:bg-teal-900/10 border border-slate-200 dark:border-zinc-800 transition-all rounded-3xl h-full shadow-sm hover:shadow-md hover:border-teal-200 dark:hover:border-teal-900/50">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <div className="h-14 w-14 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                        <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <h4 className="font-extrabold text-lg text-foreground">{t.myClients}</h4>
                                    <p className="text-sm text-muted-foreground mt-2">{t.myClientsSub}</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/coach/programs" className="group block">
                            <Card className="bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-lime-50 dark:hover:bg-lime-900/10 border border-slate-200 dark:border-zinc-800 transition-all rounded-3xl h-full shadow-sm hover:shadow-md hover:border-lime-200 dark:hover:border-lime-900/50">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <div className="h-14 w-14 rounded-2xl bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                        <Sparkles className="h-6 w-6 text-lime-600 dark:text-lime-400" />
                                    </div>
                                    <h4 className="font-extrabold text-lg text-foreground">{t.aiGenerator}</h4>
                                    <p className="text-sm text-muted-foreground mt-2">{t.aiGeneratorSub}</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/coach/schedule" className="group block">
                            <Card className="bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 border border-slate-200 dark:border-zinc-800 transition-all rounded-3xl h-full shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                        <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h4 className="font-extrabold text-lg text-foreground">{t.calendar}</h4>
                                    <p className="text-sm text-muted-foreground mt-2">{t.calendarSub}</p>
                                </CardContent>
                            </Card>
                        </Link>

                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
