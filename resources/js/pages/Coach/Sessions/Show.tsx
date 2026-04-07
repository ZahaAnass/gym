import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import {
    BookOpen, Clock, Users, Dumbbell, ArrowLeft, Save, Trash2, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

export default function SessionShow({ session }: any) {
    const { flash } = usePage().props as any;
    const isPast = new Date(session.scheduled_at) < new Date();

    const { data, setData, post, processing, isDirty } = useForm({
        notes: session.notes || '',
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const handleSaveNotes = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/coach/sessions/${session.id}/notes`, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to cancel and delete this session?")) {
            router.delete(`/coach/sessions/${session.id}`);
        }
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <AppLayout breadcrumbs={[{ title: 'Class Planning', href: '/coach/sessions' }, { title: session.title, href: '#' }]}>
            <Head title={`${session.title} | Session Details`} />

            <div className="p-6 space-y-6 w-full max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild className="rounded-full">
                            <Link href="/coach/sessions"><ArrowLeft className="h-4 w-4"/></Link>
                        </Button>
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                                {session.title}
                                {isPast && <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">Completed</Badge>}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {new Date(session.scheduled_at).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })} at {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                    {!isPast && (
                        <Button variant="destructive" onClick={handleDelete} className="shadow-sm">
                            <Trash2 className="mr-2 h-4 w-4" /> Cancel Class
                        </Button>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column: Details & Roster */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl">
                            <CardContent className="p-5 space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Clock className="h-3 w-3"/> Duration</p>
                                    <p className="font-semibold">{session.duration_minutes} minutes</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Dumbbell className="h-3 w-3"/> Program</p>
                                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                                        {session.program?.title || 'Custom Coach Workout'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Users className="h-3 w-3"/> Capacity</p>
                                    <p className="font-semibold">{session.clients?.length || 0} / {session.max_participants} Spots Filled</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl">
                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800">
                                <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-indigo-500"/> Enrolled Roster</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-zinc-800">
                                {session.clients?.length === 0 ? (
                                    <p className="p-6 text-center text-sm text-slate-500">No clients have enrolled yet.</p>
                                ) : (
                                    session.clients.map((client: any) => (
                                        <div key={client.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                                {getInitials(client.name)}
                                            </div>
                                            <span className="font-medium text-sm text-slate-900 dark:text-white">{client.name}</span>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Coach Notes */}
                    <div className="md:col-span-2">
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl h-full bg-white dark:bg-zinc-950 flex flex-col">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-indigo-500" />
                                    Post-Session Evaluation
                                </CardTitle>
                                <CardDescription>
                                    Log private notes about client performance, injuries, or program adjustments needed.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 flex-1 flex flex-col">
                                {!isPast && !data.notes && (
                                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 rounded-lg text-sm flex items-start gap-2 border border-amber-200 dark:border-amber-500/20">
                                        <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                                        This class hasn't happened yet. You can pre-write instructions here or wait until the session is over to log performance notes.
                                    </div>
                                )}
                                <form id="notes-form" onSubmit={handleSaveNotes} className="flex-1 flex flex-col">
                                    <Textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        placeholder="e.g., Sarah struggled with the deadlift form. Need to lower her weight next week. Group energy was excellent."
                                        className="flex-1 min-h-[300px] resize-none bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl leading-relaxed"
                                    />
                                </form>
                            </CardContent>
                            <div className="p-5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-4 bg-slate-50/50 dark:bg-zinc-900/50 rounded-b-2xl">
                                {isDirty && <span className="text-sm text-amber-600 font-medium mr-auto">Unsaved changes...</span>}
                                <Button
                                    type="submit"
                                    form="notes-form"
                                    disabled={processing || !isDirty}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl h-11 px-8"
                                >
                                    <Save className="mr-2 h-4 w-4" /> Save Evaluation Notes
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
