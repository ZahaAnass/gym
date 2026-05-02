import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Target, TrendingUp, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useAppLanguage } from '@/hooks/use-app-language';
import { getPageTranslations } from '@/lang/pages';

export default function ProgressIndex({ assessments, chartData, goals, attendance_rate }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = getPageTranslations(language).clientProgress;

    // Safely calculate completion percentage for numeric goals
    const getProgressPercent = (goal: any) => {
        if (goal.type !== 'numeric' || goal.target_value === null || goal.target_value === undefined) return 0;

        const current = Number(goal.current_value ?? 0);
        const target = Number(goal.target_value);

        if (!Number.isFinite(target) || target <= 0) return 0;

        let percent = 0;
        if (goal.direction === 'asc') {
            percent = (current / target) * 100;
        } else {
            // For descending goals (e.g. weight loss): reached when current <= target.
            if (current <= target) {
                percent = 100;
            } else {
                percent = (target / current) * 100;
            }
        }
        return Math.min(Math.max(percent, 0), 100).toFixed(0);
    };

    return (
        <AppLayout breadcrumbs={[{ title: t.myProgress, href: '/client/progress' }]}>
            <Head title={t.head} />

            <div className="app-page-container" dir={isRTL ? 'rtl' : 'ltr'}>
                <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                    <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" /> {t.title}
                </h2>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-emerald-50 dark:bg-emerald-500/10 border-none shadow-sm rounded-3xl">
                        <CardContent className="p-6 flex flex-col gap-2">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t.currentWeight}</span>
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{assessments[0]?.weight || '--'} kg</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-50 dark:bg-emerald-500/10 border-none shadow-sm rounded-3xl">
                        <CardContent className="p-6 flex flex-col gap-2">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t.attendanceRate}</span>
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{attendance_rate}%</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-lime-50 dark:bg-lime-500/10 border-none shadow-sm rounded-3xl">
                        <CardContent className="p-6 flex flex-col gap-2">
                            <span className="text-sm font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider">{t.activeGoals}</span>
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{goals.filter((g:any) => g.status === 'active').length}</span>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Weight Tracking Chart */}
                    <Card className="shadow-sm rounded-3xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="h-5 w-5 text-emerald-500" /> {t.bioTrends}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px] p-6 pt-0">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#10b981" strokeWidth={3} fill="url(#colorWeight)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">{t.noAssessments}</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Dynamic Goals Tracker */}
                    <Card className="shadow-sm rounded-3xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Target className="h-5 w-5 text-lime-500" /> {t.coachGoals}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 overflow-y-auto max-h-[350px] pr-2">
                            {goals.length === 0 && <p className="text-slate-500 italic">{t.noCoachGoals}</p>}

                            {goals.map((goal: any) => (
                                <div key={goal.id} className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {goal.title}
                                                {goal.status === 'reached' && <Badge className="bg-emerald-500 text-white border-none">{t.achieved}</Badge>}
                                            </h4>
                                            {goal.deadline && <p className="text-xs text-slate-500 mt-1">{t.targetDate}: {new Date(goal.deadline).toLocaleDateString()}</p>}
                                        </div>
                                        {goal.type === 'numeric' && (
                                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                                {goal.current_value} / {goal.target_value} {goal.unit}
                                            </span>
                                        )}
                                    </div>

                                    {goal.type === 'numeric' ? (
                                        <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className={`h-2.5 rounded-full transition-all duration-1000 ${goal.status === 'reached' ? 'bg-emerald-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${getProgressPercent(goal)}%` }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-xl">
                                            <CheckCircle2 className="h-4 w-4" /> {t.qualitative}
                                        </div>
                                    )}

                                    {goal.ai_strategy_advice && (
                                        <div className="mt-3 p-3 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-500/10 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            <strong className="text-emerald-600 dark:text-emerald-400 block mb-1">{t.aiStrategy}</strong>
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
