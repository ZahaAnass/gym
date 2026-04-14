import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Target, TrendingUp, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

export default function ProgressIndex({ assessments, chartData, goals, attendance_rate }: any) {

    // Safely calculate completion percentage for numeric goals
    const getProgressPercent = (goal: any) => {
        if (goal.type !== 'numeric' || !goal.target_value || !goal.current_value) return 0;

        let percent = 0;
        if (goal.direction === 'asc') {
            // E.g., Bench press from 50kg to 100kg
            percent = (goal.current_value / goal.target_value) * 100;
        } else {
            // E.g., Weight loss from 100kg to 80kg
            const start = goal.current_value + (goal.current_value - goal.target_value); // Rough starting estimate for the bar
            percent = ((start - goal.current_value) / (start - goal.target_value)) * 100;
        }
        return Math.min(Math.max(percent, 0), 100).toFixed(0);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'My Progress', href: '/client/progress' }]}>
            <Head title="Progress Analytics" />

            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
                <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                    <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" /> My Analytics Dashboard
                </h2>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-indigo-50 dark:bg-indigo-500/10 border-none shadow-sm rounded-3xl">
                        <CardContent className="p-6 flex flex-col gap-2">
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Current Weight</span>
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{assessments[0]?.weight || '--'} kg</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-50 dark:bg-emerald-500/10 border-none shadow-sm rounded-3xl">
                        <CardContent className="p-6 flex flex-col gap-2">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Attendance Rate</span>
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{attendance_rate}%</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-50 dark:bg-purple-500/10 border-none shadow-sm rounded-3xl">
                        <CardContent className="p-6 flex flex-col gap-2">
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Active Goals</span>
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{goals.filter((g:any) => g.status === 'active').length}</span>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Weight Tracking Chart */}
                    <Card className="shadow-sm rounded-3xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="h-5 w-5 text-indigo-500" /> Biometric Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px] p-6 pt-0">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#4f46e5" strokeWidth={3} fill="url(#colorWeight)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">No assessment data available yet.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Dynamic Goals Tracker */}
                    <Card className="shadow-sm rounded-3xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Target className="h-5 w-5 text-purple-500" /> Coach-Assigned Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 overflow-y-auto max-h-[350px] pr-2">
                            {goals.length === 0 && <p className="text-slate-500 italic">Your coach has not assigned any goals yet.</p>}

                            {goals.map((goal: any) => (
                                <div key={goal.id} className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {goal.title}
                                                {goal.status === 'reached' && <Badge className="bg-emerald-500 text-white border-none">Achieved</Badge>}
                                            </h4>
                                            {goal.deadline && <p className="text-xs text-slate-500 mt-1">Target Date: {new Date(goal.deadline).toLocaleDateString()}</p>}
                                        </div>
                                        {goal.type === 'numeric' && (
                                            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                                                {goal.current_value} / {goal.target_value} {goal.unit}
                                            </span>
                                        )}
                                    </div>

                                    {goal.type === 'numeric' ? (
                                        <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className={`h-2.5 rounded-full transition-all duration-1000 ${goal.status === 'reached' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                style={{ width: `${getProgressPercent(goal)}%` }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-xl">
                                            <CheckCircle2 className="h-4 w-4" /> Qualitative Goal (Behavioral)
                                        </div>
                                    )}

                                    {goal.ai_strategy_advice && (
                                        <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-xl border border-indigo-100 dark:border-indigo-500/10 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">AI Strategy:</strong>
                                            {goal.ai_strategy_advice}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
