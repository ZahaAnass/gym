import { Head, Link, useForm } from '@inertiajs/react';
import {
    Save,
    ArrowLeft,
    User,
    Mail,
    Lock,
    Shield,
    Dumbbell,
    Info
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppLanguage } from '@/hooks/use-app-language';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function EditUser({ user, roles, coaches }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: { head: `Edit ${user.name} | Admin`, title: 'Edit Account', subtitlePrefix: 'Updating profile details for', back: 'Back to Directory', cancel: 'Cancel', save: 'Save Changes' },
        fr: { head: `Modifier ${user.name} | Admin`, title: 'Modifier le compte', subtitlePrefix: 'Mise a jour du profil de', back: "Retour a l'annuaire", cancel: 'Annuler', save: 'Enregistrer' },
        ar: { head: `تعديل ${user.name} | الادمن`, title: 'تعديل الحساب', subtitlePrefix: 'تحديث بيانات الملف الشخصي للمستخدم', back: 'العودة للدليل', cancel: 'الغاء', save: 'حفظ التعديلات' },
    }[language];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/analytics' },
        { title: 'Users', href: '/admin/users' },
        { title: 'Edit User', href: `/admin/users/${user.id}/edit` },
    ];

    const currentRole = user.roles && user.roles.length > 0 ? user.roles[0].name : '';

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '', // Left blank intentionally
        role: currentRole,
        coach_id: user.coach_id ? user.coach_id.toString() : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="admin-page-container narrow" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            {t.title}
                            <Badge variant="outline" className="text-sm font-medium bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900">
                                ID: #{user.id}
                            </Badge>
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t.subtitlePrefix} <span className="font-semibold text-slate-700 dark:text-slate-300">{user.name}</span>.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                        <Link href="/admin/users">
                            <ArrowLeft className="mr-2 h-4 w-4" /> {t.back}
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Section 1: Personal Details */}
                    <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <User className="h-5 w-5 text-emerald-500" /> Account Details
                            </CardTitle>
                            <CardDescription>Modify the primary identifying information.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Full Name <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                        className="pl-10 h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-emerald-500"
                                    />
                                </div>
                                {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Email Address <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                        className="pl-10 h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-emerald-500"
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 2: Security & Permissions */}
                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Security */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden h-fit">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <Lock className="h-5 w-5 text-emerald-500" /> Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Reset Password <span className="text-slate-400 font-normal">(Optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="pl-10 h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-emerald-500 placeholder:text-slate-400"
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 mt-1">
                                        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                        Only fill this out if the user has requested a password reset.
                                    </p>
                                    {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Permissions */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden h-fit">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <Shield className="h-5 w-5 text-emerald-500" /> Platform Access
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        System Role <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.role} onValueChange={(val) => {
                                        setData('role', val);

                                        if (val !== 'client') {
setData('coach_id', '');
}
                                    }}>
                                        <SelectTrigger className="h-11 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                                            <SelectValue placeholder="Select a role..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((r: any) => (
                                                <SelectItem key={r.name} value={r.name} className="capitalize">{r.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-sm text-red-500 font-medium">{errors.role}</p>}
                                </div>

                                {data.role === 'client' && (
                                    <div className="space-y-3 p-4 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                                        <Label htmlFor="coach_id" className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                                            <Dumbbell className="h-4 w-4" /> Coach Assignment
                                        </Label>
                                        <Select value={data.coach_id} onValueChange={val => setData('coach_id', val === 'unassigned' ? '' : val)}>
                                            <SelectTrigger className="h-11 bg-white dark:bg-zinc-900 border-emerald-200 dark:border-emerald-500/30 rounded-xl">
                                                <SelectValue placeholder="Assign a coach (Optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unassigned">None (Unassigned)</SelectItem>
                                                {coaches.map((c: any) => (
                                                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.coach_id && <p className="text-sm text-red-500 font-medium">{errors.coach_id}</p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Button type="button" variant="ghost" asChild className="text-slate-500">
                            <Link href="/admin/users">{t.cancel}</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 rounded-xl h-11 px-8"
                        >
                            {processing ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving Changes...
                                </span>
                            ) : (
                                <span className="flex items-center text-sm font-bold">
                                    <Save className="mr-2 h-4 w-4" /> {t.save}
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
