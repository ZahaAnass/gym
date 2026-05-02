import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Users, Save, Calendar as CalendarIcon, Clock, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAppLanguage } from '@/hooks/use-app-language';
import { toast } from 'sonner';

export default function SessionShow({ session }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: { schedule: 'Schedule', back: 'Back to Calendar', customSession: 'Custom Session', clientRoster: 'Client Roster & Attendance', clientName: 'Client Name', present: 'Present?', notes: 'Coach Notes (Performance, Metrics)', noClients: 'No clients are currently assigned to this session.', yes: 'Yes', no: 'No', notePlaceholder: 'e.g. Struggled with squats today, adjust weight next time...', save: 'Save Attendance & Notes', saved: 'Attendance successfully saved!' },
        fr: { schedule: 'Planning', back: 'Retour au calendrier', customSession: 'Session personnalisee', clientRoster: 'Liste clients & presence', clientName: 'Nom du client', present: 'Present ?', notes: 'Notes coach (performance, metrics)', noClients: 'Aucun client assigne a cette session.', yes: 'Oui', no: 'Non', notePlaceholder: 'ex: Difficultes sur les squats, ajuster la charge...', save: 'Enregistrer presence & notes', saved: 'Presence enregistree avec succes !' },
        ar: { schedule: 'الجدول', back: 'العودة الى التقويم', customSession: 'جلسة مخصصة', clientRoster: 'قائمة العملاء والحضور', clientName: 'اسم العميل', present: 'حاضر؟', notes: 'ملاحظات المدرب (الاداء، القياسات)', noClients: 'لا يوجد عملاء معينون لهذه الجلسة حاليا.', yes: 'نعم', no: 'لا', notePlaceholder: 'مثال: واجه صعوبة في السكوات، تعديل الوزن المرة القادمة...', save: 'حفظ الحضور والملاحظات', saved: 'تم حفظ الحضور بنجاح!' },
    }[language];
    // Setup form with clients currently attached to this session
    const { data, setData, post, processing } = useForm({
        attendance: session.clients.map((client: any) => ({
            user_id: client.id,
            attended: client.pivot.attended === 1 || client.pivot.attended === true,
            notes: client.pivot.notes || ''
        }))
    });

    const handleToggle = (userId: number, checked: boolean) => {
        const newData = data.attendance.map((item: any) =>
            item.user_id === userId ? { ...item, attended: checked } : item
        );
        setData('attendance', newData);
    };

    const handleNoteChange = (userId: number, note: string) => {
        const newData = data.attendance.map((item: any) =>
            item.user_id === userId ? { ...item, notes: note } : item
        );
        setData('attendance', newData);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/coach/sessions/${session.id}/attendance`, {
            preserveScroll: true,
            onSuccess: () => toast.success(t.saved)
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: t.schedule, href: '/coach/schedule' }, { title: session.title, href: '#' }]}>
            <Head title={`Session: ${session.title}`} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                <Button variant="ghost" asChild className="mb-2 -ml-4 text-slate-500">
                    <Link href="/coach/schedule"><ChevronLeft className="h-4 w-4 mr-1" /> {t.back}</Link>
                </Button>

                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                            {session.title}
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">
                                {session.program ? session.program.title : t.customSession}
                            </Badge>
                        </h2>
                        <div className="flex gap-4 mt-3 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {new Date(session.scheduled_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {new Date(session.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({session.duration_minutes} min)</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card className="rounded-3xl shadow-sm border-slate-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
                        <CardHeader className="bg-slate-50/80 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-emerald-500" /> {t.clientRoster}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="pl-6 w-[250px]">{t.clientName}</TableHead>
                                        <TableHead className="w-[150px]">{t.present}</TableHead>
                                        <TableHead>{t.notes}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {session.clients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-12 text-slate-500 italic">
                                                {t.noClients}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        session.clients.map((client: any, index: number) => (
                                            <TableRow key={client.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <TableCell className="pl-6 font-bold text-slate-900 dark:text-white">
                                                    {client.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={data.attendance[index].attended}
                                                            onCheckedChange={(checked) => handleToggle(client.id, checked)}
                                                        />
                                                        <span className="text-xs text-slate-500 font-medium">
                                                            {data.attendance[index].attended ? t.yes : t.no}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="pr-6 py-3">
                                                    <Input
                                                        placeholder={t.notePlaceholder}
                                                        value={data.attendance[index].notes}
                                                        onChange={(e) => handleNoteChange(client.id, e.target.value)}
                                                        className="w-full bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {session.clients.length > 0 && (
                                <div className="p-5 border-t border-slate-100 dark:border-zinc-800 flex justify-end bg-slate-50/30 dark:bg-zinc-900/10">
                                    <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-8 shadow-md shadow-emerald-500/20">
                                        <Save className="h-4 w-4 mr-2" /> {t.save}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
