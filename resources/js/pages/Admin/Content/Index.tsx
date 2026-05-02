import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Megaphone,
    Save,
    LayoutTemplate,
    Mail,
    BellRing,
    Type,
    Monitor,
    Smartphone,
    Sparkles,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppLanguage } from '@/hooks/use-app-language';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/analytics' },
    { title: 'Public Content', href: '/admin/content' },
];

export default function ContentIndex({ content }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: {
            head: 'Manage Public Content | Admin', title: 'Public Site Content', subtitle: 'Manage the text, announcements, and contact information displayed to visitors on the landing page.',
            settings: 'Landing Page Settings', settingsSub: 'Changes saved here will be reflected immediately on the public-facing website.',
            hero: 'Main Hero Title', heroHint: 'The large headline displayed at the very top of the landing page.',
            announce: 'Active Announcement Banner', announceHint: 'Leave blank to hide the announcement banner from visitors.',
            email: 'Gym Contact Email', emailHint: 'This email will receive inquiries from the public contact form.',
            preview: 'Live Landing Preview', desktop: 'Desktop', mobile: 'Mobile', unsaved: 'Unsaved changes', revert: 'Revert Changes', saving: 'Saving...', save: 'Save Settings',
        },
        fr: {
            head: 'Gestion du contenu public | Admin', title: 'Contenu du site public', subtitle: "Gerez les textes, annonces et informations de contact affiches sur la page d'accueil.",
            settings: "Parametres de la page d'accueil", settingsSub: 'Les modifications sont appliquees immediatement sur le site public.',
            hero: 'Titre principal Hero', heroHint: "Le grand titre affiche en haut de la page d'accueil.",
            announce: 'Banniere annonce active', announceHint: "Laissez vide pour masquer la banniere d'annonce.",
            email: 'Email de contact du club', emailHint: 'Cet email recevra les messages du formulaire public.',
            preview: 'Apercu en direct', desktop: 'Bureau', mobile: 'Mobile', unsaved: 'Modifications non enregistrees', revert: 'Annuler les modifications', saving: 'Enregistrement...', save: 'Enregistrer',
        },
        ar: {
            head: 'ادارة محتوى الموقع العام | الادمن', title: 'محتوى الموقع العام', subtitle: 'ادارة النصوص والاعلانات ومعلومات التواصل الظاهرة في الصفحة الرئيسية.',
            settings: 'اعدادات الصفحة الرئيسية', settingsSub: 'اي تعديل هنا سيظهر مباشرة في الموقع العام.',
            hero: 'العنوان الرئيسي', heroHint: 'العنوان الكبير الظاهر في اعلى الصفحة الرئيسية.',
            announce: 'شريط الاعلان النشط', announceHint: 'اتركه فارغا لاخفاء شريط الاعلان.',
            email: 'بريد تواصل النادي', emailHint: 'سيستقبل هذا البريد رسائل نموذج التواصل العام.',
            preview: 'معاينة مباشرة', desktop: 'سطح المكتب', mobile: 'الهاتف', unsaved: 'توجد تعديلات غير محفوظة', revert: 'التراجع عن التعديلات', saving: 'جاري الحفظ...', save: 'حفظ الاعدادات',
        },
    }[language];
    const { flash } = usePage().props as any;

    const { data, setData, post, processing, errors, isDirty, reset } = useForm({
        hero_title: content?.hero_title || '',
        announcement: content?.announcement || '',
        contact_email: content?.contact_email || '',
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
        post('/admin/content', { preserveScroll: true });
    };

    const previewHeroTitle = data.hero_title.trim() || 'Welcome to AI Gym';
    const previewAnnouncement = data.announcement.trim();
    const previewContactEmail = data.contact_email.trim() || 'contact@gym.com';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="admin-page-container" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* Header Section */}
                <div className="admin-page-header">
                    <div>
                        <h2 className="admin-page-title">
                            <Megaphone className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            {t.title}
                        </h2>
                        <p className="admin-page-subtitle">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={submit}>
                    <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-5">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <LayoutTemplate className="h-5 w-5 text-indigo-500" />
                                {t.settings}
                            </CardTitle>
                            <CardDescription>
                                {t.settingsSub}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-8">

                            {/* Hero Title Field */}
                            <div className="space-y-2">
                                <Label htmlFor="hero_title" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t.hero} <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative max-w-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Type className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="hero_title"
                                        type="text"
                                        value={data.hero_title}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                        placeholder="e.g., Welcome to AI Gym"
                                        className={`pl-10 h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-indigo-500 ${errors.hero_title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    />
                                </div>
                                {errors.hero_title && <p className="text-sm text-red-500 font-medium">{errors.hero_title}</p>}
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t.heroHint}</p>
                            </div>

                            {/* Announcement Field */}
                            <div className="space-y-2">
                                <Label htmlFor="announcement" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t.announce}
                                </Label>
                                <div className="relative max-w-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BellRing className="h-4 w-4 text-amber-500" />
                                    </div>
                                    <Input
                                        id="announcement"
                                        type="text"
                                        value={data.announcement}
                                        onChange={(e) => setData('announcement', e.target.value)}
                                        placeholder="e.g., New Yoga classes starting next week!"
                                        className={`pl-10 h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-indigo-500 ${errors.announcement ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    />
                                </div>
                                {errors.announcement && <p className="text-sm text-red-500 font-medium">{errors.announcement}</p>}
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t.announceHint}</p>
                            </div>

                            {/* Contact Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="contact_email" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t.email} <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative max-w-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        placeholder="contact@gym.com"
                                        className={`pl-10 h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-indigo-500 ${errors.contact_email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    />
                                </div>
                                {errors.contact_email && <p className="text-sm text-red-500 font-medium">{errors.contact_email}</p>}
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t.emailHint}</p>
                            </div>

                            {/* Live Preview */}
                            <div className="pt-3">
                                <div className="mb-4 flex items-center gap-2 border-t border-slate-100 pt-6 text-sm font-semibold text-slate-700 dark:border-zinc-800 dark:text-slate-300">
                                    <Sparkles className="h-4 w-4 text-indigo-500" />
                                    {t.preview}
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            <Monitor className="h-3.5 w-3.5" />
                                            {t.desktop}
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
                                            {previewAnnouncement && (
                                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                                                    <BellRing className="h-3.5 w-3.5" />
                                                    {previewAnnouncement}
                                                </div>
                                            )}
                                            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                                {previewHeroTitle}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                                Train smarter. Manage better. Scale your gym operations with AI.
                                            </p>
                                            <p className="mt-5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                Contact: {previewContactEmail}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            <Smartphone className="h-3.5 w-3.5" />
                                            {t.mobile}
                                        </div>
                                        <div className="mx-auto max-w-[280px] rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
                                            {previewAnnouncement && (
                                                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                                                    <BellRing className="h-3 w-3" />
                                                    {previewAnnouncement}
                                                </div>
                                            )}
                                            <h3 className="text-xl leading-tight font-extrabold text-slate-900 dark:text-white">
                                                {previewHeroTitle}
                                            </h3>
                                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                Smarter workflows for coaches and admins.
                                            </p>
                                            <p className="mt-4 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                                {previewContactEmail}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </CardContent>

                        <CardFooter className="bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 px-6 py-5 flex items-center justify-end gap-4">
                            {/* Unsaved changes indicator */}
                            {isDirty && (
                                <span className="text-sm text-amber-600 dark:text-amber-400 font-medium mr-auto flex items-center">
                                    <span className="relative flex h-2 w-2 mr-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                    </span>
                                    {t.unsaved}
                                </span>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                disabled={!isDirty || processing}
                                className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 h-11 px-6 rounded-xl"
                            >
                                {t.revert}
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-xl h-11 px-8 min-w-[140px]"
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t.saving}
                                    </span>
                                ) : (
                                    <span className="flex items-center font-bold">
                                        <Save className="mr-2 h-4 w-4" /> {t.save}
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
