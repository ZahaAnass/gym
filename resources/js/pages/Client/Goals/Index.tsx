import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Target, Plus, Save, Flag, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

export default function GoalsIndex({ goals, stats }: any) {
    const { flash } = usePage().props as any;

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        target_value: '',
        deadline: '',
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/client/goals', { onSuccess: () => reset() });
    };

    const updateProgress = (id: number, current: number, target: number) => {
        const newValue = prompt("Enter new current value:", current.toString());
        if (newValue !== null && !isNaN(Number(newValue))) {
            const numValue = Number(newValue);
            router.put(`/client/goals/${id}`, {
                current_value: numValue,
                status: numValue >= target ? 'reached' : 'active'
            }, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'My Goals', href: '/client/goals' }]}>
            <Head title="My Goals" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Personal Objectives
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set targets, track progress, and crush your goals.</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-slate-500">Total Goals</span>
                            <span className="text-3xl font-extrabold mt-1">{stats.total}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50/50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">In Progress</span>
                            <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">{stats.active}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Achieved</span>
                            <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{stats.reached}</span>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Left: List Goals */}
                    <div className="md:col-span-8 space-y-4">
                        {goals.length === 0 ? (
                            <div className="text-center p-12 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700">
                                <Flag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-700 dark:text-slate-300">No goals set yet</h3>
                                <p className="text-sm text-slate-500 mt-1">Create your first goal to start tracking progress.</p>
                            </div>
                        ) : (
                            goals.map((goal: any) => {
                                const progressPercentage = Math.min((goal.current_value / goal.target_value) * 100, 100);
                                const isComplete = goal.status === 'reached';

                                return (
                                    <Card key={goal.id} className={`shadow-sm rounded-2xl transition-all ${isComplete ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-500/5' : 'border-slate-200 dark:border-zinc-800'}`}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                                        {goal.title}
                                                        {isComplete && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                        Target Date: {new Date(goal.deadline).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant={isComplete ? 'default' : 'secondary'} className={isComplete ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300'}>
                                                    {goal.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className="text-slate-600 dark:text-slate-400">Current: {goal.current_value}</span>
                                                    <span className="text-slate-900 dark:text-white">Goal: {goal.target_value}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                                        style={{ width: `${progressPercentage}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {!isComplete && (
                                                <div className="mt-6 flex justify-end">
                                                    <Button variant="outline" size="sm" onClick={() => updateProgress(goal.id, goal.current_value, goal.target_value)}>
                                                        Update Progress
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* Right: Create Goal Form */}
                    <div className="md:col-span-4">
                        <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl sticky top-6">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5 text-indigo-500"/> New Goal</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={submit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">Goal Title</Label>
                                        <Input value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Deadlift 100kg" required className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900" />
                                        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">Target Value (Numeric)</Label>
                                        <Input type="number" step="0.1" value={data.target_value} onChange={e => setData('target_value', e.target.value)} placeholder="100" required className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900" />
                                        {errors.target_value && <p className="text-xs text-red-500">{errors.target_value}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">Target Date</Label>
                                        <Input type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} required className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900" />
                                        {errors.deadline && <p className="text-xs text-red-500">{errors.deadline}</p>}
                                    </div>
                                    <Button type="submit" disabled={processing} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                        <Save className="mr-2 h-4 w-4" /> Save Goal
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
