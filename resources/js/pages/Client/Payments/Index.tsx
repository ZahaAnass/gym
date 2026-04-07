import { Head, router, usePage } from '@inertiajs/react';
import { CreditCard, CheckCircle2, AlertCircle, ShieldCheck, Banknote, Calendar, Download } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function PaymentsIndex({ payments, subscription }: any) {
    const { flash } = usePage().props as any;
    const [isSimulatingStripe, setIsSimulatingStripe] = useState(false);


    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleStripePayment = (amount: number, installment: number) => {
        setIsSimulatingStripe(true);

        router.post('/client/payments/checkout',
            {
                amount: amount,
                installment_number: installment
            },
            {
                onError: () => setIsSimulatingStripe(false)
            }
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Billing & Subscriptions', href: '/client/payments' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing | Client" />

            <div className="p-6 space-y-8 w-full max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Billing & Subscriptions
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your gym membership and payment history.</p>
                    </div>

                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-sm ${subscription.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400'}`}>
                        {subscription.status === 'Active' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <span className="font-bold tracking-wide uppercase text-sm">Status: {subscription.status}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Card */}
                    <Card className="lg:col-span-1 shadow-lg shadow-indigo-500/5 border-indigo-100 dark:border-zinc-800 rounded-3xl h-fit overflow-hidden">
                        <div className="h-2 w-full bg-[#635BFF]" />
                        <CardHeader className="bg-white dark:bg-zinc-950 pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <ShieldCheck className="h-6 w-6 text-[#635BFF]" /> Secure Checkout
                            </CardTitle>
                            <CardDescription>Powered by Stripe Integration</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 bg-slate-50/50 dark:bg-zinc-900/30">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Next Billing Date</p>
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                                    <Calendar className="h-5 w-5 text-indigo-500" /> {subscription.next_billing_date}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
                                <div className="p-5 rounded-2xl border-2 border-[#635BFF] bg-indigo-50/50 dark:bg-indigo-500/5 transition-all shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white">Pay Full Term</h4>
                                        <Badge className="bg-[#635BFF] hover:bg-[#635BFF] text-white">10% Off</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Pay 3 months upfront.</p>
                                    <Button
                                        onClick={() => handleStripePayment(810, 1)}
                                        disabled={isSimulatingStripe || subscription.status === 'Active'}
                                        className="w-full bg-[#635BFF] hover:bg-[#4b45cf] text-white font-bold h-12 rounded-xl shadow-md shadow-[#635BFF]/20"
                                    >
                                        {isSimulatingStripe ? 'Processing Securely...' : 'Pay 810.00 MAD'}
                                    </Button>
                                </div>

                                <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all hover:border-slate-300">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Pay Monthly</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Standard 30-day renewal.</p>
                                    <Button
                                        onClick={() => handleStripePayment(300, 1)}
                                        disabled={isSimulatingStripe || subscription.status === 'Active'}
                                        variant="outline"
                                        className="w-full border-slate-300 text-slate-700 dark:text-slate-300 hover:bg-slate-50 h-12 rounded-xl"
                                    >
                                        {isSimulatingStripe ? 'Processing...' : 'Pay 300.00 MAD'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* History Table */}
                    <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 py-5">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-emerald-500" /> Payment History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80 dark:bg-zinc-900/50 hover:bg-transparent">
                                        <TableHead className="pl-6 font-semibold">Date</TableHead>
                                        <TableHead className="font-semibold">Amount</TableHead>
                                        <TableHead className="font-semibold">Method</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold">Invoice</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="text-center py-16 text-slate-500">No payment history found.</TableCell></TableRow>
                                    ) : (
                                        payments.map((payment: any) => (
                                            <TableRow key={payment.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <TableCell className="pl-6 font-medium text-sm text-slate-700 dark:text-slate-300">
                                                    {new Date(payment.created_at).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-900 dark:text-white">
                                                    {payment.amount} MAD
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`border-none capitalize ${payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                                                        <CreditCard className="h-3 w-3 mr-1" /> {payment.method}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    {payment.status === 'completed' && (
                                                        <a
                                                            href={`/client/payments/${payment.id}/invoice`}
                                                            target="_blank"
                                                            className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-bold bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                                        >
                                                            <Download className="h-4 w-4" /> PDF
                                                        </a>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
