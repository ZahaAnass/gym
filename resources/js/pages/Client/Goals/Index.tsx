import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import {
    Target, Plus, Save, Flag, CheckCircle2, Bot, Sparkles, Trash2, ChevronRight, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { useAppLanguage } from '@/hooks/use-app-language';
import { getPageTranslations } from '@/lang/pages';

export default function GoalsIndex({ goals, stats }: any) {
    const { language, isRTL } = useAppLanguage();
    const { flash } = usePage().props as any;
    const [generatingId, setGeneratingId] = useState<number | null>(null);

    // Form for creating a new Goal
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        target_value: '',
        deadline: '',
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // Handle creating a goal
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/client/goals', { onSuccess: () => reset() });
    };

    // Handle quick progress update
    const t = getPageTranslations(language).clientGoals;

    const updateProgress = (id: number, current: number, target: number) => {
        const newValue = prompt(t.progressPrompt, current.toString());
        if (newValue !== null && !isNaN(Number(newValue))) {
            const numValue = Number(newValue);
            router.put(`/client/goals/${id}`, {
                current_value: numValue,
            }, { preserveScroll: true });
        }
    };

    // Handle Goal Deletion
    const deleteGoal = (id: number) => {
        if (confirm(t.deleteConfirm)) {
            router.delete(`/client/goals/${id}`, { preserveScroll: true });
        }
    };

    // 🔥 THE WOW FACTOR: Call the Gemini Service
    const generateAIAdvice = (id: number) => {
        router.post(`/client/goals/${id}/ai-advice`, {}, {
            preserveScroll: true,
            onStart: () => setGeneratingId(id),
            onFinish: () => setGeneratingId(null),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.dashboard, href: '/dashboard' },
        { title: t.myGoals, href: '/client/goals' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Target className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            {t.title}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-slate-500">{t.totalGoals}</span>
                            <span className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">{stats.total}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-teal-50/50 dark:bg-teal-500/5 border-teal-100 dark:border-teal-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">{t.inProgress}</span>
                            <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-300 mt-1">{stats.active}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{t.achieved}</span>
                            <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{stats.reached}</span>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-12 gap-8">

                    {/* Left Column: List Goals */}
                    <div className="md:col-span-8 space-y-6">
                        {goals.length === 0 ? (
                            <div className="text-center p-16 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-700 flex flex-col items-center">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                    <Flag className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">{t.noGoals}</h3>
                                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                                    {t.noGoalsSub}
                                </p>
                            </div>
                        ) : (
                            goals.map((goal: any) => {
                                const progressPercentage = Math.min((goal.current_value / goal.target_value) * 100, 100);
                                const isComplete = goal.status === 'reached';

                                return (
                                    <Card key={goal.id} className={`shadow-sm rounded-3xl overflow-hidden transition-all ${isComplete ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-slate-200 dark:border-zinc-800'}`}>
                                        <CardContent className={`p-6 ${isComplete ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : 'bg-white dark:bg-zinc-950'}`}>
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                                        {goal.title}
                                                        {isComplete && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                        <Activity className="h-3.5 w-3.5" /> {t.deadline}: {new Date(goal.deadline).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant={isComplete ? 'default' : 'secondary'} className={isComplete ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300'}>
                                                    {goal.status}
                                                </Badge>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between text-sm font-semibold">
                                                    <span className="text-emerald-600 dark:text-emerald-400">{t.current}: {goal.current_value}</span>
                                                    <span className="text-slate-900 dark:text-white">{t.target}: {goal.target_value}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden shadow-inner">
                                                    <div
                                                        className={`h-full transition-all duration-700 ease-out ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-lime-500'}`}
                                                        style={{ width: `${progressPercentage}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* AI Strategy Advice Block */}
                                            {goal.ai_strategy_advice && (
                                                <div className="mt-4 p-5 rounded-2xl bg-lime-50/50 dark:bg-lime-900/10 border border-lime-100 dark:border-lime-900/30 relative">
                                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                                        <Bot className="h-16 w-16" />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-lime-900 dark:text-lime-300 mb-2 flex items-center gap-2">
                                                        <Sparkles className="h-4 w-4 text-lime-500" /> {t.strategyPlan}
                                                    </h4>
                                                    <p className="text-sm text-lime-800 dark:text-lime-200 leading-relaxed whitespace-pre-wrap relative z-10">
                                                        {goal.ai_strategy_advice}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-6 flex flex-wrap gap-3">
                                                {!isComplete && (
                                                    <Button variant="outline" onClick={() => updateProgress(goal.id, goal.current_value, goal.target_value)} className="bg-white dark:bg-zinc-900 rounded-xl">
                                                        {t.logProgress}
                                                    </Button>
                                                )}

                                                {/* 🔥 The AI Trigger Button */}
                                                {!isComplete && (
                                                    <Button
                                                        onClick={() => generateAIAdvice(goal.id)}
                                                        disabled={generatingId === goal.id}
                                                        className="bg-lime-600 hover:bg-lime-700 text-white rounded-xl shadow-md shadow-lime-500/20"
                                                    >
                                                        {generatingId === goal.id ? (
                                                            <span className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> {t.analyzing}</span>
                                                        ) : (
                                                            <span className="flex items-center"><Bot className="mr-2 h-4 w-4" /> {goal.ai_strategy_advice ? t.refreshStrategy : t.getStrategy}</span>
                                                        )}
                                                    </Button>
                                                )}

                                                <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)} className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* Right Column: Create Goal Form */}
                    <div className="md:col-span-4">
                        <Card className="shadow-lg shadow-emerald-500/5 border-emerald-100 dark:border-emerald-900/30 rounded-3xl sticky top-24 overflow-hidden">
                            <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-lime-500" />
                            <CardHeader className="bg-white dark:bg-zinc-950 pb-2">
                                <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Plus className="h-5 w-5 text-emerald-500"/> {t.createGoal}
                                </CardTitle>
                                <CardDescription>{t.createGoalSub}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 bg-white dark:bg-zinc-950">
                                <form onSubmit={submit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">{t.goalDesc}</Label>
                                        <Input
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="e.g. Lose 5kg of fat"
                                            required
                                            className="h-12 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:ring-emerald-500"
                                        />
                                        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">{t.numericTarget}</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            value={data.target_value}
                                            onChange={e => setData('target_value', e.target.value)}
                                            placeholder="e.g. 5"
                                            required
                                            className="h-12 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:ring-emerald-500"
                                        />
                                        <p className="text-[11px] text-slate-400">{t.numericHint}</p>
                                        {errors.target_value && <p className="text-xs text-red-500">{errors.target_value}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">{t.targetDate}</Label>
                                        <Input
                                            type="date"
                                            value={data.deadline}
                                            onChange={e => setData('deadline', e.target.value)}
                                            required
                                            className="h-12 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:ring-emerald-500"
                                        />
                                        {errors.deadline && <p className="text-xs text-red-500">{errors.deadline}</p>}
                                    </div>
                                    <Button type="submit" disabled={processing} className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity mt-2">
                                        <Save className="mr-2 h-4 w-4" /> {t.saveObjective}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
