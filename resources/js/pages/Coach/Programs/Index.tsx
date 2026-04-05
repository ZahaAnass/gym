import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Bot, Dumbbell, Save, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Workout Programs', href: '/coach/programs' },
];

export default function ProgramsIndex({ programs }: any) {
    const { flash } = usePage().props as any;
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');

    const { data, setData, post, processing, reset } = useForm({
        title: '',
        description: '',
        is_ai_generated: false,
    });

    useEffect(() => {
        if (flash?.success) {
toast.success(flash.success);
}
    }, [flash]);

    // Handle the AI Generation request using Axios
    const handleAIGeneration = async () => {
        if (!aiPrompt) {
return toast.error('Please enter client requirements first.');
}

        setIsGenerating(true);

        try {
            const response = await axios.post('/coach/programs/generate-ai', { notes: aiPrompt });

            if (response.data && response.data.title) {
                setData({
                    title: response.data.title,
                    description: response.data.description,
                    is_ai_generated: true
                });
                toast.success('AI successfully generated the program!');
            } else {
                toast.error('AI response was invalid. Please try again.');
            }
        } catch (error) {
            toast.error('Failed to communicate with Gemini AI.');
        } finally {
            setIsGenerating(false);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/coach/programs', {
            onSuccess: () => {
                reset();
                setAiPrompt('');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workout Programs | Coach" />

            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto grid md:grid-cols-12 gap-6">

                {/* Left Column: List of Programs */}
                <div className="md:col-span-7 space-y-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <Dumbbell className="h-8 w-8 text-primary" />
                            My Workout Library
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Manage and assign training programs to your clients.</p>
                    </div>

                    <div className="grid gap-4 mt-6">
                        {programs.length === 0 ? (
                            <Card className="bg-muted/10 border-dashed shadow-none">
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    No programs created yet. Use the AI generator to get started!
                                </CardContent>
                            </Card>
                        ) : (
                            programs.map((program: any) => (
                                <Card key={program.id} className="shadow-sm">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">{program.title}</CardTitle>
                                            {program.is_ai_generated && (
                                                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                    <Sparkles className="h-3 w-3 mr-1" /> AI Generated
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{program.description}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: AI Generator & Form */}
                <div className="md:col-span-5">
                    <Card className="shadow-md border-purple-200 dark:border-purple-900 sticky top-6">
                        <CardHeader className="bg-purple-50/50 dark:bg-purple-900/10 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="h-5 w-5 text-purple-600" />
                                Gemini Program Builder
                            </CardTitle>
                            <CardDescription>Describe the client's goal, and AI will write the program.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">

                            <div className="space-y-2">
                                <Label>Client Requirements (Prompt)</Label>
                                <Textarea
                                    placeholder="e.g. 4-week strength program for a beginner with bad knees..."
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    rows={3}
                                />
                                <Button
                                    type="button"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={handleAIGeneration}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? 'Gemini is thinking...' : <><Sparkles className="mr-2 h-4 w-4" /> Generate with AI</>}
                                </Button>
                            </div>

                            <form onSubmit={submit} className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Program Title</Label>
                                    <Input value={data.title} onChange={e => setData('title', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Workout Details</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={6}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={processing} className="w-full">
                                    <Save className="mr-2 h-4 w-4" /> Save Program
                                </Button>
                            </form>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
