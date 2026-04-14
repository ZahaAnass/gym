import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Calendar as CalendarIcon, Clock, Users, Dumbbell, BookOpen, Plus, Save
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

export default function ScheduleIndex({ events, stats, programs }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Coach Dashboard', href: '/dashboard' },
        { title: 'My Schedule', href: '/coach/schedule' },
    ];

    // State for Modals
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form for creating a new session
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        program_id: '',
        scheduled_at: '',
        duration_minutes: 60,
        max_participants: 10,
    });

    // 🚀 TRIGGER: Coach clicks an existing event to view details
    const handleEventClick = (clickInfo: any) => {
        setSelectedEvent({
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            start: clickInfo.event.start,
            end: clickInfo.event.end,
            ...clickInfo.event.extendedProps
        });
        setIsViewModalOpen(true);
    };

    // 🚀 TRIGGER: Coach clicks/drags an empty time slot to create a session
    const handleDateSelect = (selectInfo: any) => {
        // Calculate duration based on how far they dragged
        const diffMs = selectInfo.end.getTime() - selectInfo.start.getTime();
        const diffMins = Math.round(diffMs / 60000);

        // Format the clicked date for the datetime-local input
        const tzOffset = selectInfo.start.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = (new Date(selectInfo.start.getTime() - tzOffset)).toISOString().slice(0, 16);

        setData({
            ...data,
            scheduled_at: localISOTime,
            duration_minutes: diffMins > 0 ? diffMins : 60,
        });

        setIsCreateModalOpen(true);
        selectInfo.view.calendar.unselect(); // clear visual selection
    };

    const submitCreateSession = (e: React.FormEvent) => {
        e.preventDefault();
        // Since you previously used SessionController for store:
        post('/coach/sessions', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
                toast.success('Session successfully scheduled!');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Calendar | Coach" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <CalendarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Class Schedule
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Click and drag on the calendar to create a new session.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="px-4 py-2 text-sm bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400">
                            <Clock className="h-4 w-4 mr-2" /> {stats.upcoming_this_week} Classes This Week
                        </Badge>
                        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-xl">
                            <Plus className="mr-2 h-4 w-4" /> Create Session
                        </Button>
                    </div>
                </div>

                {/* Calendar Card */}
                <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                    <CardContent className="p-6">
                        <div className="fc-theme-tailwind">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="timeGridWeek"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                events={events}
                                eventClick={handleEventClick}
                                selectable={true}           // 🔥 Enables clicking/dragging
                                selectMirror={true}         // 🔥 Shows a temporary visual box while dragging
                                select={handleDateSelect}   // 🔥 Triggers the modal on drop
                                height="750px"
                                allDaySlot={false}
                                slotMinTime="06:00:00"
                                slotMaxTime="22:00:00"
                                eventClassNames="cursor-pointer hover:opacity-90 transition-opacity rounded-md shadow-sm border-none px-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 1. INTERACTIVE VIEW MODAL */}
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl flex items-center gap-2">
                                {selectedEvent?.title}
                                {selectedEvent?.is_past && <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 ml-2">Completed</Badge>}
                            </DialogTitle>
                        </DialogHeader>

                        {selectedEvent && (
                            <div className="space-y-4 py-4">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                    <Clock className="h-6 w-6 text-indigo-500" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {selectedEvent.start.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selectedEvent.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({selectedEvent.duration} mins)
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Dumbbell className="h-3 w-3"/> Assigned Program</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{selectedEvent.program_title}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Users className="h-3 w-3"/> Capacity</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedEvent.max_participants} Participants Max</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="sm:justify-between items-center border-t border-slate-100 dark:border-zinc-800 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsViewModalOpen(false)} className="rounded-xl">
                                Close
                            </Button>
                            {selectedEvent?.id && (
                                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                                    <Link href={`/coach/sessions/${selectedEvent.id}`}>
                                        <BookOpen className="mr-2 h-4 w-4" /> Go to Session Attendance
                                    </Link>
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* 2. CREATE SESSION MODAL (Drag & Drop Triggered) */}
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent className="sm:max-w-md rounded-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-extrabold flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-indigo-500"/> Schedule Session
                            </DialogTitle>
                            <DialogDescription>Assign a program to a time slot.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitCreateSession} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label>Session Title</Label>
                                <Input required value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g., Morning HIIT, Leg Day" className="bg-slate-50 dark:bg-zinc-900 rounded-xl border-slate-200 dark:border-zinc-800" />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Assign Program (Optional)</Label>
                                <Select value={data.program_id} onValueChange={val => setData('program_id', val)}>
                                    <SelectTrigger className="bg-slate-50 dark:bg-zinc-900 rounded-xl border-slate-200 dark:border-zinc-800">
                                        <SelectValue placeholder="Select a program..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none" className="text-slate-400 italic">No Program (Custom Session)</SelectItem>
                                        {programs?.map((prog: any) => (
                                            <SelectItem key={prog.id} value={prog.id.toString()}>{prog.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date & Time</Label>
                                    <Input type="datetime-local" required value={data.scheduled_at} onChange={e => setData('scheduled_at', e.target.value)} className="bg-slate-50 dark:bg-zinc-900 rounded-xl border-slate-200 dark:border-zinc-800" />
                                    {errors.scheduled_at && <p className="text-red-500 text-xs">{errors.scheduled_at}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration (Minutes)</Label>
                                    <Input type="number" required min="15" max="240" value={data.duration_minutes} onChange={e => setData('duration_minutes', parseInt(e.target.value))} className="bg-slate-50 dark:bg-zinc-900 rounded-xl border-slate-200 dark:border-zinc-800" />
                                    {errors.duration_minutes && <p className="text-red-500 text-xs">{errors.duration_minutes}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Max Participants</Label>
                                <Input type="number" required min="1" max="50" value={data.max_participants} onChange={e => setData('max_participants', parseInt(e.target.value))} className="bg-slate-50 dark:bg-zinc-900 rounded-xl border-slate-200 dark:border-zinc-800" />
                                {errors.max_participants && <p className="text-red-500 text-xs">{errors.max_participants}</p>}
                            </div>

                            <DialogFooter className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20">
                                    <Save className="h-4 w-4 mr-2" /> Save Session
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .fc-theme-tailwind {
                    --fc-border-color: #e2e8f0;
                    --fc-page-bg-color: transparent;
                }
                .dark .fc-theme-tailwind {
                    --fc-border-color: #27272a;
                    --fc-page-bg-color: transparent;
                    --fc-neutral-bg-color: #18181b;
                    --fc-list-event-hover-bg-color: #27272a;
                    color: #f8fafc;
                }
                .dark .fc-col-header-cell-cushion, .dark .fc-timegrid-slot-label-cushion {
                    color: #94a3b8;
                }
            `}} />
        </AppLayout>
    );
}
