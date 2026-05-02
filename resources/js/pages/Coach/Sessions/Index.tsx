import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    BookOpen, CalendarPlus, Clock, Users, Dumbbell, History, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbItem } from '@/types';
import InertiaPagination from '@/components/inertia-pagination';
import { useAppLanguage } from '@/hooks/use-app-language';
import { toast } from 'sonner';

export default function SessionsIndex({ upcomingSessions, pastSessions, programs, stats }: any) {
    const { language, isRTL } = useAppLanguage();
    const { flash } = usePage().props as any;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const t = {
        en: { dashboard: 'Dashboard', classPlanning: 'Class Planning', head: 'Class Planning | Coach', title: 'Class Planning & Notes', subtitle: 'Schedule group classes, track attendance, and log post-workout evaluations.', scheduleClass: 'Schedule Class', scheduleNew: 'Schedule New Session', classTitle: 'Class Title', assignProgram: 'Assign Program (Optional)', selectProgram: 'Select a program', noneCustom: 'None (Custom Session)', dateTime: 'Date & Time', duration: 'Duration (mins)', maxCapacity: 'Max Capacity', createSession: 'Create Session', upcoming: 'Upcoming', past: 'Past', noUpcoming: 'No upcoming sessions scheduled.', noPast: 'No past sessions on record.', customWorkout: 'Custom Workout', enrolled: 'Enrolled', mins: 'mins', viewLog: 'View & Log Notes', manageRoster: 'Manage Roster' },
        fr: { dashboard: 'Tableau', classPlanning: 'Planification', head: 'Planification | Coach', title: 'Planification & Notes', subtitle: 'Planifiez les cours, suivez la presence et ajoutez des notes.', scheduleClass: 'Planifier cours', scheduleNew: 'Planifier une session', classTitle: 'Titre du cours', assignProgram: 'Assigner programme (optionnel)', selectProgram: 'Selectionner un programme', noneCustom: 'Aucun (session personnalisee)', dateTime: 'Date et heure', duration: 'Duree (min)', maxCapacity: 'Capacite max', createSession: 'Creer session', upcoming: 'A venir', past: 'Passe', noUpcoming: 'Aucune session a venir.', noPast: 'Aucune session passee.', customWorkout: 'Entrainement personnalise', enrolled: 'Inscrits', mins: 'min', viewLog: 'Voir & noter', manageRoster: 'Gerer le roster' },
        ar: { dashboard: 'لوحة التحكم', classPlanning: 'تخطيط الحصص', head: 'تخطيط الحصص | المدرب', title: 'تخطيط الحصص والملاحظات', subtitle: 'جدولة الحصص الجماعية وتتبع الحضور وتسجيل ملاحظات ما بعد التمرين.', scheduleClass: 'جدولة حصة', scheduleNew: 'جدولة جلسة جديدة', classTitle: 'عنوان الحصة', assignProgram: 'تعيين برنامج (اختياري)', selectProgram: 'اختر برنامجا', noneCustom: 'بدون (جلسة مخصصة)', dateTime: 'التاريخ والوقت', duration: 'المدة (دقيقة)', maxCapacity: 'السعة القصوى', createSession: 'انشاء جلسة', upcoming: 'القادمة', past: 'السابقة', noUpcoming: 'لا توجد جلسات قادمة.', noPast: 'لا توجد جلسات سابقة.', customWorkout: 'تمرين مخصص', enrolled: 'مسجلون', mins: 'د', viewLog: 'عرض وتسجيل ملاحظات', manageRoster: 'ادارة القائمة' },
    }[language];

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        program_id: 'none',
        scheduled_at: '',
        duration_minutes: '60',
        max_participants: '10',
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleCreateSession = (e: React.FormEvent) => {
        e.preventDefault();
        // Convert "none" string to null for Laravel validation
        const payload = { ...data, program_id: data.program_id === 'none' ? null : data.program_id };

        router.post('/coach/sessions', payload, {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            }
        });
    };

    const SessionCard = ({ session, isPast }: { session: any, isPast: boolean }) => (
        <Card className={`shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col h-full hover:shadow-md transition-shadow ${isPast ? 'bg-slate-50/50 dark:bg-zinc-900/30' : 'bg-white dark:bg-zinc-950'}`}>
            <CardContent className="p-6 flex-1">
                <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-lg font-bold ${isPast ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {session.title}
                    </h3>
                    <Badge variant={isPast ? 'secondary' : 'default'} className={!isPast ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 hover:bg-indigo-100' : ''}>
                        {new Date(session.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </Badge>
                </div>

                <div className="space-y-2 mt-4">
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-indigo-500" />
                        {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration_minutes} {t.mins}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-purple-500" />
                        {session.program?.title || t.customWorkout}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-500" />
                        {session.clients?.length || 0} / {session.max_participants} {t.enrolled}
                    </p>
                </div>
            </CardContent>
            <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                <Button asChild variant={isPast ? 'outline' : 'default'} className={!isPast ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}>
                    <Link href={`/coach/sessions/${session.id}`}>
                        {isPast ? t.viewLog : t.manageRoster}
                    </Link>
                </Button>
            </div>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={[{ title: t.dashboard, href: '/dashboard' }, { title: t.classPlanning, href: '/coach/sessions' }]}>
            <Head title={t.head} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            {t.title}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl h-11 px-6">
                                <CalendarPlus className="mr-2 h-4 w-4" /> {t.scheduleClass}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{t.scheduleNew}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateSession} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>{t.classTitle} <span className="text-red-500">*</span></Label>
                                    <Input value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Morning HIIT" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.assignProgram}</Label>
                                    <Select value={data.program_id} onValueChange={v => setData('program_id', v)}>
                                        <SelectTrigger><SelectValue placeholder={t.selectProgram} /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">{t.noneCustom}</SelectItem>
                                            {programs.map((p: any) => <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.dateTime} <span className="text-red-500">*</span></Label>
                                    <Input type="datetime-local" value={data.scheduled_at} onChange={e => setData('scheduled_at', e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>{t.duration}</Label>
                                        <Input type="number" value={data.duration_minutes} onChange={e => setData('duration_minutes', e.target.value)} min="15" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.maxCapacity}</Label>
                                        <Input type="number" value={data.max_participants} onChange={e => setData('max_participants', e.target.value)} min="1" required />
                                    </div>
                                </div>
                                <Button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4 h-11">
                                    {t.createSession}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-6">
                        <TabsTrigger value="upcoming"><Target className="h-4 w-4 mr-2"/> {t.upcoming} ({stats.total_upcoming})</TabsTrigger>
                        <TabsTrigger value="past"><History className="h-4 w-4 mr-2"/> {t.past} ({stats.total_completed})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingSessions.data.map((session: any) => <SessionCard key={session.id} session={session} isPast={false} />)}
                            {upcomingSessions.data.length === 0 && <div className="col-span-full py-12 text-center text-slate-500">{t.noUpcoming}</div>}
                        </div>
                        <InertiaPagination data={upcomingSessions} />
                    </TabsContent>

                    <TabsContent value="past" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastSessions.data.map((session: any) => <SessionCard key={session.id} session={session} isPast={true} />)}
                            {pastSessions.data.length === 0 && <div className="col-span-full py-12 text-center text-slate-500">{t.noPast}</div>}
                        </div>
                        <InertiaPagination data={pastSessions} />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
