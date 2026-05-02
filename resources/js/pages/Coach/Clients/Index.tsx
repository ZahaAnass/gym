import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Users, Search, Activity, Dumbbell, CalendarCheck, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import InertiaPagination from '@/components/inertia-pagination';
import { useAppLanguage } from '@/hooks/use-app-language';

export default function ClientsIndex({ clients, filters }: any) {
    const { language, isRTL } = useAppLanguage();
    const [search, setSearch] = useState(filters?.search || '');
    const t = {
        en: { roster: 'Client Roster', head: 'Clients | Coach', subtitle: 'Manage your assigned athletes and track their progress.', search: 'Press Enter to search by name or email...', athleteProfile: 'Athlete Profile', biometrics: 'Latest Biometrics', activePrograms: 'Active Programs', attendance: 'Attendance Record', action: 'Action', empty: 'No clients assigned to your roster yet.', needsAssessment: 'Needs Assessment', noPrograms: 'No Programs', sessions: 'Sessions', profile360: '360° Profile' },
        fr: { roster: 'Liste clients', head: 'Clients | Coach', subtitle: 'Gerez vos athletes assignes et suivez leur progression.', search: 'Appuyez sur Entree pour rechercher par nom ou email...', athleteProfile: 'Profil athlete', biometrics: 'Dernieres biometries', activePrograms: 'Programmes actifs', attendance: 'Presence', action: 'Action', empty: 'Aucun client assigne pour le moment.', needsAssessment: 'Evaluation requise', noPrograms: 'Aucun programme', sessions: 'Sessions', profile360: 'Profil 360°' },
        ar: { roster: 'قائمة العملاء', head: 'العملاء | المدرب', subtitle: 'ادارة العملاء المعينين لك وتتبع تقدمهم.', search: 'اضغط Enter للبحث بالاسم او البريد...', athleteProfile: 'ملف العميل', biometrics: 'اخر القياسات', activePrograms: 'البرامج النشطة', attendance: 'سجل الحضور', action: 'الاجراء', empty: 'لا يوجد عملاء معينون لك حاليا.', needsAssessment: 'بحاجة لتقييم', noPrograms: 'لا توجد برامج', sessions: 'جلسات', profile360: 'ملف 360°' },
    }[language];

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get('/coach/clients', { search }, { preserveState: true });
        }
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <AppLayout breadcrumbs={[{ title: t.roster, href: '/coach/clients' }]}>
            <Head title={t.head} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                            <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            {t.roster}
                        </h2>
                        <p className="text-slate-500 mt-1">{t.subtitle}</p>
                    </div>
                </div>

                <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
                    <div className="p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
                        <div className="relative w-full max-w-md">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                className="pl-10 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl h-11"
                                placeholder={t.search}
                            />
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80 dark:bg-zinc-900/50 hover:bg-transparent border-b border-slate-100 dark:border-zinc-800">
                                        <TableHead className="pl-6 py-4 font-bold">{t.athleteProfile}</TableHead>
                                        <TableHead className="font-bold">{t.biometrics}</TableHead>
                                        <TableHead className="font-bold">{t.activePrograms}</TableHead>
                                        <TableHead className="font-bold">{t.attendance}</TableHead>
                                        <TableHead className="text-right pr-6 font-bold">{t.action}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {clients.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                                {t.empty}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        clients.data.map((client: any) => {
                                            // The Laravel eager-load structure we set up in Step 1
                                            const latestAssessment = client.assessments?.[0];
                                            const attendedCount = client.sessions_as_client?.length || 0;
                                            const activePrograms = client.assigned_programs || [];

                                            return (
                                                <TableRow key={client.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">

                                                    {/* Col 1: Combined Initials + Name + Email */}
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200 shrink-0">
                                                                {getInitials(client.name)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900 dark:text-white">{client.name}</span>
                                                                <span className="text-sm text-slate-500">{client.email}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Col 2: Biometrics */}
                                                    <TableCell>
                                                        {latestAssessment ? (
                                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                                                <Activity className="h-3 w-3 mr-1" /> {latestAssessment.weight} kg
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-sm italic text-slate-400">{t.needsAssessment}</span>
                                                        )}
                                                    </TableCell>

                                                    {/* Col 3: Programs */}
                                                    <TableCell>
                                                        {activePrograms.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {activePrograms.map((prog: any) => (
                                                                    <Badge key={prog.id} variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/50 dark:border-indigo-900 dark:text-indigo-400 dark:bg-indigo-900/20 truncate max-w-[150px]">
                                                                        <Dumbbell className="h-3 w-3 mr-1 shrink-0" /> {prog.title}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 border border-dashed border-slate-300 dark:border-zinc-700 rounded px-2 py-1">{t.noPrograms}</span>
                                                        )}
                                                    </TableCell>

                                                    {/* Col 4: Attendance */}
                                                    <TableCell>
                                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                            <CalendarCheck className="h-3 w-3 mr-1" /> {attendedCount} {t.sessions}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Col 5: Action Button */}
                                                    <TableCell className="text-right pr-6">
                                                        <Link
                                                            href={`/coach/clients/${client.id}`}
                                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40 transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2"/> {t.profile360}
                                                        </Link>
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6">
                    <InertiaPagination data={clients} />
                </div>
            </div>
        </AppLayout>
    );
}
