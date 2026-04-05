import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Calendar,
    Target,
    CreditCard,
    ArrowRight,
    Dumbbell,
    TrendingDown,
    Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function ClientDashboard({ latestAssessment, nextSession, activeGoalsCount }: any) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // Greeting logic based on time of day
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Dashboard" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">

                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-white shadow-lg">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {greeting}, {user.name.split(' ')[0]}!
                        </h2>
                        <p className="text-blue-100 mt-2 max-w-xl">
                            Welcome back to your AI Gym portal. Keep pushing towards your goals today.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <Sparkles className="h-5 w-5 text-blue-100" />
                        <span className="font-medium text-blue-50">AI-Powered Journey</span>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">

                    {/* Next Class Card */}
                    <Card className="shadow-sm border-blue-100 dark:border-blue-900/50 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-500" /> Up Next
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nextSession ? (
                                <div>
                                    <div className="text-xl font-bold text-foreground mt-1">{nextSession.title}</div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(nextSession.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">
                                            Coach {nextSession.coach?.name}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{nextSession.duration_minutes} mins</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-muted-foreground">No upcoming classes scheduled.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Active Goals Card */}
                    <Card className="shadow-sm border-emerald-100 dark:border-emerald-900/50 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Target className="h-4 w-4 text-emerald-500" /> Active Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground mt-1">{activeGoalsCount}</div>
                            <p className="text-sm text-muted-foreground mt-1">Goals currently in progress</p>
                            <Button variant="link" className="p-0 h-auto mt-3 text-emerald-600 dark:text-emerald-400" asChild>
                                <Link href="/client/goals" className="flex items-center">
                                    Update progress <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Latest AI Assessment Card */}
                    <Card className="shadow-sm border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <TrendingDown className="h-4 w-4 text-purple-500" /> Current Weight
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latestAssessment ? (
                                <div>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <div className="text-3xl font-bold text-foreground">{latestAssessment.weight}</div>
                                        <div className="text-sm text-muted-foreground font-medium">kg</div>
                                    </div>
                                    {latestAssessment.ideal_weight_ai && (
                                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium bg-purple-50 dark:bg-purple-900/20 py-1 px-2 rounded inline-block">
                                            AI Target: {latestAssessment.ideal_weight_ai} kg
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-muted-foreground">No assessment data yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Quick Actions Menu */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        <Link href="/client/progress" className="group block">
                            <Card className="bg-muted/10 hover:bg-muted/30 border-dashed transition-colors h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">View Full Progress</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Check AI reports & history</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/client/goals" className="group block">
                            <Card className="bg-muted/10 hover:bg-muted/30 border-dashed transition-colors h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">Manage Goals</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Set new targets</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/client/payments" className="group block">
                            <Card className="bg-muted/10 hover:bg-muted/30 border-dashed transition-colors h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">Payments</h4>
                                    <p className="text-xs text-muted-foreground mt-1">View bills & subscriptions</p>
                                </CardContent>
                            </Card>
                        </Link>

                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
