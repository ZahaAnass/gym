import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    User, ArrowLeft, Target, TrendingDown, Calendar, Activity, Clock, CheckCircle2, XCircle, Dumbbell, Trash2,
    History as HistoryIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BreadcrumbItem } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useAppLanguage } from '@/hooks/use-app-language';
import { toast } from 'sonner';

export default function ClientShow({ client, recentSessions, upcomingSessions, availablePrograms, stats, chartData }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: { dashboard: 'Dashboard', roster: 'My Roster', head: 'Client Profile', assigned: 'Program successfully assigned!', unassignConfirm: 'Are you sure you want to unassign this program from the client?', unassigned: 'Program removed from client.', suspended: 'Suspended', clientSince: 'Client Since', assignProgram: 'Assign Program', currentWeight: 'Current Weight', attendanceRate: 'Attendance Rate', assignedPrograms: 'Assigned Programs', assignedPlan: 'Assigned Plan', unassignTitle: 'Unassign Program', noPrograms: 'No programs assigned.', weightProgression: 'Weight Progression', noAssessment: 'No assessment data logged yet.', upcoming: 'Upcoming', noUpcoming: 'No upcoming sessions.', recentHistory: 'Recent History', noPast: 'No past sessions.', attended: 'Attended', missed: 'Missed', assignProgramDialog: 'Assign Program', assignProgramDesc: 'Select a workout program from your library to assign to', selectProgram: 'Select a program...', noNewPrograms: 'No new programs available to assign', cancel: 'Cancel', assigning: 'Assigning...', assign: 'Assign Program' },
        fr: { dashboard: 'Tableau', roster: 'Mes clients', head: 'Profil client', assigned: 'Programme assigne avec succes !', unassignConfirm: 'Confirmer le retrait de ce programme du client ?', unassigned: 'Programme retire du client.', suspended: 'Suspendu', clientSince: 'Client depuis', assignProgram: 'Assigner programme', currentWeight: 'Poids actuel', attendanceRate: 'Taux de presence', assignedPrograms: 'Programmes assignes', assignedPlan: 'Plan assigne', unassignTitle: 'Retirer programme', noPrograms: 'Aucun programme assigne.', weightProgression: 'Evolution du poids', noAssessment: 'Aucune donnee d evaluation.', upcoming: 'A venir', noUpcoming: 'Aucune session a venir.', recentHistory: 'Historique recent', noPast: 'Aucune session passee.', attended: 'Present', missed: 'Absent', assignProgramDialog: 'Assigner un programme', assignProgramDesc: 'Selectionnez un programme pour', selectProgram: 'Selectionner un programme...', noNewPrograms: 'Aucun nouveau programme a assigner', cancel: 'Annuler', assigning: 'Assignation...', assign: 'Assigner' },
        ar: { dashboard: 'لوحة التحكم', roster: 'عملائي', head: 'ملف العميل', assigned: 'تم تعيين البرنامج بنجاح!', unassignConfirm: 'هل تريد الغاء تعيين هذا البرنامج من العميل؟', unassigned: 'تم حذف البرنامج من العميل.', suspended: 'موقوف', clientSince: 'عميل منذ', assignProgram: 'تعيين برنامج', currentWeight: 'الوزن الحالي', attendanceRate: 'نسبة الحضور', assignedPrograms: 'البرامج المعينة', assignedPlan: 'خطة معينة', unassignTitle: 'الغاء التعيين', noPrograms: 'لا توجد برامج معينة.', weightProgression: 'تطور الوزن', noAssessment: 'لا توجد بيانات تقييم.', upcoming: 'القادمة', noUpcoming: 'لا توجد جلسات قادمة.', recentHistory: 'السجل الحديث', noPast: 'لا توجد جلسات سابقة.', attended: 'حضر', missed: 'غاب', assignProgramDialog: 'تعيين برنامج', assignProgramDesc: 'اختر برنامجا تدريبيا لتعيينه الى', selectProgram: 'اختر برنامجا...', noNewPrograms: 'لا توجد برامج جديدة للتعيين', cancel: 'الغاء', assigning: 'جاري التعيين...', assign: 'تعيين برنامج' },
    }[language];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.dashboard, href: '/coach/dashboard' },
        { title: t.roster, href: '/coach/clients' },
        { title: client.name, href: `/coach/clients/${client.id}` },
    ];

    const latestAssessment = client.assessments?.length > 0 ? client.assessments[client.assessments.length - 1] : null;
    const attendanceRate = stats.total_sessions > 0 ? Math.round((stats.attended / stats.total_sessions) * 100) : 0;

    // 🔥 Filter out programs that are ALREADY assigned to the client
    const assignedProgramIds = client.assigned_programs?.map((p: any) => p.id) || [];
    const unassignedPrograms = availablePrograms?.filter((p: any) => !assignedProgramIds.includes(p.id)) || [];

    // Modal & Form State for Assigning a Program
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        program_id: ''
    });

    const submitAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/coach/clients/${client.id}/programs`, {
            onSuccess: () => {
                setIsAssignModalOpen(false);
                reset();
                toast.success(t.assigned);
            }
        });
    };

    // Remove Program Logic
    const removeProgram = (programId: number) => {
        if (confirm(t.unassignConfirm)) {
            router.delete(`/coach/clients/${client.id}/programs/${programId}`, {
                preserveScroll: true,
                onSuccess: () => toast.success(t.unassigned)
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${client.name} | ${t.head}`} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild className="h-10 w-10 rounded-full border-slate-200 dark:border-zinc-800">
                            <Link href="/coach/clients"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                                {client.name}
                                {client.is_active === false && (
                                    <Badge variant="destructive" className="uppercase text-[10px]">{t.suspended}</Badge>
                                )}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                <User className="h-3.5 w-3.5" /> {t.clientSince} {new Date(client.created_at).getFullYear()}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={() => setIsAssignModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl">
                            <Dumbbell className="mr-2 h-4 w-4" /> {t.assignProgram}
                        </Button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl">
                        <CardContent className="p-6">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-indigo-500"/> {t.currentWeight}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900 dark:text-white">{latestAssessment?.weight || '--'}</span>
                                <span className="text-sm font-bold text-slate-500">kg</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl">
                        <CardContent className="p-6">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-emerald-500"/> {t.attendanceRate}</p>
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{attendanceRate}%</span>
                            <p className="text-xs text-slate-400 mt-1">{stats.attended} attended, {stats.missed} missed</p>
                        </CardContent>
                    </Card>

                    {/* 🔥 FIXED: Removed max-h-[160px] so the programs actually show up! */}
                    <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 flex flex-col">
                        <CardContent className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{t.assignedPrograms}</p>
                                <Badge className="bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-none">
                                    {client.assigned_programs?.length || 0}
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                {client.assigned_programs && client.assigned_programs.length > 0 ? (
                                    client.assigned_programs.map((program: any) => (
                                        <div key={program.id} className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{program.title}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{t.assignedPlan}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeProgram(program.id)}
                                                className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 shrink-0"
                                                title={t.unassignTitle}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-4 flex items-center justify-center">
                                        <p className="text-sm text-slate-500 italic">{t.noPrograms}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Biometrics Chart & History */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl">
                        <CardHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-indigo-500"/> {t.weightProgression}</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] p-6 pt-4">
                            {chartData.biometrics.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData.biometrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} />
                                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                                        <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#4f46e5" strokeWidth={4} fill="url(#colorWeight)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 italic font-medium">{t.noAssessment}</div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Upcoming Sessions */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/30 border-b border-slate-100 dark:border-zinc-800 pb-3">
                                <CardTitle className="text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4"/> {t.upcoming}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {upcomingSessions.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-slate-500 italic">{t.noUpcoming}</div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                        {upcomingSessions.map((session: any) => (
                                            <div key={session.id} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{session.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                                                    <Clock className="h-3 w-3 text-indigo-400" />
                                                    {new Date(session.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Sessions */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/30 border-b border-slate-100 dark:border-zinc-800 pb-3">
                                <CardTitle className="text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2"><HistoryIcon className="h-4 w-4"/> {t.recentHistory}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {recentSessions.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-slate-500 italic">{t.noPast}</div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                        {recentSessions.map((session: any) => (
                                            <div key={session.id} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-900/50 flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{session.title}</h4>
                                                    <p className="text-xs text-slate-500 mt-1">{new Date(session.scheduled_at).toLocaleDateString()}</p>
                                                </div>
                                                {session.pivot.attended ? (
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"><CheckCircle2 className="h-3 w-3 mr-1"/> {t.attended}</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800"><XCircle className="h-3 w-3 mr-1"/> {t.missed}</Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* 🔥 Modal updated to use unassignedPrograms */}
            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <form onSubmit={submitAssignment}>
                        <DialogHeader>
                            <DialogTitle>{t.assignProgramDialog}</DialogTitle>
                            <DialogDescription>
                                {t.assignProgramDesc} {client.name.split(' ')[0]}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 space-y-4">
                            <div className="space-y-2">
                                <Select value={data.program_id} onValueChange={(val) => setData('program_id', val)}>
                                    <SelectTrigger className="w-full bg-slate-50 dark:bg-zinc-900 rounded-xl">
                                        <SelectValue placeholder={t.selectProgram} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unassignedPrograms.length > 0 ? (
                                            unassignedPrograms.map((prog: any) => (
                                                <SelectItem key={prog.id} value={prog.id.toString()}>
                                                    {prog.title}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>{t.noNewPrograms}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsAssignModalOpen(false)}>{t.cancel}</Button>
                            <Button type="submit" disabled={processing || !data.program_id} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                                {processing ? t.assigning : t.assign}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
