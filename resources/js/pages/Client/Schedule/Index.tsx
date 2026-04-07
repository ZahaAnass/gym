import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Calendar as CalendarIcon, Clock, User as UserIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function ClientSchedule({ events }: any) {
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEventClick = (clickInfo: any) => {
        setSelectedEvent({
            title: clickInfo.event.title,
            start: clickInfo.event.start,
            end: clickInfo.event.end,
            ...clickInfo.event.extendedProps
        });
        setIsModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'My Schedule', href: '/client/schedule' }]}>
            <Head title="My Schedule | Client" />

            <div className="p-6 space-y-6 w-full max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <CalendarIcon className="h-8 w-8 text-emerald-500" />
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Class Schedule</h2>
                        <p className="text-sm text-slate-500">View your upcoming enrolled sessions.</p>
                    </div>
                </div>

                <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                    <CardContent className="p-6 fc-theme-tailwind">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
                            events={events}
                            eventClick={handleEventClick}
                            height="650px"
                            allDaySlot={false}
                            slotMinTime="06:00:00"
                            slotMaxTime="22:00:00"
                        />
                    </CardContent>
                </Card>

                {/* Event Details Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-xl flex items-center gap-2">
                                {selectedEvent?.title}
                                {selectedEvent?.is_past && <Badge variant="secondary">Completed</Badge>}
                            </DialogTitle>
                            <DialogDescription>Class Details</DialogDescription>
                        </DialogHeader>
                        {selectedEvent && (
                            <div className="space-y-4 py-4">
                                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-emerald-500" />
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{selectedEvent.start.toLocaleDateString()}</p>
                                        <p className="text-sm text-slate-500">{selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({selectedEvent.duration} mins)</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl flex items-center gap-3">
                                    <UserIcon className="h-5 w-5 text-indigo-500" />
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">Coach {selectedEvent.coach_name}</p>
                                        <p className="text-sm text-slate-500">Instructor</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <style dangerouslySetInnerHTML={{__html: ` .fc-theme-tailwind { --fc-border-color: #e2e8f0; } .dark .fc-theme-tailwind { --fc-border-color: #27272a; --fc-neutral-bg-color: #18181b; color: #f8fafc; } `}} />
        </AppLayout>
    );
}
