import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    Bot,
    HeartPulse,
    Ruler,
    Weight,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

export default function CreateAssessment({ client, history }: any) {
    const { flash } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Clients', href: '/coach/clients' },
        { title: `AI Assessment: ${client.name}`, href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        client_id: client.id,
        height: '',
        weight: '',
        blood_pressure: '',
        allergies: '',
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/coach/assessments');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`AI Assessment - ${client.name}`} />

            <div className="p-6 space-y-6 w-full max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <Bot className="h-8 w-8 text-purple-600 dark:text-purple-500" />
                            Gemini AI Bilan Physique
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Running health analysis for <span className="font-semibold text-foreground">{client.name}</span>
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/coach/clients">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roster
                        </Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    {/* Form Section */}
                    <div className="md:col-span-2">
                        <form onSubmit={submit}>
                            <Card className="shadow-sm border-purple-100 dark:border-purple-900/50">
                                <CardHeader className="bg-purple-50/50 dark:bg-purple-900/10 border-b border-border">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-purple-600" />
                                        Current Biometrics
                                    </CardTitle>
                                    <CardDescription>
                                        Enter the client's current data. The AI will calculate BMI and ideal weight.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6 pt-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Height */}
                                        <div className="space-y-2">
                                            <Label htmlFor="height" className="flex items-center gap-2">
                                                <Ruler className="h-4 w-4 text-muted-foreground" /> Height (cm) <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                step="0.1"
                                                value={data.height}
                                                onChange={(e) => setData('height', e.target.value)}
                                                placeholder="180"
                                                required
                                            />
                                            {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
                                        </div>

                                        {/* Weight */}
                                        <div className="space-y-2">
                                            <Label htmlFor="weight" className="flex items-center gap-2">
                                                <Weight className="h-4 w-4 text-muted-foreground" /> Weight (kg) <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="weight"
                                                type="number"
                                                step="0.1"
                                                value={data.weight}
                                                onChange={(e) => setData('weight', e.target.value)}
                                                placeholder="75.5"
                                                required
                                            />
                                            {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
                                        </div>
                                    </div>

                                    {/* Blood Pressure */}
                                    <div className="space-y-2">
                                        <Label htmlFor="blood_pressure" className="flex items-center gap-2">
                                            <HeartPulse className="h-4 w-4 text-red-500" /> Blood Pressure (Optional)
                                        </Label>
                                        <Input
                                            id="blood_pressure"
                                            type="text"
                                            value={data.blood_pressure}
                                            onChange={(e) => setData('blood_pressure', e.target.value)}
                                            placeholder="e.g., 120/80"
                                        />
                                    </div>

                                    {/* Allergies / Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="allergies" className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-amber-500" /> Medical Notes / Allergies
                                        </Label>
                                        <Textarea
                                            id="allergies"
                                            value={data.allergies}
                                            onChange={(e) => setData('allergies', e.target.value)}
                                            placeholder="Any injuries, allergies, or dietary restrictions..."
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-muted/10 border-t border-border px-6 py-4 justify-end">
                                    <Button type="submit" disabled={processing} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[160px]">
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                AI Analyzing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <Bot className="mr-2 h-4 w-4" /> Generate Analysis
                                            </span>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </div>

                    {/* Right Column: History Sidebar */}
                    <div className="md:col-span-1 space-y-4">
                        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
                            <CardHeader className="p-4 border-b border-border bg-muted/10">
                                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Recent History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                {history.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No previous assessments found.</p>
                                ) : (
                                    history.map((record: any) => (
                                        <div key={record.id} className="flex flex-col gap-1 pb-4 border-b border-border last:border-0 last:pb-0">
                                            <div className="flex justify-between items-center text-sm font-medium">
                                                <span>{new Date(record.created_at).toLocaleDateString()}</span>
                                                <span className="text-purple-600 dark:text-purple-400">{record.weight} kg</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                AI Ideal Weight Target: <strong className="text-foreground">{record.ideal_weight_ai ? `${record.ideal_weight_ai} kg` : 'N/A'}</strong>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
