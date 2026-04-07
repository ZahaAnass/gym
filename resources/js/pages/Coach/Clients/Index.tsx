import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Users, Search, Activity, Target, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';
import InertiaPagination from '@/components/inertia-pagination';
import { debounce } from 'lodash';

export default function RosterIndex({ clients, filters, stats }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Coach Dashboard', href: '/dashboard' },
        { title: 'My Roster', href: '/coach/clients' },
    ];

    const handleSearch = React.useRef(debounce((q: string) => {
        router.get("/coach/clients", { search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Clients | Coach" />

            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            My Client Roster
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            You are currently training {stats.total_clients} athletes.
                        </p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Input
                            defaultValue={filters?.search ?? ""}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl"
                            placeholder="Search your clients..."
                        />
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.data.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            No clients found.
                        </div>
                    ) : (
                        clients.data.map((client: any) => {
                            const latestAssessment = client.assessments?.[0];
                            const activeGoals = client.goals?.length || 0;

                            return (
                                <Card key={client.id} className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl hover:shadow-md transition-shadow bg-white dark:bg-zinc-950 flex flex-col h-full">
                                    <CardContent className="p-6 flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-200 dark:border-indigo-500/30">
                                                    {getInitials(client.name)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{client.name}</h3>
                                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{client.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100 dark:border-zinc-800">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Activity className="h-3 w-3"/> Current Weight</p>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {latestAssessment ? `${latestAssessment.weight} kg` : '--'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Target className="h-3 w-3"/> Active Goals</p>
                                                <p className="font-semibold text-slate-900 dark:text-white">{activeGoals}</p>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 rounded-b-2xl">
                                        <Button asChild className="w-full bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-sm">
                                            <Link href={`/coach/clients/${client.id}`}>
                                                Open 360° Profile <ChevronRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>

                <div className="mt-6">
                    <InertiaPagination data={clients} />
                </div>
            </div>
        </AppLayout>
    );
}
