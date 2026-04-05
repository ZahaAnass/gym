import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Users,
    Activity,
    Target,
    Dumbbell,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Clients', href: '/coach/clients' },
];

export default function CoachClientsIndex({ clients }: any) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Clients | Coach" />

            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="h-8 w-8 text-purple-600 dark:text-purple-500" />
                            My Assigned Clients
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your roster, view progress, and run AI health assessments.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 font-medium">
                        Total Roster: {clients?.length || 0} Clients
                    </div>
                </div>

                {/* Clients Table Card */}
                <Card className="shadow-sm border-gray-200 dark:border-gray-800 w-full overflow-hidden">
                    <CardHeader className="bg-muted/10 border-b border-border p-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <Dumbbell className="mr-2 h-4 w-4" />
                            Active Roster
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table className="w-full text-sm text-left">
                                <TableHeader>
                                    <TableRow className="bg-muted/5 hover:bg-muted/5 border-b border-border">
                                        <TableHead className="pl-6 py-4 font-semibold">Client Name</TableHead>
                                        <TableHead className="font-semibold">Email Contact</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-border bg-white dark:bg-gray-900/20">
                                    {!clients || clients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                                You have no clients assigned to you yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        clients.map((client: any) => (
                                            <TableRow key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

                                                <TableCell className="font-medium pl-6 py-4 text-foreground">
                                                    {client.name}
                                                </TableCell>

                                                <TableCell className="text-muted-foreground">
                                                    {client.email}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                                                        Active
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Link to trigger the AI Assessment creation form */}
                                                        <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                                                            <Link href={`/coach/assessments/create/${client.id}`}>
                                                                <Activity className="mr-2 h-4 w-4" />
                                                                AI Assessment
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>

                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
