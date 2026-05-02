import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Activity,
    Bot,
    ArrowLeft,
    Stethoscope,
    HeartPulse,
    Scale,
    Ruler
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BreadcrumbItem } from '@/types';
import { useAppLanguage } from '@/hooks/use-app-language';
import { toast } from 'sonner';

export default function CreateAssessment({ client }: any) {
    const { language, isRTL } = useAppLanguage();
    const { flash } = usePage().props as any;
    const t = {
        en: { roster: 'My Roster', newAssessment: 'New AI Assessment', head: 'New Assessment', title: 'AI Health Assessment', subtitle: 'Enter the physical and sanitary data for', cancel: 'Cancel', physical: 'Physical Assessment', health: 'Health Assessment', height: 'Height (cm)', weight: 'Current Weight (kg)', pressure: 'Blood Pressure', allergies: 'Allergies or Conditions', obs: 'Coach Observations (Optional)', obsPlaceholder: 'Add any additional context for the AI to consider...', aiInfo: 'Gemini 2.5 will calculate the target weight and generate a medical strategy automatically.', analyzing: 'Analyzing Biometrics...', run: 'Run AI Analysis & Save', infoToast: 'Transmitting biometrics to Gemini AI for medical analysis...' },
        fr: { roster: 'Mes clients', newAssessment: 'Nouvelle evaluation IA', head: 'Nouvelle evaluation', title: 'Evaluation sante IA', subtitle: 'Saisissez les donnees physiques et sanitaires de', cancel: 'Annuler', physical: 'Bilan physique', health: 'Bilan sanitaire', height: 'Taille (cm)', weight: 'Poids actuel (kg)', pressure: 'Tension arterielle', allergies: 'Allergies ou conditions', obs: 'Observations du coach (optionnel)', obsPlaceholder: 'Ajoutez du contexte supplementaire pour l IA...', aiInfo: 'Gemini 2.5 calcule le poids cible et genere une strategie medicale.', analyzing: 'Analyse des biometries...', run: 'Lancer analyse IA et enregistrer', infoToast: 'Transmission des biometries a Gemini IA...' },
        ar: { roster: 'عملائي', newAssessment: 'تقييم ذكاء اصطناعي جديد', head: 'تقييم جديد', title: 'تقييم صحي بالذكاء الاصطناعي', subtitle: 'ادخل البيانات الجسدية والصحية للعميل', cancel: 'الغاء', physical: 'تقييم بدني', health: 'تقييم صحي', height: 'الطول (سم)', weight: 'الوزن الحالي (كغ)', pressure: 'ضغط الدم', allergies: 'الحساسية او الحالات المرضية', obs: 'ملاحظات المدرب (اختياري)', obsPlaceholder: 'اضف معلومات اضافية للذكاء الاصطناعي...', aiInfo: 'Gemini 2.5 سيحسب الوزن المستهدف ويولد استراتيجية طبية تلقائيا.', analyzing: 'جاري تحليل القياسات...', run: 'تشغيل التحليل وحفظ', infoToast: 'جاري ارسال القياسات الى Gemini AI للتحليل...' },
    }[language];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.roster, href: '/coach/clients' },
        { title: client.name, href: `/coach/clients/${client.id}` },
        { title: t.newAssessment, href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        client_id: client.id,
        height: '',
        weight: '',
        blood_pressure: '120/80', // default normal resting
        allergies: '',
        notes: '',
    });

    useEffect(() => {
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.info(t.infoToast);
        post('/coach/assessments');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t.head}: ${client.name}`} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            {t.title}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t.subtitle} <span className="font-bold text-slate-700 dark:text-slate-300">{client.name}</span>.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="bg-white dark:bg-zinc-900">
                        <Link href={`/coach/clients/${client.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> {t.cancel}
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Section 1: Bilan Physique */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Scale className="h-5 w-5 text-emerald-500" /> {t.physical}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Ruler className="h-4 w-4 text-slate-400" /> {t.height} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.height}
                                        onChange={e => setData('height', e.target.value)}
                                        placeholder="e.g. 180"
                                        required
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900"
                                    />
                                    {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Scale className="h-4 w-4 text-slate-400" /> {t.weight} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={data.weight}
                                        onChange={e => setData('weight', e.target.value)}
                                        placeholder="e.g. 85.5"
                                        required
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900"
                                    />
                                    {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 2: Bilan Sanitaire */}
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <HeartPulse className="h-5 w-5 text-rose-500" /> {t.health}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <HeartPulse className="h-4 w-4 text-slate-400" /> {t.pressure} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        value={data.blood_pressure}
                                        onChange={e => setData('blood_pressure', e.target.value)}
                                        placeholder="120/80"
                                        required
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900"
                                    />
                                    {errors.blood_pressure && <p className="text-sm text-red-500">{errors.blood_pressure}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Stethoscope className="h-4 w-4 text-slate-400" /> {t.allergies}
                                    </Label>
                                    <Input
                                        type="text"
                                        value={data.allergies}
                                        onChange={e => setData('allergies', e.target.value)}
                                        placeholder="e.g. Asthma, Peanuts, None"
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900"
                                    />
                                    {errors.allergies && <p className="text-sm text-red-500">{errors.allergies}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Section 3: Extra Notes & Action */}
                    <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <Label>{t.obs}</Label>
                                <Textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder={t.obsPlaceholder}
                                    rows={3}
                                    className="resize-none bg-slate-50 dark:bg-zinc-900 rounded-xl"
                                />
                                {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                            </div>
                        </CardContent>

                        {/* The Submit Button Area */}
                        <CardFooter className="bg-emerald-50/50 dark:bg-emerald-900/10 border-t border-emerald-100 dark:border-emerald-900/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
                                <div className="p-2 bg-emerald-200 dark:bg-emerald-500/30 rounded-full animate-pulse">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div className="text-sm font-medium">
                                    {t.aiInfo}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-xl shadow-md shadow-emerald-500/20 text-base"
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t.analyzing}
                                    </span>
                                ) : (
                                    <span className="flex items-center font-bold">
                                        {t.run}
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
