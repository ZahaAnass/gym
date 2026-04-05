import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CreditCard, CheckCircle2, AlertCircle, ShieldCheck, Banknote, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Billing & Payments', href: '/client/payments' },
];

export default function PaymentsIndex({ payments, subscription }: any) {
    const { flash } = usePage().props as any;
    const [isSimulatingStripe, setIsSimulatingStripe] = useState(false);

    const { post } = useForm({});

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleStripePayment = (amount: number, installment: number) => {
        setIsSimulatingStripe(true);
        // Simulate Stripe processing delay for presentation effect
        setTimeout(() => {
            post('/client/payments/stripe', {
                data: { amount, installment_number: installment },
                preserveScroll: true,
                onFinish: () => setIsSimulatingStripe(false)
            });
        }, 1500);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing & Subscriptions" />

            <div className="p-6 space-y-8 w-full max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Billing & Subscriptions
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your payment methods and subscription status.</p>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${subscription.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'}`}>
                        {subscription.status === 'Active' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <span className="font-bold">Status: {subscription.status}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Checkout Card */}
                    <Card className="lg:col-span-1 shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl h-fit">
                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-indigo-500" /> Secure Checkout
                            </CardTitle>
                            <CardDescription>Powered by Stripe Integration</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Next Billing Date</p>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Calendar className="h-4 w-4" /> {subscription.next_billing_date}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5 transition-all hover:border-indigo-300">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white">Pay Full Term</h4>
                                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">10% Off</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Pay 3 months upfront.</p>
                                    <Button
                                        onClick={() => handleStripePayment(810, 1)}
                                        disabled={isSimulatingStripe}
                                        className="w-full bg-[#635BFF] hover:bg-[#4b45cf] text-white font-bold h-11 rounded-lg shadow-md shadow-[#635BFF]/20"
                                    >
                                        {isSimulatingStripe ? 'Processing...' : 'Pay 810.00 MAD'}
                                    </Button>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all hover:border-slate-300">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Pay Monthly Split</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Pay month 1 of 3.</p>
                                    <Button
                                        onClick={() => handleStripePayment(300, 1)}
                                        disabled={isSimulatingStripe}
                                        variant="outline"
                                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 h-11 rounded-lg"
                                    >
                                        {isSimulatingStripe ? 'Processing...' : 'Pay 300.00 MAD'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* History Table */}
                    <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-indigo-500" /> Payment History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80 dark:bg-zinc-900/50 hover:bg-transparent">
                                        <TableHead className="pl-6">Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead className="text-right pr-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="text-center py-12 text-slate-500">No payment history found.</TableCell></TableRow>
                                    ) : (
                                        payments.map((payment: any) => (
                                            <TableRow key={payment.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                                                <TableCell className="pl-6 font-medium text-sm text-slate-700 dark:text-slate-300">
                                                    {new Date(payment.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-900 dark:text-white">
                                                    {payment.amount} MAD
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 capitalize text-sm">
                                                        <CreditCard className="h-4 w-4" /> {payment.method}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Badge className={`border-none capitalize ${payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                                                        {payment.status}
                                                    </Badge>
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
