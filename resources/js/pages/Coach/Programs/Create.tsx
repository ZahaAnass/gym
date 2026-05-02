import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Sparkles, ArrowLeft, Save, Dumbbell, Calendar, Target, Activity, Settings2, Loader2, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { useAppLanguage } from '@/hooks/use-app-language';

export default function CreateProgram({ client }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: { dashboard: 'Dashboard', programs: 'Programs', aiGenerator: 'AI Generator', head: 'AI Program Generator', title: 'AI Program Generator', libraryFallback: 'Design a new program to save to your master library.', aiParameters: 'AI Parameters', generate: 'Generate with Gemini AI', generating: 'Generating Plan...', preview: 'Program Preview & Editor', previewSub: "You can manually edit the AI's output before saving it.", cancel: 'Cancel', saving: 'Saving...', saveLibrary: 'Save to Master Library', ready: 'Ready for Generation' },
        fr: { dashboard: 'Tableau', programs: 'Programmes', aiGenerator: 'Generateur IA', head: 'Generateur IA', title: 'Generateur de programme IA', libraryFallback: 'Creez un nouveau programme pour votre bibliotheque.', aiParameters: 'Parametres IA', generate: 'Generer avec Gemini IA', generating: 'Generation en cours...', preview: 'Apercu & editeur', previewSub: 'Vous pouvez modifier le resultat IA avant enregistrement.', cancel: 'Annuler', saving: 'Enregistrement...', saveLibrary: 'Enregistrer en bibliotheque', ready: 'Pret pour la generation' },
        ar: { dashboard: 'لوحة التحكم', programs: 'البرامج', aiGenerator: 'مولد الذكاء الاصطناعي', head: 'مولد البرامج بالذكاء الاصطناعي', title: 'مولد البرامج بالذكاء الاصطناعي', libraryFallback: 'صمم برنامجا جديدا لحفظه في مكتبتك.', aiParameters: 'اعدادات الذكاء الاصطناعي', generate: 'توليد عبر Gemini AI', generating: 'جاري التوليد...', preview: 'معاينة وتحرير البرنامج', previewSub: 'يمكنك تعديل نتيجة الذكاء الاصطناعي قبل الحفظ.', cancel: 'الغاء', saving: 'جاري الحفظ...', saveLibrary: 'حفظ في المكتبة', ready: 'جاهز للتوليد' },
    }[language];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.dashboard, href: '/coach/dashboard' },
        { title: t.programs, href: '/coach/programs' },
        { title: t.aiGenerator, href: '/coach/programs/create' },
    ];

    // AI Generation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiParams, setAiParams] = useState({
        goal: 'Muscle Hypertrophy',
        level: 'Intermediate',
        days: '4',
        equipment: 'Full Gym Access',
        notes: ''
    });

    // Form Submission State (Inertia)
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        is_ai_generated: true,
        client_id: client ? client.id : '',
    });

    // Trigger Gemini API
    const handleGenerateAI = async () => {
        setIsGenerating(true);
        toast.info("Gemini is analyzing parameters and writing the program...");

        try {
            const response = await axios.post('/coach/programs/generate-ai', aiParams);

            if (response.data && response.data.title) {
                setData(prev => ({
                    ...prev,
                    title: response.data.title,
                    description: response.data.description,
                    is_ai_generated: true
                }));
                toast.success("AI Program generated successfully! Review and save.");
            }
        } catch (error) {
            toast.error("Failed to generate program. The AI might be overloaded, please try again.");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Save to Database
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/coach/programs');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild className="h-10 w-10 rounded-full border-slate-200">
                            <Link href={client ? `/coach/clients/${client.id}` : "/coach/programs"}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                                <Sparkles className="h-8 w-8 text-indigo-500" />
                                {t.title}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {client ? (
                                    <span className="flex items-center gap-2">
                                        Generating custom plan for <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none"><User className="h-3 w-3 mr-1"/>{client.name}</Badge>
                                    </span>
                                ) : (
                                    t.libraryFallback
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: AI Parameter Builder */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="shadow-lg border-indigo-100 dark:border-indigo-900/30 rounded-2xl bg-gradient-to-b from-white to-indigo-50/50 dark:from-zinc-950 dark:to-indigo-950/20">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
                                    <Settings2 className="h-5 w-5" /> {t.aiParameters}
                                </CardTitle>
                                <CardDescription>Define the constraints for Gemini to build the perfect workout.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Target className="h-3.5 w-3.5"/> Primary Goal</Label>
                                    <Select value={aiParams.goal} onValueChange={(v) => setAiParams({...aiParams, goal: v})}>
                                        <SelectTrigger className="bg-white dark:bg-zinc-900 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Muscle Hypertrophy">Muscle Hypertrophy (Growth)</SelectItem>
                                            <SelectItem value="Fat Loss & Toning">Fat Loss & Toning</SelectItem>
                                            <SelectItem value="Maximum Strength">Maximum Strength</SelectItem>
                                            <SelectItem value="Endurance & Stamina">Endurance & Stamina</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Activity className="h-3.5 w-3.5"/> Fitness Level</Label>
                                    <Select value={aiParams.level} onValueChange={(v) => setAiParams({...aiParams, level: v})}>
                                        <SelectTrigger className="bg-white dark:bg-zinc-900 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                            <SelectItem value="Elite Athlete">Elite Athlete</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Calendar className="h-3.5 w-3.5"/> Days/Week</Label>
                                        <Select value={aiParams.days} onValueChange={(v) => setAiParams({...aiParams, days: v})}>
                                            <SelectTrigger className="bg-white dark:bg-zinc-900 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2">2 Days</SelectItem>
                                                <SelectItem value="3">3 Days</SelectItem>
                                                <SelectItem value="4">4 Days</SelectItem>
                                                <SelectItem value="5">5 Days</SelectItem>
                                                <SelectItem value="6">6 Days</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Dumbbell className="h-3.5 w-3.5"/> Equipment</Label>
                                        <Select value={aiParams.equipment} onValueChange={(v) => setAiParams({...aiParams, equipment: v})}>
                                            <SelectTrigger className="bg-white dark:bg-zinc-900 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Full Gym Access">Full Gym</SelectItem>
                                                <SelectItem value="Dumbbells Only">Dumbbells Only</SelectItem>
                                                <SelectItem value="Bodyweight Only">Bodyweight</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Additional Instructions</Label>
                                    <Textarea
                                        placeholder="e.g. Client has a bad lower back, avoid heavy deadlifts..."
                                        className="bg-white dark:bg-zinc-900 rounded-xl resize-none"
                                        rows={3}
                                        value={aiParams.notes}
                                        onChange={(e) => setAiParams({...aiParams, notes: e.target.value})}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl text-md font-bold shadow-md shadow-indigo-500/20 transition-all"
                                >
                                    {isGenerating ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t.generating}</>
                                    ) : (
                                        <><Sparkles className="mr-2 h-5 w-5" /> {t.generate}</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: The Result & Form */}
                    <div className="lg:col-span-8">
                        <form onSubmit={submit}>
                            <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 min-h-[600px] flex flex-col">
                                <CardHeader className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 pb-4">
                                    <CardTitle className="text-lg flex justify-between items-center">
                                        <span>{t.preview}</span>
                                        {data.is_ai_generated && data.title && (
                                            <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 border-none"><Sparkles className="h-3 w-3 mr-1"/> AI Draft</Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription>{t.previewSub}</CardDescription>
                                </CardHeader>

                                <CardContent className="p-6 flex-grow flex flex-col gap-6">
                                    {!data.title && !data.description && !isGenerating ? (
                                        <div className="flex-grow flex flex-col items-center justify-center text-slate-400 opacity-60">
                                            <Dumbbell className="h-16 w-16 mb-4" />
                                            <p className="text-lg font-medium">{t.ready}</p>
                                            <p className="text-sm max-w-sm text-center mt-2">Adjust parameters on the left and click Generate to let Gemini write your program.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-sm font-bold text-slate-700 dark:text-slate-300">Program Title <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="title"
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                    required
                                                    className="h-12 text-lg font-bold bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl"
                                                    placeholder="e.g. 4-Week Hypertrophy Protocol"
                                                    disabled={isGenerating}
                                                />
                                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                            </div>

                                            <div className="space-y-2 flex-grow flex flex-col">
                                                <Label htmlFor="description" className="text-sm font-bold text-slate-700 dark:text-slate-300">Workout Plan & Instructions <span className="text-red-500">*</span></Label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={e => setData('description', e.target.value)}
                                                    required
                                                    className="flex-grow min-h-[350px] font-mono text-sm leading-relaxed bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl p-4"
                                                    placeholder="The detailed workout plan will appear here..."
                                                    disabled={isGenerating}
                                                />
                                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                            </div>
                                        </>
                                    )}
                                </CardContent>

                                <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 flex justify-end gap-3 rounded-b-2xl">
                                    <Button type="button" variant="ghost" asChild>
                                        <Link href={client ? `/coach/clients/${client.id}` : "/coach/programs"}>{t.cancel}</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing || (!data.title && !data.description)}
                                        className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white rounded-xl font-bold px-8 shadow-md"
                                    >
                                        {processing ? t.saving : (client ? `Save & Assign to ${client.name.split(' ')[0]}` : t.saveLibrary)}
                                    </Button>
                                </div>
                            </Card>
                        </form>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
