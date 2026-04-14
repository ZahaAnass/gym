import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Users, Search, Activity, Dumbbell, CalendarCheck, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import InertiaPagination from '@/components/inertia-pagination';

export default function ClientsIndex({ clients, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get('/coach/clients', { search }, { preserveState: true });
        }
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <AppLayout breadcrumbs={[{ title: 'Client Roster', href: '/coach/clients' }]}>
            <Head title="Clients | Coach" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                            <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Client Roster
                        </h2>
                        <p className="text-slate-500 mt-1">Manage your assigned athletes and track their progress.</p>
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
                                placeholder="Press Enter to search by name or email..."
                            />
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80 dark:bg-zinc-900/50 hover:bg-transparent border-b border-slate-100 dark:border-zinc-800">
                                        <TableHead className="pl-6 py-4 font-bold">Athlete Profile</TableHead>
                                        <TableHead className="font-bold">Latest Biometrics</TableHead>
                                        <TableHead className="font-bold">Active Programs</TableHead>
                                        <TableHead className="font-bold">Attendance Record</TableHead>
                                        <TableHead className="text-right pr-6 font-bold">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {clients.data.map((client: any) => {
                                        const latestAssessment = client.assessments?.[0];
                                        const attendedCount = client.attended_sessions?.filter((s:any) => s.pivot.attended).length || 0;

                                        return (
                                            <TableRow key={client.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
                                                            {getInitials(client.name)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-900 dark:text-white">{client.name}</span>
                                                            <span className="text-sm text-slate-500">{client.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {latestAssessment ? (
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                                                <Activity className="h-3 w-3 mr-1" /> {latestAssessment.weight} kg
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm italic text-slate-400">Needs Assessment</span>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {client.assigned_programs?.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {client.assigned_programs.map((prog: any) => (
                                                                <Badge key={prog.id} variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/50 dark:border-indigo-900 dark:text-indigo-400 dark:bg-indigo-900/20">
                                                                    <Dumbbell className="h-3 w-3 mr-1" /> {prog.title}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 border border-dashed border-slate-300 dark:border-zinc-700 rounded px-2 py-1">No Programs</span>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                        <CalendarCheck className="h-3 w-3 mr-1" /> {attendedCount} Sessions
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right pr-6">
                                                    <Link
                                                        href={`/coach/clients/${client.id}`}
                                                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40 transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2"/> 360° Profile
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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
