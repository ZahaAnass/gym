import React, { useEffect, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import {
    Dumbbell, Search, Sparkles, Bot, Plus, Trash2, Save, Activity, LayoutList
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

export default function ProgramsIndex({ programs, filters, stats }: any) {
    const { flash } = usePage().props as any;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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

            // Auto-fill the manual form with the AI's response
            setForm({
                title: response.data.title,
                description: response.data.description,
                is_ai_generated: true
            });

            toast.success("AI Generation complete! You can now review and edit.");
            setActiveTab('manual'); // Switch to the edit/save tab
        } catch (error) {
            toast.error("Failed to generate program. The AI might be overloaded.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Save the finalized program
    const handleSaveProgram = (e: React.FormEvent) => {
        e.preventDefault();
        post('/coach/programs', {
            onSuccess: () => {
                setIsDialogOpen(false);
                resetForm();
                setAiParams({ goal: '', level: '', days: '3', equipment: '', notes: '' });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Workout Programs', href: '/coach/programs' }]}>
            <Head title="Program Library | Coach" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Dumbbell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            Program Library
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Manage your workout templates and generate new ones via Gemini AI.</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 h-11 rounded-xl px-6">
                                <Sparkles className="mr-2 h-4 w-4" /> Create Program
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl">
                                    <LayoutList className="h-5 w-5 text-indigo-500"/> Program Builder
                                </DialogTitle>
                            </DialogHeader>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="ai" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30">
                                        <Bot className="mr-2 h-4 w-4" /> Gemini AI Generator
                                    </TabsTrigger>
                                    <TabsTrigger value="manual">
                                        <Dumbbell className="mr-2 h-4 w-4" /> Manual Editor
                                    </TabsTrigger>
                                </TabsList>

                                {/* AI GENERATOR TAB */}
                                <TabsContent value="ai" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Primary Goal</Label>
                                            <Input placeholder="e.g. Hypertrophy, Fat Loss" value={aiParams.goal} onChange={e => setAiParams({...aiParams, goal: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Client Level</Label>
                                            <Select value={aiParams.level} onValueChange={v => setAiParams({...aiParams, level: v})}>
                                                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Available Equipment</Label>
                                            <Input placeholder="e.g. Full Gym, Dumbbells only, Bodyweight" value={aiParams.equipment} onChange={e => setAiParams({...aiParams, equipment: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Days per Week</Label>
                                            <Select value={aiParams.days} onValueChange={v => setAiParams({...aiParams, days: v})}>
                                                <SelectTrigger><SelectValue placeholder="3 Days" /></SelectTrigger>
                                                <SelectContent>
                                                    {[2,3,4,5,6].map(d => <SelectItem key={d} value={d.toString()}>{d} Days</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Medical Notes / Injuries (Optional)</Label>
                                        <Input placeholder="e.g. Bad lower back, avoid heavy deadlifts" value={aiParams.notes} onChange={e => setAiParams({...aiParams, notes: e.target.value})} />
                                    </div>
                                    <Button onClick={handleGenerateAI} disabled={isGenerating} className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4 h-11">
                                        {isGenerating ? 'Analyzing Biomechanics...' : <><Sparkles className="mr-2 h-4 w-4"/> Generate Program with AI</>}
                                    </Button>
                                </TabsContent>

                                {/* MANUAL EDITOR TAB */}
                                <TabsContent value="manual">
                                    <form onSubmit={handleSaveProgram} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Program Title</Label>
                                            <Input required value={form.title} onChange={e => setForm('title', e.target.value)} placeholder="e.g. 4-Week Hypertrophy Split" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex justify-between">
                                                Program Details
                                                {form.is_ai_generated && <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 border-none"><Bot className="h-3 w-3 mr-1"/> AI Drafted</Badge>}
                                            </Label>
                                            <Textarea required value={form.description} onChange={e => setForm('description', e.target.value)} rows={12} className="font-mono text-sm leading-relaxed whitespace-pre-wrap" />
                                        </div>
                                        <Button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 mt-4">
                                            <Save className="mr-2 h-4 w-4" /> Save to Library
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-white dark:bg-zinc-950 border-slate-200 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-slate-500">Total Programs</span>
                            <span className="text-3xl font-extrabold mt-1">{stats.total}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-50/50 border-purple-100 shadow-sm rounded-2xl dark:bg-purple-900/10 dark:border-purple-900/30">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">AI Generated</span>
                            <span className="text-3xl font-extrabold text-purple-700 mt-1">{stats.ai_generated}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-50/50 border-slate-100 shadow-sm rounded-2xl dark:bg-zinc-900 dark:border-zinc-800">
                        <CardContent className="p-5 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-slate-600">Manually Written</span>
                            <span className="text-3xl font-extrabold text-slate-700 mt-1">{stats.manual}</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Search & Grid */}
                <div className="relative w-full md:w-96">
                    <Input defaultValue={filters?.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="pl-10 bg-white rounded-xl h-11" placeholder="Search library..." />
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.data.map((prog: any) => (
                        <Card key={prog.id} className="shadow-sm border-slate-200 rounded-2xl flex flex-col h-full bg-white dark:bg-zinc-950">
                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg leading-tight">{prog.title}</CardTitle>
                                    {prog.is_ai_generated && <Badge className="bg-purple-100 text-purple-700 border-none shrink-0 ml-2"><Bot className="h-3 w-3 mr-1"/> AI</Badge>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Created {new Date(prog.created_at).toLocaleDateString()}</p>
                            </CardHeader>
                            <CardContent className="p-5 flex-1">
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 whitespace-pre-wrap">{prog.description}</p>
                            </CardContent>
                            <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(prog.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-6"><InertiaPagination data={programs} /></div>
            </div>
        </AppLayout>
    );
}
