import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { CreditCard, CheckCircle2, AlertCircle, ShieldCheck, Banknote, Calendar, Download, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { useAppLanguage } from '@/hooks/use-app-language';

export default function PaymentsIndex({ payments, subscription }: any) {
    const { language, isRTL } = useAppLanguage();
    const { flash } = usePage().props as any;
    const [isSimulatingStripe, setIsSimulatingStripe] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleStripePayment = (amount: number, months: number) => {
        setIsSimulatingStripe(true);
        router.post('/client/payments/checkout',
            { amount, months },
            { onError: () => setIsSimulatingStripe(false) }
        );
    };

    const t = {
        en: { dashboard: 'Dashboard', billing: 'Billing & Subscriptions', head: 'Billing | Client', lockedTitle: 'Dashboard Locked', lockedMsg: 'Your subscription is expired. You must choose a plan below to regain access to your AI programs.', graceTitle: 'Grace Period Active', graceMsg: 'Your subscription expired, but you have', graceTail: 'days left in your grace period before your account is locked.', status: 'Status', selectPlan: 'Select a Plan', nextBilling: 'Next Billing', monthly: 'Monthly Plan', monthlyDesc: 'Standard 30-day access.', quarterly: 'Quarterly Plan', quarterlyDesc: '3 months of access.', annual: 'Annual Plan', annualDesc: '12 months of access.', save100: 'Save 100 MAD', save600: 'Save 600 MAD', payHistory: 'Payment History', date: 'Date', amount: 'Amount', planDuration: 'Plan Duration', invoice: 'Invoice', noHistory: 'No payment history found.' },
        fr: { dashboard: 'Tableau', billing: 'Facturation & abonnements', head: 'Facturation | Client', lockedTitle: 'Tableau verrouille', lockedMsg: "Votre abonnement a expire. Choisissez un plan pour recuperer l'acces.", graceTitle: 'Periode de grace active', graceMsg: 'Votre abonnement a expire, il vous reste', graceTail: 'jours avant verrouillage du compte.', status: 'Statut', selectPlan: 'Choisir un plan', nextBilling: 'Prochaine facturation', monthly: 'Plan mensuel', monthlyDesc: 'Acces standard 30 jours.', quarterly: 'Plan trimestriel', quarterlyDesc: '3 mois d acces.', annual: 'Plan annuel', annualDesc: '12 mois d acces.', save100: 'Economisez 100 MAD', save600: 'Economisez 600 MAD', payHistory: 'Historique des paiements', date: 'Date', amount: 'Montant', planDuration: 'Duree du plan', invoice: 'Facture', noHistory: 'Aucun paiement trouve.' },
        ar: { dashboard: 'لوحة التحكم', billing: 'الفوترة والاشتراكات', head: 'الفوترة | عميل', lockedTitle: 'تم قفل اللوحة', lockedMsg: 'اشتراكك منتهي. اختر خطة لاستعادة الوصول الى برامج الذكاء الاصطناعي.', graceTitle: 'فترة السماح مفعلة', graceMsg: 'انتهى اشتراكك ولكن لديك', graceTail: 'يوما متبقية قبل قفل الحساب.', status: 'الحالة', selectPlan: 'اختر خطة', nextBilling: 'الفوترة القادمة', monthly: 'خطة شهرية', monthlyDesc: 'وصول قياسي لمدة 30 يوما.', quarterly: 'خطة ربع سنوية', quarterlyDesc: 'وصول لمدة 3 اشهر.', annual: 'خطة سنوية', annualDesc: 'وصول لمدة 12 شهرا.', save100: 'وفر 100 درهم', save600: 'وفر 600 درهم', payHistory: 'سجل المدفوعات', date: 'التاريخ', amount: 'المبلغ', planDuration: 'مدة الخطة', invoice: 'الفاتورة', noHistory: 'لا يوجد سجل مدفوعات.' },
    }[language];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.dashboard, href: '/dashboard' },
        { title: t.billing, href: '/client/payments' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* WARNING BANNERS */}
                {subscription.status === 'Locked' && (
                    <div className="bg-red-500 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-red-500/20 animate-pulse">
                        <Lock className="h-8 w-8 shrink-0" />
                        <div>
                            <h3 className="font-extrabold text-lg">{t.lockedTitle}</h3>
                            <p className="text-sm text-red-100">{t.lockedMsg}</p>
                        </div>
                    </div>
                )}

                {subscription.status === 'Grace Period' && (
                    <div className="bg-amber-500 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-amber-500/20">
                        <AlertCircle className="h-8 w-8 shrink-0" />
                        <div>
                            <h3 className="font-extrabold text-lg">{t.graceTitle}</h3>
                            <p className="text-sm text-amber-100">{t.graceMsg} {subscription.days_left_in_grace} {t.graceTail}</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            {t.billing}
                        </h2>
                    </div>

                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-sm ${
                        subscription.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            subscription.status === 'Grace Period' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                'bg-red-50 border-red-200 text-red-700'
                    }`}>
                        {subscription.status === 'Active' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <span className="font-bold tracking-wide uppercase text-sm">{t.status}: {subscription.status}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Card - The 3 Tiers */}
                    <Card className="lg:col-span-1 shadow-lg border-indigo-100 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
                        <div className="h-2 w-full bg-[#635BFF]" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <ShieldCheck className="h-6 w-6 text-[#635BFF]" /> {t.selectPlan}
                            </CardTitle>
                            <CardDescription>
                                {t.nextBilling}: <strong className="text-slate-900 dark:text-white">{subscription.expires_at}</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">

                            {/* Tier 1: Monthly */}
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 transition-all hover:border-[#635BFF]">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t.monthly}</h4>
                                <p className="text-sm text-slate-500 mb-3">{t.monthlyDesc}</p>
                                <Button onClick={() => handleStripePayment(300, 1)} disabled={isSimulatingStripe} variant="outline" className="w-full">
                                    Pay 300 MAD
                                </Button>
                            </div>

                            {/* Tier 2: Quarterly */}
                            <div className="p-4 rounded-xl border-2 border-[#635BFF] bg-indigo-50/30 dark:bg-indigo-500/5 relative">
                                <Badge className="absolute -top-3 right-4 bg-[#635BFF]">{t.save100}</Badge>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t.quarterly}</h4>
                                <p className="text-sm text-slate-500 mb-3">{t.quarterlyDesc}</p>
                                <Button onClick={() => handleStripePayment(800, 3)} disabled={isSimulatingStripe} className="w-full bg-[#635BFF] hover:bg-[#4b45cf] text-white font-bold">
                                    Pay 800 MAD
                                </Button>
                            </div>

                            {/* Tier 3: Annual */}
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 transition-all hover:border-[#635BFF] relative">
                                <Badge className="absolute -top-3 right-4 bg-emerald-500">{t.save600}</Badge>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t.annual}</h4>
                                <p className="text-sm text-slate-500 mb-3">{t.annualDesc}</p>
                                <Button onClick={() => handleStripePayment(3000, 12)} disabled={isSimulatingStripe} variant="outline" className="w-full">
                                    Pay 3,000 MAD
                                </Button>
                            </div>

                        </CardContent>
                    </Card>

                    {/* History Table */}
                    <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
                        <CardHeader className="border-b border-slate-100 dark:border-zinc-800 py-5">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-emerald-500" /> {t.payHistory}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="pl-6">{t.date}</TableHead>
                                        <TableHead>{t.amount}</TableHead>
                                        <TableHead>{t.planDuration}</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right pr-6">{t.invoice}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-16 text-slate-500">{t.noHistory}</TableCell></TableRow>
                                    ) : (
                                        payments.map((payment: any) => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="pl-6 font-medium text-sm">
                                                    {new Date(payment.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-900 dark:text-white">
                                                    {payment.amount} MAD
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {payment.installment_number} Month(s)
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`border-none capitalize ${payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {payment.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    {payment.status === 'completed' && (
                                                        <a href={`/client/payments/${payment.id}/invoice`} target="_blank" className="text-indigo-600 hover:text-indigo-800 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg">
                                                            <Download className="h-4 w-4 inline mr-1" /> PDF
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
