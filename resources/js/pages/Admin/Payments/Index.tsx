import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import {
    Search, Download, DollarSign, CreditCard,
    Banknote, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import React, { useRef } from 'react';
import InertiaPagination from '@/components/inertia-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppLanguage } from '@/hooks/use-app-language';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function PaymentIndex({ payments, filters, stats }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: { head: 'Transaction History | Admin', title: 'Transaction History', subtitle: 'View all historical payments, filter by method, and export for accounting.', unpaid: 'View Unpaid Accounts', export: 'Export CSV', search: 'Search by client name or email...' },
        fr: { head: 'Historique des transactions | Admin', title: 'Historique des transactions', subtitle: 'Consultez tous les paiements, filtrez par methode et exportez pour la comptabilite.', unpaid: 'Voir comptes impayes', export: 'Exporter CSV', search: 'Rechercher par nom ou email client...' },
        ar: { head: 'سجل المعاملات | الادمن', title: 'سجل المعاملات', subtitle: 'عرض جميع المدفوعات السابقة مع التصفية والتصدير للمحاسبة.', unpaid: 'عرض الحسابات غير المدفوعة', export: 'تصدير CSV', search: 'ابحث باسم العميل او البريد...' },
    }[language];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/analytics' },
        { title: 'Financials', href: '/admin/unpaid' },
        { title: 'All Transactions', href: '/admin/payments' },
    ];

    // Filtering logic
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/payments", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const handleFilter = (key: string, value: string) => {
        router.get("/admin/payments", { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    // Export Logic
    const exportUrl = `/admin/payments/export?${new URLSearchParams(filters as any).toString()}`;

    // Helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none"><CheckCircle2 className="w-3 h-3 mr-1"/> Paid</Badge>;
            case 'pending': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
            case 'failed': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none"><XCircle className="w-3 h-3 mr-1"/> Failed</Badge>;
            default: return <Badge variant="outline" className="capitalize">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="admin-page-container" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            {t.title}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/admin/unpaid">{t.unpaid}</Link>
                        </Button>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md rounded-xl">
                            <a href={exportUrl} target="_blank" rel="noreferrer">
                                <Download className="mr-2 h-4 w-4" /> {t.export}
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Lifetime Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="shadow-sm rounded-2xl border-slate-200">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-slate-500">Gross Volume</span>
                                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.total_volume)}</p>
                                </div>
                                <div className="p-2 bg-emerald-50 rounded-lg"><DollarSign className="h-5 w-5 text-emerald-600"/></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm rounded-2xl border-slate-200">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-slate-500">Stripe Revenue</span>
                                    <p className="text-2xl font-bold text-indigo-700">{formatCurrency(stats.stripe_volume)}</p>
                                </div>
                                <div className="p-2 bg-indigo-50 rounded-lg"><CreditCard className="h-5 w-5 text-indigo-600"/></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm rounded-2xl border-slate-200">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-slate-500">Cash/Manual</span>
                                    <p className="text-2xl font-bold text-amber-700">{formatCurrency(stats.cash_volume)}</p>
                                </div>
                                <div className="p-2 bg-amber-50 rounded-lg"><Banknote className="h-5 w-5 text-amber-600"/></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm rounded-2xl border-slate-200">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-slate-500">Total Transactions</span>
                                    <p className="text-2xl font-bold text-slate-900">{stats.total_transactions}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card className="shadow-sm rounded-2xl border-slate-200 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-80">
                            <Input
                                defaultValue={filters?.search ?? ""}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 bg-white rounded-xl h-10"
                                placeholder={t.search}
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Select defaultValue={filters.status ?? "all"} onValueChange={(val) => handleFilter('status', val)}>
                                <SelectTrigger className="w-full md:w-[140px] bg-white rounded-xl h-10">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select defaultValue={filters.method ?? "all"} onValueChange={(val) => handleFilter('method', val)}>
                                <SelectTrigger className="w-full md:w-[140px] bg-white rounded-xl h-10">
                                    <SelectValue placeholder="Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Methods</SelectItem>
                                    <SelectItem value="stripe">Stripe</SelectItem>
                                    <SelectItem value="cash">Cash / Manual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80">
                                        <TableHead className="pl-6 py-4">Transaction ID</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Amount & Method</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right pr-6">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                                No transactions found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        payments.data.map((payment: any) => (
                                            <TableRow key={payment.id} className="hover:bg-slate-50">
                                                <TableCell className="pl-6 font-mono text-xs text-slate-500">
                                                    #{payment.id.toString().padStart(6, '0')}
                                                </TableCell>
                                                <TableCell>
                                                    {payment.user ? (
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-slate-900">{payment.user.name}</span>
                                                            <span className="text-xs text-slate-500">{payment.user.email}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic">Deleted User</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span className="font-bold text-slate-900">{formatCurrency(payment.amount)}</span>
                                                        <div className="flex items-center text-xs text-slate-500 capitalize">
                                                            {payment.method === 'stripe' ? <CreditCard className="w-3 h-3 mr-1 text-indigo-500"/> : <Banknote className="w-3 h-3 mr-1 text-amber-500"/>}
                                                            {payment.method}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(payment.status)}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {payment.paid_at ? new Date(payment.paid_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
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

                <div className="mt-4">
                    <InertiaPagination data={payments} />
                </div>
            </div>
        </AppLayout>
    );
}
