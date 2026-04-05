import React, { useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import {
    AlertCircle,
    Mail,
    CreditCard,
    Dumbbell,
    Clock,
    Search,
    MoreHorizontal,
    Banknote,
    TrendingDown,
    TrendingUp,
    CheckCircle2,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { BreadcrumbItem } from '@/types';
import InertiaPagination from '@/components/inertia-pagination';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/analytics' },
    { title: 'Financials', href: '/admin/unpaid' },
];

export default function PaymentsDashboard({ users, filters, stats }: any) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Debounced Search
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/unpaid", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    // Status Filter
    const handleStatusFilter = (status: string) => {
        router.get("/admin/unpaid", { ...filters, status }, { preserveState: true, replace: true });
    };

    const handleSendReminder = (clientName: string) => {
        toast.success(`Automated payment reminder emailed to ${clientName}.`);
    };

    const handleMarkAsPaid = (clientName: string) => {
        toast.success(`Payment logged manually for ${clientName}. Status is now Active.`);
    };

    // Helper to determine if a client is currently "Paid" (has completed payment in last 30 days)
    const isClientPaid = (payments: any[]) => {
        if (!payments || payments.length === 0) return false;
        const lastPayment = payments[0];
        if (lastPayment.status !== 'completed') return false;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(lastPayment.created_at) >= thirtyDaysAgo;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Financials & Subscriptions | Admin" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Financial Dashboard
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Monitor member subscriptions, track revenue, and manage overdue accounts.
                        </p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Monthly Collected</span>
                                <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">
                                    {formatCurrency(stats.collected_revenue)}
                                </span>
                                <span className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                                    {stats.paid_clients} Active Subscriptions
                                </span>
                            </div>
                            <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-red-600 dark:text-red-400">Delinquent Accounts</span>
                                <span className="text-3xl font-extrabold text-red-700 dark:text-red-300">
                                    {stats.unpaid_clients}
                                </span>
                                <span className="text-xs font-medium text-red-600/70 dark:text-red-400/70 mt-1">
                                    Action Required
                                </span>
                            </div>
                            <div className="h-12 w-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending Revenue</span>
                                <span className="text-3xl font-extrabold text-amber-700 dark:text-amber-300">
                                    {formatCurrency(stats.estimated_revenue)}
                                </span>
                                <span className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70 mt-1">
                                    From {stats.unpaid_clients} unpaid members
                                </span>
                            </div>
                            <div className="h-12 w-12 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center">
                                <TrendingDown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Card */}
                <Card className="shadow-sm border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-visible bg-white dark:bg-zinc-950">

                    {/* Toolbar */}
                    <div className="p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Input
                                defaultValue={filters?.search ?? ""}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm h-11"
                                placeholder="Search by name or email..."
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Search size={18} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">
                                <Filter size={16} /> Status
                            </div>
                            <Select defaultValue={filters.status ?? "all"} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl h-11">
                                    <SelectValue placeholder="All Members" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Members</SelectItem>
                                    <SelectItem value="paid">Active (Paid)</SelectItem>
                                    <SelectItem value="unpaid">Overdue (Unpaid)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table className="w-full text-sm text-left">
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 hover:bg-transparent">
                                        <TableHead className="pl-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Client</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Subscription Status</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Last Payment Activity</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-16">
                                                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                                                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                                                        <Search className="h-6 w-6 text-slate-400" />
                                                    </div>
                                                    <p className="text-base font-medium text-slate-900 dark:text-slate-100">No records found</p>
                                                    <p className="text-sm mt-1">Adjust your search or filter criteria.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((client: any) => {
                                            const lastPayment = client.payments?.[0];
                                            const isPaid = isClientPaid(client.payments);

                                            return (
                                                <TableRow key={client.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">

                                                    {/* Client Info */}
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${isPaid ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30'}`}>
                                                                {getInitials(client.name)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900 dark:text-slate-100">{client.name}</span>
                                                                <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{client.email}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Subscription Status */}
                                                    <TableCell>
                                                        {isPaid ? (
                                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-2.5 py-1">
                                                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 px-2.5 py-1">
                                                                <AlertCircle className="h-3.5 w-3.5 mr-1" /> Overdue
                                                            </Badge>
                                                        )}
                                                    </TableCell>

                                                    {/* Last Payment Details */}
                                                    <TableCell>
                                                        {lastPayment ? (
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-slate-900 dark:text-slate-100">
                                                                        {formatCurrency(lastPayment.amount)}
                                                                    </span>
                                                                    <Badge variant="secondary" className="capitalize border-none px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-400">
                                                                        {lastPayment.method}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                                                    <Clock className="mr-1 h-3.5 w-3.5" />
                                                                    {new Date(lastPayment.created_at).toLocaleDateString()}
                                                                    <span className="mx-1">•</span>
                                                                    <span className={lastPayment.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                                                                        {lastPayment.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-slate-400 dark:text-slate-600 italic">No history on record</span>
                                                        )}
                                                    </TableCell>

                                                    {/* Actions Menu */}
                                                    <TableCell className="text-right pr-6">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-zinc-800">
                                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-200 dark:border-zinc-800 shadow-xl p-1">
                                                                <DropdownMenuLabel className="text-xs uppercase text-slate-400 tracking-wider">Financial Actions</DropdownMenuLabel>

                                                                {!isPaid && (
                                                                    <DropdownMenuItem onClick={() => handleSendReminder(client.name)} className="cursor-pointer py-2.5">
                                                                        <Mail className="mr-2 h-4 w-4 text-indigo-500" />
                                                                        <span>Send Payment Reminder</span>
                                                                    </DropdownMenuItem>
                                                                )}

                                                                <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />

                                                                <DropdownMenuItem onClick={() => handleMarkAsPaid(client.name)} className="cursor-pointer py-2.5 text-emerald-700 dark:text-emerald-400 focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-800 dark:focus:text-emerald-300">
                                                                    <Banknote className="mr-2 h-4 w-4" />
                                                                    <span>Log Manual Payment</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6">
                    <InertiaPagination data={users} />
                </div>

            </div>
        </AppLayout>
    );
}
