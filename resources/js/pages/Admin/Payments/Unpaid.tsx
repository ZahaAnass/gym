import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { debounce } from 'lodash';
import {
    Search,
    Filter,
    MoreHorizontal,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    BellRing,
    Banknote,
    Clock,
    UserCircle,
    Lock,
    History
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from '@/components/inertia-pagination';
import { toast } from 'sonner';

export default function PaymentsUnpaid({ users, filters, stats }: any) {
    const { flash } = usePage().props as any;

    // NEW: State to hold the user whose history modal is currently open
    const [historyUser, setHistoryUser] = useState<any>(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/unpaid", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const handleStatusFilter = (status: string) => {
        router.get("/admin/unpaid", { ...filters, status }, { preserveState: true, replace: true });
    };

    const handleSendReminder = (userId: number) => {
        router.post(`/admin/unpaid/notify/${userId}`, {}, { preserveScroll: true });
    };

    const handleMarkPaid = (userId: number, months: number) => {
        if (confirm(`Are you sure you want to log a ${months}-month cash payment for this client?`)) {
            router.post(`/admin/unpaid/mark-paid/${userId}`, { months }, { preserveScroll: true });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', minimumFractionDigits: 2 }).format(amount || 0);
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const getClientStatus = (client: any) => {
        if (!client.payments || client.payments.length === 0) return 'locked';

        const latestCompleted = client.payments.find((p: any) => p.status === 'completed');
        if (!latestCompleted) return 'locked';

        const paidDate = new Date(latestCompleted.paid_at);
        const months = latestCompleted.installment_number || 1;

        const expirationDate = new Date(paidDate);
        expirationDate.setMonth(expirationDate.getMonth() + months);

        const graceEndDate = new Date(expirationDate);
        graceEndDate.setDate(graceEndDate.getDate() + 10);

        const now = new Date();

        if (now <= expirationDate) return 'active';
        if (now <= graceEndDate) return 'grace';
        return 'locked';
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/analytics' },
        { title: 'Financials & Subscriptions', href: '/admin/unpaid' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Financials | Admin" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Banknote className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            Financials & Subscriptions
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Monitor member subscriptions, track revenue, and manage overdue accounts.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Monthly Revenue</span>
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(stats.collected_revenue)}</span>
                                <span className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">{stats.active_clients} Fully Active Members</span>
                            </div>
                            <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50/50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/20 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">At Risk (Grace Period)</span>
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.grace_clients}</span>
                                <span className="text-xs font-medium text-amber-600/80 dark:text-amber-400/80">Expires in &lt; 10 days</span>
                            </div>
                            <div className="h-12 w-12 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50/50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-red-600 dark:text-red-400">Locked Accounts</span>
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.locked_clients}</span>
                                <span className="text-xs font-medium text-red-600/80 dark:text-red-400/80">{formatCurrency(stats.estimated_revenue)} Lost Revenue</span>
                            </div>
                            <div className="h-12 w-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                                <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-sm border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                    <div className="p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Input
                                defaultValue={filters?.search ?? ""}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl h-11 shadow-sm"
                                placeholder="Search by client name or email..."
                            />
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-3">
                            <Filter className="h-4 w-4 text-slate-400 hidden md:block" />

                            {/* NEW: Filter dropdown with 'Paid This Month' */}
                            <Select defaultValue={filters.status ?? "all"} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-full md:w-[220px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl h-11 shadow-sm">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Clients</SelectItem>
                                    <SelectItem value="active">Active (Paid)</SelectItem>
                                    <SelectItem value="paid_this_month">Paid This Month</SelectItem>
                                    <SelectItem value="grace">Grace Period (At Risk)</SelectItem>
                                    <SelectItem value="locked">Locked (Overdue)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80 dark:bg-zinc-900/50 hover:bg-transparent border-b border-slate-100 dark:border-zinc-800">
                                        <TableHead className="pl-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Client</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Subscription Status</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Last Payment Activity</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-16 text-slate-500 dark:text-slate-400">
                                                <Banknote className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                                <p className="font-medium text-base">No clients match this filter.</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user: any) => {
                                            const status = getClientStatus(user);
                                            const latestPayment = user.payments?.find((p: any) => p.status === 'completed') || user.payments?.[0];

                                            return (
                                                <TableRow key={user.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-zinc-700">
                                                                {getInitials(user.name)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                                                                <span className="text-sm text-slate-500 dark:text-slate-400">{user.email}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        {status === 'active' && (
                                                            <Badge variant="outline" className="px-3 py-1 border bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                                                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Active
                                                            </Badge>
                                                        )}
                                                        {status === 'grace' && (
                                                            <Badge variant="outline" className="px-3 py-1 border bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
                                                                <AlertCircle className="h-3.5 w-3.5 mr-1.5" /> Grace Period
                                                            </Badge>
                                                        )}
                                                        {status === 'locked' && (
                                                            <Badge variant="outline" className="px-3 py-1 border bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                                                                <Lock className="h-3.5 w-3.5 mr-1.5" /> Locked
                                                            </Badge>
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {latestPayment ? (
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(latestPayment.amount)}
                                                                    </span>
                                                                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                                                                        {latestPayment.method}
                                                                    </Badge>
                                                                    {latestPayment.status === 'completed' && (
                                                                        <span className="text-[10px] font-bold text-indigo-500">
                                                                            ({latestPayment.installment_number} M)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(latestPayment.paid_at || latestPayment.created_at).toLocaleDateString()}
                                                                    <span className="mx-1">•</span>
                                                                    <span className={latestPayment.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                                                                        {latestPayment.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm italic text-slate-400">No payment history</span>
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="text-right pr-6">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
                                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-64 rounded-xl border-slate-200 dark:border-zinc-800 shadow-xl">
                                                                <DropdownMenuLabel className="text-xs uppercase text-slate-400 tracking-wider">Client Actions</DropdownMenuLabel>

                                                                <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                                                                    <Link href={`/admin/users/${user.id}/edit`} className="w-full flex items-center">
                                                                        <UserCircle className="mr-2 h-4 w-4 text-slate-500" /> View Profile
                                                                    </Link>
                                                                </DropdownMenuItem>

                                                                {/* NEW: Payment History Modal Trigger */}
                                                                <DropdownMenuItem onClick={() => setHistoryUser(user)} className="cursor-pointer py-2.5">
                                                                    <History className="mr-2 h-4 w-4 text-blue-500" /> View Payment History
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem onClick={() => handleSendReminder(user.id)} className="cursor-pointer py-2.5">
                                                                    <BellRing className="mr-2 h-4 w-4 text-amber-500" /> Send System Reminder
                                                                </DropdownMenuItem>

                                                                <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                                                <DropdownMenuLabel className="text-xs uppercase text-slate-400 tracking-wider pt-2">Manual Override</DropdownMenuLabel>

                                                                <DropdownMenuItem onClick={() => handleMarkPaid(user.id, 1)} className="cursor-pointer py-2.5 text-emerald-600 dark:text-emerald-400">
                                                                    <Banknote className="mr-2 h-4 w-4" /> Log 1-Month Cash (300 MAD)
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleMarkPaid(user.id, 3)} className="cursor-pointer py-2.5 text-indigo-600 dark:text-indigo-400">
                                                                    <Banknote className="mr-2 h-4 w-4" /> Log 3-Month Cash (800 MAD)
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleMarkPaid(user.id, 12)} className="cursor-pointer py-2.5 text-purple-600 dark:text-purple-400">
                                                                    <Banknote className="mr-2 h-4 w-4" /> Log 1-Year Cash (3000 MAD)
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

            {/* NEW: The Payment History Modal */}
            <Dialog open={!!historyUser} onOpenChange={(open) => !open && setHistoryUser(null)}>
                <DialogContent className="sm:max-w-[700px] bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Payment History
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            A complete log of all transactions for <span className="font-bold text-slate-700 dark:text-slate-300">{historyUser?.name}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[400px] overflow-y-auto mt-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-zinc-900 sticky top-0 z-10">
                                <TableRow>
                                    <TableHead className="font-bold">Payment Date</TableHead>
                                    <TableHead className="font-bold">Amount</TableHead>
                                    <TableHead className="font-bold">Duration</TableHead>
                                    <TableHead className="font-bold">Method</TableHead>
                                    <TableHead className="font-bold text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {historyUser?.payments?.length > 0 ? (
                                    historyUser.payments.map((p: any) => (
                                        <TableRow key={p.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                                            <TableCell className="text-slate-600 dark:text-slate-300">
                                                {new Date(p.paid_at || p.created_at).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="font-extrabold text-slate-900 dark:text-white">
                                                {formatCurrency(p.amount)}
                                            </TableCell>
                                            <TableCell className="text-slate-500">
                                                {p.installment_number} Month(s)
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-400">
                                                    {p.method}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className={`border-none ${p.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                                                    {p.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-slate-500 py-10 italic">
                                            No payment history found for this client.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
