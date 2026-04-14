import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Target, Activity, Dumbbell, Clock, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';

export default function ClientShow({ client, programs }: any) {
    const latestAssessment = client.assessments?.[0];
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);

    // Goal Form
    const { data: goalData, setData: setGoalData, post: postGoal, processing: goalProcessing, reset: resetGoal, errors: goalErrors } = useForm({
        title: '', type: 'numeric', target_value: '', current_value: '', unit: 'kg', direction: 'desc', deadline: ''
    });

    // Program Form
    const { data: progData, setData: setProgData, post: postProg, processing: progProcessing, reset: resetProg } = useForm({
        program_id: ''
    });

    const submitGoal = (e: React.FormEvent) => {
        e.preventDefault();
        postGoal(`/coach/clients/${client.id}/goals`, {
            onSuccess: () => { setIsGoalModalOpen(false); resetGoal(); toast.success('Goal assigned!'); }
        });
    };

    const submitProgram = (e: React.FormEvent) => {
        e.preventDefault();
        postProg(`/coach/clients/${client.id}/programs`, {
            onSuccess: () => { setIsProgramModalOpen(false); resetProg(); toast.success('Program assigned!'); }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Client Roster', href: '/coach/clients' }, { title: client.name, href: '#' }]}>
            <Head title={`${client.name} | 360° Profile`} />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-2xl">
                            {client.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{client.name}</h2>
                            <p className="text-slate-500 font-medium">{client.email}</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: Biometrics & Programs */}
                    <div className="space-y-8 lg:col-span-1">

                        {/* Biometrics Card */}
                        <Card className="rounded-3xl shadow-sm border-slate-200 dark:border-zinc-800">
                            <CardHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 font-bold">
                                    <Activity className="h-5 w-5 text-indigo-500" /> Latest Biometrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                {latestAssessment ? (
                                    <>
                                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                                            <span className="text-slate-500">Weight</span>
                                            <span className="font-extrabold">{latestAssessment.weight} kg</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                                            <span className="text-slate-500">Height</span>
                                            <span className="font-extrabold">{latestAssessment.height} cm</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                                            <span className="text-slate-500">Blood Pressure</span>
                                            <span className="font-extrabold">{latestAssessment.blood_pressure || 'N/A'}</span>
                                        </div>
                                        <div className="pt-2">
                                            <span className="text-slate-500 block mb-1 text-sm font-medium">AI Ideal Target</span>
                                            <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 w-full justify-center text-sm py-1.5 border-none font-bold">
                                                {latestAssessment.ideal_weight_ai} kg
                                            </Badge>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-slate-400 italic text-center py-4 font-medium">No assessments logged yet.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* 🔥 NEW: Assigned Programs Card */}
                        <Card className="rounded-3xl shadow-sm border-slate-200 dark:border-zinc-800">
                            <CardHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2 font-bold">
                                    <Dumbbell className="h-5 w-5 text-emerald-500" /> Programs
                                </CardTitle>

                                {/* Program Assign Modal */}
                                <Dialog open={isProgramModalOpen} onOpenChange={setIsProgramModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="h-8 rounded-lg text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                            <Plus className="h-4 w-4 mr-1" /> Assign
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[400px] rounded-3xl">
                                        <DialogHeader><DialogTitle>Assign Program</DialogTitle></DialogHeader>
                                        <form onSubmit={submitProgram} className="space-y-4 mt-4">
                                            <div>
                                                <Label>Select Workout Program</Label>
                                                <Select value={progData.program_id} onValueChange={v => setProgData('program_id', v)}>
                                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a program..." /></SelectTrigger>
                                                    <SelectContent>
                                                        {programs?.map((p: any) => (
                                                            <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button type="submit" disabled={progProcessing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                                                Save Assignment
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3">
                                {client.assigned_programs?.length > 0 ? (
                                    client.assigned_programs.map((prog: any) => (
                                        <div key={prog.id} className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                            <span className="font-bold text-emerald-900 dark:text-emerald-400 block text-sm">{prog.title}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 italic text-center py-4 font-medium">No active programs.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Goal Management */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-3xl shadow-sm border-slate-200 dark:border-zinc-800 h-full">
                            <CardHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2 font-bold">
                                    <Target className="h-5 w-5 text-purple-500" /> Active Goals
                                </CardTitle>

                                {/* Goal Creation Modal */}
                                <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm">
                                            <Plus className="h-4 w-4 mr-1" /> Assign Goal
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] rounded-3xl">
                                        <DialogHeader><DialogTitle className="text-2xl font-extrabold">Assign New Goal</DialogTitle></DialogHeader>
                                        <form onSubmit={submitGoal} className="space-y-5 mt-4">
                                            <div>
                                                <Label>Goal Title</Label>
                                                <Input value={goalData.title} onChange={e => setGoalData('title', e.target.value)} placeholder="e.g., Increase Bench Press" className="mt-1" required />
                                                {goalErrors.title && <p className="text-red-500 text-xs mt-1">{goalErrors.title}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Goal Type</Label>
                                                    <Select value={goalData.type} onValueChange={(val: any) => setGoalData('type', val)}>
                                                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="numeric">Numeric (Trackable)</SelectItem>
                                                            <SelectItem value="text">Qualitative (Behavioral)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Deadline</Label>
                                                    <Input type="date" value={goalData.deadline} onChange={e => setGoalData('deadline', e.target.value)} className="mt-1" required />
                                                </div>
                                            </div>

                                            {goalData.type === 'numeric' && (
                                                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Current Value</Label>
                                                            <Input type="number" step="0.1" value={goalData.current_value} onChange={e => setGoalData('current_value', e.target.value)} className="mt-1 bg-white" required />
                                                        </div>
                                                        <div>
                                                            <Label>Target Value</Label>
                                                            <Input type="number" step="0.1" value={goalData.target_value} onChange={e => setGoalData('target_value', e.target.value)} className="mt-1 bg-white" required />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Unit</Label>
                                                            <Select value={goalData.unit} onValueChange={val => setGoalData('unit', val)}>
                                                                <SelectTrigger className="mt-1 bg-white"><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                                                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                                                                    <SelectItem value="%">Percentage (%)</SelectItem>
                                                                    <SelectItem value="km">Kilometers (km)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label>Progression Direction</Label>
                                                            <Select value={goalData.direction} onValueChange={(val: any) => setGoalData('direction', val)}>
                                                                <SelectTrigger className="mt-1 bg-white"><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="asc">Ascending (e.g. Gain Muscle)</SelectItem>
                                                                    <SelectItem value="desc">Descending (e.g. Lose Weight)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <Button type="submit" disabled={goalProcessing} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11">
                                                Save & Assign Goal
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                {client.goals?.length > 0 ? (
                                    client.goals.map((goal: any) => (
                                        <div key={goal.id} className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 dark:text-white">{goal.title}</h4>
                                                {goal.type === 'numeric' && (
                                                    <Badge variant="outline" className="bg-white dark:bg-zinc-950 font-black text-purple-600 border-purple-200">
                                                        {goal.current_value} / {goal.target_value} {goal.unit}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 font-medium">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1">
                                                    {goal.status === 'active' ? <AlertCircle className="h-3 w-3 text-amber-500" /> : <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                                                    <span className="capitalize">{goal.status}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                                        <Target className="h-10 w-10 mb-2 opacity-20" />
                                        <p className="font-medium">No goals assigned yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
