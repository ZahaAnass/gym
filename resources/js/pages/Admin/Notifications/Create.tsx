import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Send,
    Users,
    AlertTriangle,
    Info,
    CheckCircle2,
    Link as LinkIcon,
    Megaphone,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppLanguage } from '@/hooks/use-app-language';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/analytics' },
    { title: 'Broadcast Alerts', href: '/admin/notifications' },
];

export default function CreateBroadcast() {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: { head: 'Broadcast Center | Admin', title: 'Broadcast Center', subtitle: 'Send mass notifications and alerts directly to user inboxes.', compose: 'Compose Message', composeSub: 'This message will appear in the notification bell for the selected audience.', audience: 'Target Audience', titleField: 'Notification Title', type: 'Message Type', message: 'Full Message', url: 'Action URL (Optional)', buttonText: 'Button Text (Optional)', send: 'Send Broadcast', sending: 'Broadcasting...' },
        fr: { head: 'Centre de diffusion | Admin', title: 'Centre de diffusion', subtitle: 'Envoyez des notifications et alertes de masse directement aux boites de reception.', compose: 'Composer le message', composeSub: "Ce message apparaitra dans la cloche de notification pour l'audience choisie.", audience: 'Audience cible', titleField: 'Titre de notification', type: 'Type de message', message: 'Message complet', url: 'URL action (optionnel)', buttonText: 'Texte du bouton (optionnel)', send: 'Envoyer la diffusion', sending: 'Diffusion...' },
        ar: { head: 'مركز البث | الادمن', title: 'مركز البث', subtitle: 'ارسال تنبيهات واشعارات جماعية مباشرة الى صناديق المستخدمين.', compose: 'كتابة الرسالة', composeSub: 'ستظهر هذه الرسالة في جرس الاشعارات للفئة المحددة.', audience: 'الفئة المستهدفة', titleField: 'عنوان الاشعار', type: 'نوع الرسالة', message: 'نص الرسالة', url: 'رابط اجراء (اختياري)', buttonText: 'نص الزر (اختياري)', send: 'ارسال البث', sending: 'جاري الارسال...' },
    }[language];
    const { flash } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        message: '',
        type: 'info',
        target_audience: 'all',
        action_url: '',
        action_text: '',
    });

    useEffect(() => {
        if (flash?.success) {
toast.success(flash.success);
}

        if (flash?.error) {
toast.error(flash.error);
}
    }, [flash]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/notifications/broadcast', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="admin-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="admin-page-header">
                    <div>
                        <h2 className="admin-page-title">
                            <Send className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            {t.title}
                        </h2>
                        <p className="admin-page-subtitle">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-5">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Megaphone className="h-5 w-5 text-indigo-500" />
                                {t.compose}
                            </CardTitle>
                            <CardDescription>
                                {t.composeSub}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-8">

                            {/* Target Audience */}
                            <div className="space-y-2 p-5 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
                                <Label className="flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-300">
                                    <Users className="h-4 w-4" /> {t.audience} <span className="text-red-500">*</span>
                                </Label>
                                <Select value={data.target_audience} onValueChange={(val) => setData('target_audience', val)}>
                                    <SelectTrigger className="h-11 bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-500/30 rounded-xl mt-2">
                                        <SelectValue placeholder="Select who will receive this" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Everyone (All Users)</SelectItem>
                                        <SelectItem value="clients">All Active & Inactive Clients</SelectItem>
                                        <SelectItem value="coaches">All Coaches Only</SelectItem>
                                        <SelectItem value="unpaid_clients">Delinquent/Unpaid Clients Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {t.titleField} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Gym Holiday Closure"
                                        required
                                        className="h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-indigo-500"
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                {/* Type */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {t.type} <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                                        <SelectTrigger className="h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                                            <SelectValue placeholder="Select urgency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="info"><span className="flex items-center"><Info className="h-4 w-4 mr-2 text-blue-500"/> General Info</span></SelectItem>
                                            <SelectItem value="alert"><span className="flex items-center"><AlertTriangle className="h-4 w-4 mr-2 text-amber-500"/> Urgent Alert</span></SelectItem>
                                            <SelectItem value="success"><span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500"/> Success / Good News</span></SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t.message} <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Type the full announcement here..."
                                    rows={5}
                                    required
                                    className="bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-indigo-500 resize-none"
                                />
                                {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                            </div>

                            {/* Optional Call to Action */}
                            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <LinkIcon className="h-4 w-4 text-slate-400" /> {t.url}
                                    </Label>
                                    <Input
                                        type="url"
                                        value={data.action_url}
                                        onChange={(e) => setData('action_url', e.target.value)}
                                        placeholder="https://gym.com/payment"
                                        className="h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl"
                                    />
                                    {errors.action_url && <p className="text-sm text-red-500">{errors.action_url}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {t.buttonText}
                                    </Label>
                                    <Input
                                        type="text"
                                        value={data.action_text}
                                        onChange={(e) => setData('action_text', e.target.value)}
                                        placeholder="e.g. Pay Now"
                                        className="h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl"
                                    />
                                    {errors.action_text && <p className="text-sm text-red-500">{errors.action_text}</p>}
                                </div>
                            </div>

                        </CardContent>

                        <CardFooter className="bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 px-6 py-5 flex items-center justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-xl h-11 px-8 min-w-[160px]"
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t.sending}
                                    </span>
                                ) : (
                                    <span className="flex items-center font-bold">
                                        <Send className="mr-2 h-4 w-4" /> {t.send}
                                    </span>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
