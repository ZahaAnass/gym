import { Head, Link, useForm } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Brain,
    CheckCircle2,
    ChevronDown,
    CreditCard,
    Dumbbell,
    Mail,
    Menu,
    MessageSquare,
    Moon,
    Sparkles,
    Sun,
    TrendingUp,
    Users,
    X,
    Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

/* ─── Animated counter hook ─────────────────────────────── */
function useCounter(target: number, duration = 1800) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                let start = 0;
                const step = target / (duration / 16);
                const tick = () => {
                    start = Math.min(start + step, target);
                    setCount(Math.round(start));
                    if (start < target) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            },
            { threshold: 0.3 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);
    return { count, ref };
}

/* ─── Stat Card ──────────────────────────────────────────── */
function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
    const { count, ref } = useCounter(value);
    return (
        <div
            ref={ref}
            className="flex flex-col items-center gap-1 px-8 py-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800"
        >
            <span className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {count.toLocaleString()}
                {suffix}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium text-center">{label}</span>
        </div>
    );
}

/* ─── Feature Card ───────────────────────────────────────── */
function FeatureCard({
                         icon,
                         color,
                         title,
                         description,
                     }: {
    icon: React.ReactNode;
    color: string;
    title: string;
    description: string;
}) {
    return (
        <div className="group bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col gap-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
            <div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

/* ─── Testimonial Card ───────────────────────────────────── */
function TestimonialCard({
                             quote,
                             name,
                             role,
                             initials,
                             color,
                         }: {
    quote: string;
    name: string;
    role: string;
    initials: string;
    color: string;
}) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-7 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col gap-5">
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">"{quote}"</p>
            <div className="flex items-center gap-3 mt-auto">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${color}`}
                >
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-bold">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                </div>
            </div>
        </div>
    );
}

/* ─── Pricing Card ───────────────────────────────────────── */
function PricingCard({
                         plan,
                         price,
                         period,
                         description,
                         features,
                         cta,
                         highlighted,
                         canRegister,
                     }: {
    plan: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
    canRegister: boolean;
}) {
    return (
        <div
            className={`relative flex flex-col rounded-2xl p-8 gap-6 transition-all duration-300 ${
                highlighted
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xl shadow-gray-900/20 scale-105'
                    : 'bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:shadow-lg'
            }`}
        >
            {highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/30">
                        Most Popular
                    </span>
                </div>
            )}
            <div>
                <p
                    className={`text-xs font-bold uppercase tracking-widest mb-3 ${highlighted ? 'text-indigo-400 dark:text-indigo-500' : 'text-indigo-600 dark:text-indigo-400'}`}
                >
                    {plan}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold">{price}</span>
                    <span
                        className={`text-sm ${highlighted ? 'text-gray-400 dark:text-gray-500' : 'text-slate-400'}`}
                    >
                        {period}
                    </span>
                </div>
                <p className={`text-sm ${highlighted ? 'text-gray-400 dark:text-gray-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {description}
                </p>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
                {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${highlighted ? 'text-indigo-400 dark:text-indigo-500' : 'text-indigo-500 dark:text-indigo-400'}`}
                        />
                        <span className={highlighted ? 'text-gray-300 dark:text-gray-600' : 'text-slate-600 dark:text-slate-300'}>
                            {f}
                        </span>
                    </li>
                ))}
            </ul>
            {canRegister && (
                <Link
                    href="/register"
                    className={`w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all ${
                        highlighted
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/30'
                            : 'border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                >
                    {cta}
                </Link>
            )}
        </div>
    );
}

/* ─── FAQ Item ───────────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-slate-100 dark:border-zinc-800 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
                <span className="font-semibold text-sm">{q}</span>
                <ChevronDown
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {a}
                </div>
            )}
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function Welcome({ auth, canRegister }: any) {
    const [isDark, setIsDark] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeRole, setActiveRole] = useState<'admin' | 'coach' | 'client'>('coach');

    const { data, setData, processing, reset } = useForm({ name: '', email: '', message: '' });

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Message sent! Our team will contact you shortly.');
        reset();
    };

    useEffect(() => {
        const dark =
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDark(dark);
        document.documentElement.classList.toggle('dark', dark);
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.theme = next ? 'dark' : 'light';
    };

    const roles = {
        admin: {
            label: 'Administrator',
            color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10',
            features: [
                'Full user management & RBAC',
                'Revenue analytics & reporting',
                'System audit logs',
                'Public content management',
                'Stripe payment oversight',
            ],
        },
        coach: {
            label: 'Coach',
            color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10',
            features: [
                'Manage client rosters',
                'AI workout program generation',
                'Biometric assessment tools',
                'Session notes & scheduling',
                'Client progress tracking',
            ],
        },
        client: {
            label: 'Client',
            color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
            features: [
                'View assigned programs',
                'Log physical progress',
                'Manage personal goals',
                'Secure installment payments',
                'Chat with your coach',
            ],
        },
    };

    const navLinks = [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'Roles' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#faq', label: 'FAQ' },
        { href: '#contact', label: 'Contact' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
            <Head title="AI Gym — Intelligent Fitness Management" />

            {/* ── Navigation ─────────────────────────────── */}
            <nav className="fixed w-full z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-xl">
                                <Dumbbell className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                AI GYM
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-500 dark:text-slate-400"
                            >
                                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href="/register"
                                            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-500/25"
                                        >
                                            Get started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="md:hidden flex items-center gap-2">
                            <button onClick={toggleTheme} className="p-2 text-slate-500">
                                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-slate-500"
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-1">
                        {navLinks.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900"
                            >
                                {l.label}
                            </a>
                        ))}
                        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-2">
                            {auth.user ? (
                                <Link href="/dashboard" className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-lg">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="w-full text-center px-4 py-3 text-sm font-bold border border-slate-200 dark:border-zinc-800 rounded-lg">
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link href="/register" className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-lg">
                                            Get started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Hero ───────────────────────────────────── */}
            <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl rounded-full" />
                    <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/5 blur-3xl rounded-full" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100 dark:border-indigo-500/20">
                        <Sparkles className="h-3.5 w-3.5" />
                        Powered by Gemini 2.5 Flash
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-7">
                        The Future of Fitness
                        <br />
                        is{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            Intelligent.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                        Generate custom workouts, analyze biometrics instantly, and track every client's progress — all powered by AI, all in one platform.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                            >
                                Access Portal <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                                >
                                    Start free <ArrowRight className="h-4 w-4" />
                                </Link>
                                <a
                                    href="#features"
                                    className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-all flex items-center justify-center"
                                >
                                    Explore features
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Stats bar ──────────────────────────────── */}
            <section className="py-6 border-y border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard value={1200} suffix="+" label="Active members" />
                        <StatCard value={48} suffix="k" label="Workouts generated" />
                        <StatCard value={98} suffix="%" label="Client satisfaction" />
                        <StatCard value={3} suffix="x" label="Faster onboarding" />
                    </div>
                </div>
            </section>

            {/* ── Features ───────────────────────────────── */}
            <section id="features" className="py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Platform features</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                            Built for coaches. Designed for athletes.
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Everything you need to manage your gym, improve client health outcomes, and process payments with confidence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <FeatureCard
                            icon={<Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                            color="bg-purple-50 dark:bg-purple-500/10"
                            title="AI Workout Generation"
                            description="Instantly generate tailored 4-week programs based on client goals, fitness level, and medical constraints — powered by Gemini."
                        />
                        <FeatureCard
                            icon={<Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                            color="bg-emerald-50 dark:bg-emerald-500/10"
                            title="Smart Biometric Analysis"
                            description="Enter physical stats and get ideal weight targets, BMI insights, and personalised nutritional strategy from Gemini AI."
                        />
                        <FeatureCard
                            icon={<CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                            color="bg-blue-50 dark:bg-blue-500/10"
                            title="Flexible Split Payments"
                            description="Stripe-native integration. Clients pay in full or split memberships over 3 months — zero friction, zero extra setup."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                            color="bg-amber-50 dark:bg-amber-500/10"
                            title="Progress Tracking"
                            description="Visual progress dashboards for coaches and clients. Track weight, reps, and goals over time with clear charts."
                        />
                        <FeatureCard
                            icon={<Users className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
                            color="bg-rose-50 dark:bg-rose-500/10"
                            title="Role-Based Access"
                            description="Granular RBAC ensures admins, coaches, and clients only see what they need. Secure by design, not by accident."
                        />
                        <FeatureCard
                            icon={<Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                            color="bg-indigo-50 dark:bg-indigo-500/10"
                            title="Session Notes & Scheduling"
                            description="Coaches log session notes, flag health concerns, and schedule upcoming appointments — all from one unified view."
                        />
                    </div>
                </div>
            </section>

            {/* ── Role Switcher ───────────────────────────── */}
            <section id="how-it-works" className="py-28 bg-slate-50 dark:bg-zinc-900/40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">How it works</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">A dedicated portal for every role</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Switch between roles to see exactly what each user experiences on the platform.
                        </p>
                    </div>

                    {/* Role tabs */}
                    <div className="flex justify-center gap-2 mb-12">
                        {(Object.keys(roles) as Array<keyof typeof roles>).map((role) => (
                            <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    activeRole === role
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-zinc-800'
                                }`}
                            >
                                {roles[role].label}
                            </button>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Feature list */}
                        <div className="flex flex-col gap-4">
                            {roles[activeRole].features.map((f, i) => (
                                <div
                                    key={f}
                                    className="flex items-start gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">{f}</p>
                                </div>
                            ))}
                        </div>

                        {/* UI Mockup */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl transform rotate-2 opacity-10 dark:opacity-20 blur-xl" />
                            <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-2">
                                <div className="bg-zinc-950 rounded-2xl h-[420px] w-full p-6 flex flex-col gap-5 overflow-hidden">
                                    {/* Top bar */}
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                                                <Dumbbell className="h-3.5 w-3.5 text-indigo-400" />
                                            </div>
                                            <div className="w-20 h-3 bg-zinc-800 rounded-md" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-3 bg-zinc-800 rounded-md" />
                                            <div className="w-7 h-7 rounded-full bg-zinc-800" />
                                        </div>
                                    </div>
                                    {/* Role badge */}
                                    <div className={`self-start px-3 py-1 rounded-full text-xs font-bold ${roles[activeRole].color}`}>
                                        {roles[activeRole].label} Portal
                                    </div>
                                    {/* Stat row */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-16 bg-zinc-800/60 rounded-xl border border-zinc-800 flex flex-col items-center justify-center gap-1.5">
                                                <div className="w-10 h-2.5 bg-zinc-700 rounded" />
                                                <div className="w-6 h-2 bg-zinc-800 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                    {/* AI panel */}
                                    <div className="flex-1 bg-gradient-to-br from-indigo-600/15 to-purple-600/15 rounded-xl border border-indigo-500/20 flex flex-col items-center justify-center gap-3 p-5">
                                        <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
                                        <div className="w-32 h-2.5 bg-indigo-400/20 rounded" />
                                        <div className="w-24 h-2 bg-indigo-400/10 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing ─────────────────────────────────── */}
            <section id="pricing" className="py-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-xl mx-auto">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Pricing</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Simple, transparent plans</h2>
                        <p className="text-slate-500 dark:text-slate-400">Start free. Upgrade when your gym grows.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 items-center">
                        <PricingCard
                            plan="Starter"
                            price="Free"
                            period="forever"
                            description="For solo coaches just getting started."
                            features={['Up to 5 clients', 'AI workout generator (10/mo)', 'Basic biometrics', 'Email support']}
                            cta="Get started free"
                            canRegister={canRegister}
                        />
                        <PricingCard
                            plan="Pro"
                            price="$29"
                            period="/ month"
                            description="For growing gyms and serious coaches."
                            features={['Unlimited clients', 'Unlimited AI generation', 'Stripe split payments', 'Advanced analytics', 'Priority support']}
                            cta="Start Pro trial"
                            highlighted
                            canRegister={canRegister}
                        />
                        <PricingCard
                            plan="Enterprise"
                            price="$79"
                            period="/ month"
                            description="For multi-location gym chains."
                            features={['Multi-location support', 'Custom branding', 'API access', 'Dedicated account manager', 'SLA guarantee']}
                            cta="Contact sales"
                            canRegister={canRegister}
                        />
                    </div>
                </div>
            </section>

            {/* ── Testimonials ────────────────────────────── */}
            <section className="py-28 bg-slate-50 dark:bg-zinc-900/40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Testimonials</p>
                        <h2 className="text-3xl font-extrabold tracking-tight">Loved by coaches & athletes</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        <TestimonialCard
                            quote="The AI program generator saved me hours every week. My clients are getting better results than ever and the programs feel genuinely personalised."
                            name="Sarah M."
                            role="Personal Trainer, Casablanca"
                            initials="SM"
                            color="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                        />
                        <TestimonialCard
                            quote="The split payment feature was a game-changer. Membership sign-ups increased by 40% in the first month after we enabled it."
                            name="Karim B."
                            role="Gym Owner, Marrakech"
                            initials="KB"
                            color="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                        />
                        <TestimonialCard
                            quote="I can finally see my workout history, goals, and progress all in one place. The biometric analysis actually helped me understand my body better."
                            name="Ines T."
                            role="Fitness Enthusiast"
                            initials="IT"
                            color="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        />
                    </div>
                </div>
            </section>

            {/* ── FAQ ─────────────────────────────────────── */}
            <section id="faq" className="py-28">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">FAQ</p>
                        <h2 className="text-3xl font-extrabold tracking-tight">Common questions</h2>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 px-8 py-2">
                        <FAQItem
                            q="How does the AI workout generator work?"
                            a="Coaches fill in a client profile — goal, fitness level, available equipment, and any injuries or medical constraints. Gemini 2.5 Flash then generates a structured 4-week program with exercises, sets, reps, and rest periods in seconds."
                        />
                        <FAQItem
                            q="Is my data secure?"
                            a="Yes. All data is encrypted in transit and at rest. Payment data never touches our servers — it's handled entirely by Stripe. Role-based access control ensures each user only sees data relevant to them."
                        />
                        <FAQItem
                            q="Can I try it before committing?"
                            a="Absolutely. The Starter plan is free forever with no credit card required. You get access to AI generation (10 programs/month) and up to 5 client profiles to test the platform fully."
                        />
                        <FAQItem
                            q="How does split payment work for clients?"
                            a="Clients can choose to pay their membership fee in 3 monthly instalments via Stripe. The gym receives the full amount, and Stripe handles the scheduled billing. No manual follow-up needed."
                        />
                        <FAQItem
                            q="Can I use this for multiple gym locations?"
                            a="Yes — the Enterprise plan supports multi-location management with separate dashboards, staff rosters, and analytics per location, all under one account."
                        />
                    </div>
                </div>
            </section>

            {/* ── Contact ─────────────────────────────────── */}
            <section id="contact" className="py-28 bg-slate-50 dark:bg-zinc-900/40">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-950 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-zinc-800">
                        <div className="text-center mb-10">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-extrabold mb-2">Get in touch</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Questions about memberships, pricing, or a custom demo? We'll reply within 24 hours.
                            </p>
                        </div>

                        <form onSubmit={handleContactSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full name</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Sarah Martin"
                                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="sarah@mygym.com"
                                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Tell us about your gym and what you're looking for…"
                                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 text-sm"
                            >
                                <Mail className="h-4 w-4" /> Send message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────── */}
            <footer className="border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-1.5 rounded-lg">
                                <Dumbbell className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-extrabold text-base tracking-tight">AI GYM</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                            {navLinks.map((l) => (
                                <a key={l.href} href={l.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    {l.label}
                                </a>
                            ))}
                        </div>

                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                            © {new Date().getFullYear()} AI Gym. Built for academic presentation.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
