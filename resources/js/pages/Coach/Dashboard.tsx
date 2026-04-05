import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Users,
    Calendar,
    Dumbbell,
    Activity,
    ArrowRight,
    Sparkles,
    BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function CoachDashboard({ activeClientsCount, upcomingSession, totalPrograms }: any) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // Greeting logic based on time of day
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Coach Dashboard" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">

                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl text-white shadow-lg">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {greeting}, Coach {user.name.split(' ')[0]}!
                        </h2>
                        <p className="text-purple-100 mt-2 max-w-xl">
                            Welcome to your coaching command center. Ready to inspire and lead your clients today?
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <Sparkles className="h-5 w-5 text-purple-100" />
                        <span className="font-medium text-purple-50">AI Assistant Online</span>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">

                    {/* Active Clients Card */}
                    <Card className="shadow-sm border-blue-100 dark:border-blue-900/50 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-500" /> Active Roster
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground mt-1">{activeClientsCount}</div>
                            <p className="text-sm text-muted-foreground mt-1">Clients assigned to you</p>
                            <Button variant="link" className="p-0 h-auto mt-3 text-blue-600 dark:text-blue-400" asChild>
                                <Link href="/coach/clients" className="flex items-center">
                                    Manage roster <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Next Class Card */}
                    <Card className="shadow-sm border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-purple-500" /> Teaching Next
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {upcomingSession ? (
                                <div>
                                    <div className="text-xl font-bold text-foreground mt-1">{upcomingSession.title}</div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(upcomingSession.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-none">
                                            {upcomingSession.program?.title || 'Custom Session'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{upcomingSession.duration_minutes} mins</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-muted-foreground">No upcoming classes scheduled.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Total Programs Card */}
                    <Card className="shadow-sm border-emerald-100 dark:border-emerald-900/50 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-emerald-500" /> Workout Programs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground mt-1">{totalPrograms}</div>
                            <p className="text-sm text-muted-foreground mt-1">Programs created in library</p>
                            <Button variant="link" className="p-0 h-auto mt-3 text-emerald-600 dark:text-emerald-400" asChild>
                                <Link href="/coach/programs" className="flex items-center">
                                    AI Program Builder <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                </div>

                {/* Quick Actions Menu */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-foreground mb-4">Coach Toolkit</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        <Link href="/coach/clients" className="group block">
                            <Card className="bg-muted/10 hover:bg-muted/30 border-dashed transition-colors h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">My Clients</h4>
                                    <p className="text-xs text-muted-foreground mt-1">View roster & run AI Health Assessments</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/coach/programs" className="group block">
                            <Card className="bg-muted/10 hover:bg-muted/30 border-dashed transition-colors h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">AI Generator</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Build programs with Gemini AI</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/coach/sessions" className="group block">
                            <Card className="bg-muted/10 hover:bg-muted/30 border-dashed transition-colors h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">Class Planning</h4>
                                    <p className="text-xs text-muted-foreground mt-1">View schedules & take session notes</p>
                                </CardContent>
                            </Card>
                        </Link>

                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
