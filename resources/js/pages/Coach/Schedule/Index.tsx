import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    Clock,
    Users,
    Dumbbell,
    BookOpen
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

// FullCalendar Imports

export default function ScheduleIndex({ events, stats }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Coach Dashboard', href: '/dashboard' },
        { title: 'My Schedule', href: '/coach/schedule' },
    ];

    // State for the interactive Event Details Modal
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Triggered when the Coach clicks an event on the calendar
    const handleEventClick = (clickInfo: any) => {
        setSelectedEvent({
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            start: clickInfo.event.start,
            end: clickInfo.event.end,
            ...clickInfo.event.extendedProps
        });
        setIsModalOpen(true);
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
                            Manage your upcoming training sessions and view past classes.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Badge variant="outline" className="px-4 py-2 text-sm bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400">
                            <Clock className="h-4 w-4 mr-2" /> {stats.upcoming_this_week} Classes This Week
                        </Badge>
                    </div>
                </div>

                {/* Calendar Card */}
                <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                    <CardContent className="p-6">
                        {/* Custom wrapper to ensure FullCalendar looks good in Tailwind */}
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
                                height="700px"
                                allDaySlot={false}
                                slotMinTime="06:00:00" // Gym opens at 6 AM
                                slotMaxTime="22:00:00" // Gym closes at 10 PM
                                eventClassNames="cursor-pointer hover:opacity-90 transition-opacity rounded-md shadow-sm border-none px-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Interactive Event Details Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl flex items-center gap-2">
                                {selectedEvent?.title}
                                {selectedEvent?.is_past && <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 ml-2">Completed</Badge>}
                            </DialogTitle>
                            <DialogDescription>
                                Session details and class information.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedEvent && (
                            <div className="space-y-4 py-4">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                    <Clock className="h-5 w-5 text-indigo-500" />
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
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedEvent.program_title}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Users className="h-3 w-3"/> Capacity</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedEvent.max_participants} Participants Max</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="sm:justify-between items-center border-t border-slate-100 dark:border-zinc-800 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Close
                            </Button>
                            {selectedEvent?.id && (
                                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Link href={`/coach/sessions/${selectedEvent.id}`}>
                                        <BookOpen className="mr-2 h-4 w-4" /> Go to Session Notes
                                    </Link>
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>

            {/* Quick inline CSS to ensure FullCalendar adopts dark mode nicely */}
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
