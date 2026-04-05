import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Class Planning', href: '/coach/sessions' },
];

export default function SessionsIndex({ sessions }: any) {
    const { flash } = usePage().props as any;

    // Track which session and client is currently being graded
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        client_id: '',
        is_attended: true,
        realizations: '',
        remarks: '',
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const openNotesForm = (sessionId: number, client: any) => {
        setSelectedSessionId(sessionId);
        setSelectedClientId(client.id);
        setData({
            client_id: client.id.toString(),
            is_attended: client.pivot.is_attended || true,
            realizations: client.pivot.client_realizations || '',
            remarks: client.pivot.coach_remarks || '',
        });
    };

    const submitNotes = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/coach/sessions/${selectedSessionId}/notes`, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedClientId(null);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Class Planning | Coach" />

            <div className="p-6 space-y-6 w-full max-w-5xl mx-auto">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        Session Planning & Notes
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">View your upcoming classes and record client performance.</p>
                </div>

                <div className="grid gap-6">
                    {sessions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">No sessions scheduled.</div>
                    ) : (
                        sessions.map((session: any) => (
                            <Card key={session.id} className="shadow-sm">
                                <CardHeader className="bg-muted/10 border-b border-border pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{session.title}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">Program: {session.program?.title}</p>
                                        </div>
                                        <div className="text-right text-sm">
                                            <div className="flex items-center justify-end gap-1 text-primary font-medium">
                                                <Calendar className="h-4 w-4" /> {new Date(session.scheduled_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center justify-end gap-1 text-muted-foreground mt-1">
                                                <Clock className="h-4 w-4" /> {session.duration_minutes} min
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-border">
                                        <div className="px-6 py-3 bg-muted/5 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                            <Users className="h-4 w-4" /> Enrolled Clients ({session.clients?.length || 0})
                                        </div>

                                        {session.clients?.map((client: any) => (
                                            <div key={client.id} className="px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="font-medium text-foreground">{client.name}</span>
                                                        {client.pivot.coach_remarks && (
                                                            <span className="ml-3 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Notes saved</span>
                                                        )}
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={() => openNotesForm(session.id, client)}>
                                                        {selectedClientId === client.id && selectedSessionId === session.id ? 'Close' : 'Take Notes'}
                                                    </Button>
                                                </div>

                                                {/* Hidden Notes Form - Expands when clicked */}
                                                {selectedClientId === client.id && selectedSessionId === session.id && (
                                                    <form onSubmit={submitNotes} className="mt-4 p-4 bg-muted/20 rounded-md border space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="font-semibold text-sm">Did the client attend?</Label>
                                                            <Switch
                                                                checked={data.is_attended}
                                                                onCheckedChange={(val) => setData('is_attended', val)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Client's Realizations (What they did)</Label>
                                                            <Textarea
                                                                value={data.realizations}
                                                                onChange={e => setData('realizations', e.target.value)}
                                                                placeholder="e.g. Completed 3 sets of squats at 80kg"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Coach's Remarks</Label>
                                                            <Textarea
                                                                value={data.remarks}
                                                                onChange={e => setData('remarks', e.target.value)}
                                                                placeholder="Needs to improve form on deadlifts..."
                                                            />
                                                        </div>
                                                        <Button type="submit" disabled={processing} className="w-full">
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Save Notes
                                                        </Button>
                                                    </form>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
