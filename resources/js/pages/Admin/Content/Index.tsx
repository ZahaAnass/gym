import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Megaphone,
    Save,
    LayoutTemplate,
    Mail,
    BellRing,
    Type
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/analytics' },
    { title: 'Public Content', href: '/admin/content' },
];

export default function ContentIndex({ content }: any) {
    const { flash } = usePage().props as any;

    const { data, setData, post, processing, errors, isDirty, reset } = useForm({
        hero_title: content?.hero_title || '',
        announcement: content?.announcement || '',
        contact_email: content?.contact_email || '',
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/content', { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Public Content | Admin" />

            <div className="p-6 space-y-8 w-full max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Megaphone className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Public Site Content
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage the text, announcements, and contact information displayed to visitors on the landing page.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={submit}>
                    <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-5">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <LayoutTemplate className="h-5 w-5 text-indigo-500" />
                                Landing Page Settings
                            </CardTitle>
                            <CardDescription>
                                Changes saved here will be reflected immediately on the public-facing website.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-8">

                            {/* Hero Title Field */}
                            <div className="space-y-2">
                                <Label htmlFor="hero_title" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Main Hero Title <span className="text-red-500">*</span>
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
                                <p className="text-xs text-slate-500 dark:text-slate-400">The large headline displayed at the very top of the landing page.</p>
                            </div>

                            {/* Announcement Field */}
                            <div className="space-y-2">
                                <Label htmlFor="announcement" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Active Announcement Banner
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
                                <p className="text-xs text-slate-500 dark:text-slate-400">Leave blank to hide the announcement banner from visitors.</p>
                            </div>

                            {/* Contact Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="contact_email" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Gym Contact Email <span className="text-red-500">*</span>
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
                                <p className="text-xs text-slate-500 dark:text-slate-400">This email will receive inquiries from the public contact form.</p>
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
                                    Unsaved changes
                                </span>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                disabled={!isDirty || processing}
                                className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 h-11 px-6 rounded-xl"
                            >
                                Revert Changes
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
                                        Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center font-bold">
                                        <Save className="mr-2 h-4 w-4" /> Save Settings
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
