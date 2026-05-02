import React, { useEffect, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import {
    Dumbbell, Search, Sparkles, Bot, Plus, Trash2, Save, Activity, LayoutList, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbItem } from '@/types';
import InertiaPagination from '@/components/inertia-pagination';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import axios from 'axios';
import { useAppLanguage } from '@/hooks/use-app-language';

export default function ProgramsIndex({ programs, filters, stats }: any) {
    const { language, isRTL } = useAppLanguage();
    const { flash } = usePage().props as any;
    const t = {
        en: { dashboard: 'Dashboard', programs: 'Workout Programs', head: 'Program Library | Coach', title: 'Program Library', subtitle: 'Manage your workout templates and generate new ones via Gemini AI.', createProgram: 'Create Program', saveToLibrary: 'Save to Library', total: 'Total Programs', aiGenerated: 'AI Generated', manual: 'Manually Written', search: 'Search library...', read: 'Read Full Program', close: 'Close Window' },
        fr: { dashboard: 'Tableau', programs: 'Programmes', head: 'Bibliotheque programmes | Coach', title: 'Bibliotheque de programmes', subtitle: 'Gerez vos templates et generez via Gemini IA.', createProgram: 'Creer programme', saveToLibrary: 'Enregistrer en bibliotheque', total: 'Total programmes', aiGenerated: 'Genere par IA', manual: 'Redige manuellement', search: 'Rechercher...', read: 'Lire le programme', close: 'Fermer' },
        ar: { dashboard: 'لوحة التحكم', programs: 'برامج التمرين', head: 'مكتبة البرامج | المدرب', title: 'مكتبة البرامج', subtitle: 'ادارة قوالب التدريب وتوليد برامج جديدة عبر Gemini AI.', createProgram: 'انشاء برنامج', saveToLibrary: 'حفظ في المكتبة', total: 'اجمالي البرامج', aiGenerated: 'مولد بالذكاء الاصطناعي', manual: 'مكتوب يدويا', search: 'ابحث في المكتبة...', read: 'قراءة البرنامج كاملا', close: 'اغلاق' },
    }[language];

    // States for our two different modals
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [viewProgram, setViewProgram] = useState<any>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState('ai');

    // Form for saving to Database
    const { data: form, setData: setForm, post, processing, reset: resetForm } = useForm({
        title: '',
        description: '',
        is_ai_generated: false,
    });

    // Form for AI Prompt parameters
    const [aiParams, setAiParams] = useState({
        goal: '', level: '', days: '3', equipment: '', notes: ''
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/coach/programs", { search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const handleDelete = (id: number) => {
        if (confirm("Delete this program?")) {
            router.delete(`/coach/programs/${id}`, { preserveScroll: true });
        }
    };

    // Trigger Gemini API
    const handleGenerateAI = async () => {
        if (!aiParams.goal || !aiParams.level || !aiParams.equipment) {
            toast.error("Please fill in the required AI parameters (Goal, Level, Equipment).");
            return;
        }

        setIsGenerating(true);
        toast.info("Gemini AI is analyzing constraints and building the program...");

        try {
            const response = await axios.post('/coach/programs/generate-ai', aiParams);

            setForm({
                title: response.data.title,
                description: response.data.description,
                is_ai_generated: true
            });

            toast.success("AI Generation complete! You can now review and edit.");
            setActiveTab('manual');
        } catch (error) {
            toast.error("Failed to generate program. The AI might be overloaded.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveProgram = (e: React.FormEvent) => {
        e.preventDefault();
        post('/coach/programs', {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                resetForm();
                setAiParams({ goal: '', level: '', days: '3', equipment: '', notes: '' });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: t.dashboard, href: '/dashboard' }, { title: t.programs, href: '/coach/programs' }]}>
            <Head title={t.head} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header & Create Modal Trigger */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Dumbbell className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            {t.title}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 h-11 rounded-xl px-6">
                                <Sparkles className="mr-2 h-4 w-4" /> {t.createProgram}
                            </Button>
                        </DialogTrigger>
                        {/* 🔥 FIXED: Added max-h-[85vh] and overflow-y-auto here so the modal scrolls! */}
                        <DialogContent className="sm:max-w-2xl bg-white dark:bg-zinc-950 rounded-3xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                    <LayoutList className="h-5 w-5 text-emerald-500"/> Program Builder
                                </DialogTitle>
                            </DialogHeader>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                                <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl">
                                    <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-lime-600 dark:data-[state=active]:text-lime-400 shadow-sm transition-all">
                                        <Bot className="mr-2 h-4 w-4" /> Gemini AI Generator
                                    </TabsTrigger>
                                    <TabsTrigger value="manual" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm transition-all">
                                        <Dumbbell className="mr-2 h-4 w-4" /> Manual Editor
                                    </TabsTrigger>
                                </TabsList>

                                {/* AI GENERATOR TAB */}
                                <TabsContent value="ai" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Primary Goal</Label>
                                            <Input placeholder="e.g. Hypertrophy, Fat Loss" value={aiParams.goal} onChange={e => setAiParams({...aiParams, goal: e.target.value})} className="bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Client Level</Label>
                                            <Select value={aiParams.level} onValueChange={v => setAiParams({...aiParams, level: v})}>
                                                <SelectTrigger className="bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"><SelectValue placeholder="Select level" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Available Equipment</Label>
                                            <Input placeholder="e.g. Full Gym, Dumbbells only, Bodyweight" value={aiParams.equipment} onChange={e => setAiParams({...aiParams, equipment: e.target.value})} className="bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Days per Week</Label>
                                            <Select value={aiParams.days} onValueChange={v => setAiParams({...aiParams, days: v})}>
                                                <SelectTrigger className="bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"><SelectValue placeholder="3 Days" /></SelectTrigger>
                                                <SelectContent>
                                                    {[2,3,4,5,6].map(d => <SelectItem key={d} value={d.toString()}>{d} Days</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Medical Notes / Injuries (Optional)</Label>
                                        <Input placeholder="e.g. Bad lower back, avoid heavy deadlifts" value={aiParams.notes} onChange={e => setAiParams({...aiParams, notes: e.target.value})} className="bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800" />
                                    </div>
                                    <Button onClick={handleGenerateAI} disabled={isGenerating} className="w-full bg-lime-600 hover:bg-lime-700 text-white mt-4 h-12 rounded-xl text-md shadow-md shadow-lime-500/20 transition-all">
                                        {isGenerating ? 'Analyzing Biomechanics & Generating...' : <><Sparkles className="mr-2 h-5 w-5"/> Generate Program with AI</>}
                                    </Button>
                                </TabsContent>

                                {/* MANUAL EDITOR TAB */}
                                <TabsContent value="manual">
                                    <form onSubmit={handleSaveProgram} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Program Title</Label>
                                            <Input required value={form.title} onChange={e => setForm('title', e.target.value)} placeholder="e.g. 4-Week Hypertrophy Split" className="bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex justify-between items-center">
                                                <span>Program Details</span>
                                                {form.is_ai_generated && <Badge className="bg-lime-100 text-lime-700 dark:bg-lime-900/30 border-none px-2 py-0.5"><Bot className="h-3 w-3 mr-1"/> AI Drafted</Badge>}
                                            </Label>
                                            <Textarea required value={form.description} onChange={e => setForm('description', e.target.value)} rows={12} className="font-mono text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl p-4" />
                                        </div>
                                        <Button type="submit" disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 mt-4 rounded-xl text-md shadow-md shadow-emerald-500/20 transition-all">
                                            <Save className="mr-2 h-5 w-5" /> {t.saveToLibrary}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white dark:bg-zinc-950 border-slate-200 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-slate-500">{t.total}</span>
                            <span className="text-3xl font-extrabold mt-1">{stats.total}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-lime-50/50 border-lime-100 shadow-sm rounded-2xl dark:bg-lime-900/10 dark:border-lime-900/30">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-lime-600 dark:text-lime-400">{t.aiGenerated}</span>
                            <span className="text-3xl font-extrabold text-lime-700 dark:text-lime-300 mt-1">{stats.ai_generated}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-50/50 border-slate-100 shadow-sm rounded-2xl dark:bg-zinc-900 dark:border-zinc-800">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t.manual}</span>
                            <span className="text-3xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">{stats.manual}</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Input defaultValue={filters?.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="pl-10 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 rounded-xl h-11 shadow-sm" placeholder={t.search} />
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>

                {/* Grid of Programs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.data.map((prog: any) => (
                        <Card key={prog.id} className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col h-full bg-white dark:bg-zinc-950 transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50">
                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg leading-tight font-bold">{prog.title}</CardTitle>
                                    {prog.is_ai_generated && <Badge className="bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400 border-none shrink-0 ml-2 px-2 py-0.5"><Bot className="h-3 w-3 mr-1"/> AI</Badge>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Activity className="h-3 w-3" /> Created {new Date(prog.created_at).toLocaleDateString()}
                                </p>
                            </CardHeader>
                            <CardContent className="p-5 flex-1 relative">
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 whitespace-pre-wrap">{prog.description}</p>
                                {/* Fading effect at the bottom of the text to show it continues */}
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent dark:from-zinc-950"></div>
                            </CardContent>

                            {/* Card Footer Actions */}
                            <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/30 dark:bg-zinc-900/10">
                                <Button variant="outline" size="sm" onClick={() => setViewProgram(prog)} className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg shadow-sm">
                                    <Eye className="h-4 w-4 mr-1.5" /> {t.read}
                                </Button>

                                <Button variant="ghost" size="sm" onClick={() => handleDelete(prog.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-6"><InertiaPagination data={programs} /></div>
            </div>

            {/* 🚀 THE NEW FULL TEXT VIEW MODAL */}
            <Dialog open={!!viewProgram} onOpenChange={(open) => !open && setViewProgram(null)}>
                <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 rounded-3xl p-0">

                    <DialogHeader className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/50 flex flex-row items-center justify-between">
                        <DialogTitle className="text-2xl font-extrabold flex flex-col md:flex-row md:items-center gap-3 text-slate-900 dark:text-white">
                            {viewProgram?.title}
                            {viewProgram?.is_ai_generated && (
                                <Badge className="bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400 border-none w-fit">
                                    <Sparkles className="h-3 w-3 mr-1"/> AI Generated Plan
                                </Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Scrollable content area */}
                    <div className="overflow-y-auto px-6 py-6 bg-white dark:bg-zinc-950">
                        <div className="p-6 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                                {viewProgram?.description}
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end bg-slate-50/80 dark:bg-zinc-900/50">
                        <Button variant="outline" onClick={() => setViewProgram(null)} className="rounded-xl border-slate-200 dark:border-zinc-700">
                            {t.close}
                        </Button>
                    </div>

                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
