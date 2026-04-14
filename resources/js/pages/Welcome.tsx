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
    BellRing,
    Play,
    Shield,
    Timer,
    BarChart3,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

function useCounter(target: number, duration = 2000) {
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

function StatCard({ value, suffix, label, icon }: { value: number; suffix: string; label: string; icon: React.ReactNode }) {
    const { count, ref } = useCounter(value);
    return (
        <div ref={ref} className="stat-card">
            <div className="stat-icon">{icon}</div>
            <span className="stat-value">{count.toLocaleString()}{suffix}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
}

function FeatureCard({ icon, accent, title, description }: {
    icon: React.ReactNode; accent: string; title: string; description: string;
}) {
    return (
        <div className="feature-card">
            <div className={`feature-icon-wrap ${accent}`}>{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{description}</p>
            <div className="feature-arrow"><ArrowRight size={16} /></div>
        </div>
    );
}

function TestimonialCard({ quote, name, role, initials, accent }: {
    quote: string; name: string; role: string; initials: string; accent: string;
}) {
    return (
        <div className="testimonial-card">
            <div className="stars">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="star" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <p className="testimonial-quote">"{quote}"</p>
            <div className="testimonial-author">
                <div className={`author-avatar ${accent}`}>{initials}</div>
                <div>
                    <p className="author-name">{name}</p>
                    <p className="author-role">{role}</p>
                </div>
            </div>
        </div>
    );
}

function PricingCard({ plan, price, period, description, features, cta, highlighted, canRegister }: {
    plan: string; price: string; period: string; description: string;
    features: string[]; cta: string; highlighted?: boolean; canRegister: boolean;
}) {
    return (
        <div className={`pricing-card ${highlighted ? 'pricing-card--featured' : ''}`}>
            {highlighted && <div className="pricing-badge">Most Popular</div>}
            <p className="pricing-plan">{plan}</p>
            <div className="pricing-price-row">
                <span className="pricing-price">{price}</span>
                <span className="pricing-period">{period}</span>
            </div>
            <p className="pricing-desc">{description}</p>
            <ul className="pricing-features">
                {features.map((f) => (
                    <li key={f}>
                        <CheckCircle2 size={16} className="pricing-check" />
                        <span>{f}</span>
                    </li>
                ))}
            </ul>
            {canRegister && (
                <Link href="/register" className={`pricing-cta ${highlighted ? 'pricing-cta--featured' : ''}`}>
                    {cta} <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
            <button onClick={() => setOpen(!open)} className="faq-question">
                <span>{q}</span>
                <ChevronDown size={20} className={`faq-chevron ${open ? 'rotate' : ''}`} />
            </button>
            <div className={`faq-answer ${open ? 'faq-answer--open' : ''}`}>
                <p>{a}</p>
            </div>
        </div>
    );
}

function HeroImageGrid() {
    return (
        <div className="hero-image-grid">
            <div className="hero-img hero-img--main">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop" alt="Gym training" loading="lazy" />
                <div className="img-overlay" />
                <div className="img-badge img-badge--pulse">
                    <span className="badge-dot" />
                    <span>Live Sessions</span>
                </div>
            </div>
            <div className="hero-img-stack">
                <div className="hero-img hero-img--sm">
                    <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop" alt="Coach training client" loading="lazy" />
                    <div className="img-overlay" />
                </div>
                <div className="hero-img hero-img--sm hero-img--accent">
                    <img src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80&auto=format&fit=crop" alt="Athlete performance" loading="lazy" />
                    <div className="img-overlay" />
                    <div className="img-stat-card">
                        <TrendingUp size={14} className="img-stat-icon" />
                        <div>
                            <p className="img-stat-val">+40%</p>
                            <p className="img-stat-lbl">Performance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Welcome({ auth, canRegister, content }: any) {
    const [isDark, setIsDark] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeRole, setActiveRole] = useState<'admin' | 'coach' | 'client'>('coach');
    const [scrolled, setScrolled] = useState(false);

    const { data, setData, processing, reset } = useForm({ name: '', email: '', message: '' });

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Message sent! Our team will contact you shortly.');
        reset();
    };

    useEffect(() => {
        const dark = localStorage.theme !== 'light';
        setIsDark(dark);
        document.documentElement.classList.toggle('dark', dark);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.theme = next ? 'dark' : 'light';
    };

    const roles = {
        admin: {
            label: 'Administrator', emoji: '⚙️',
            features: [
                { icon: <Shield size={18} />, text: 'Full user management & RBAC' },
                { icon: <BarChart3 size={18} />, text: 'Revenue analytics & reporting' },
                { icon: <Activity size={18} />, text: 'System audit logs' },
                { icon: <Zap size={18} />, text: 'Public CMS management' },
                { icon: <CreditCard size={18} />, text: 'Stripe payment oversight' },
            ],
        },
        coach: {
            label: 'Coach', emoji: '🏋️',
            features: [
                { icon: <Users size={18} />, text: 'Manage client rosters' },
                { icon: <Brain size={18} />, text: 'AI workout program generation' },
                { icon: <Activity size={18} />, text: 'Biometric assessment tools' },
                { icon: <Timer size={18} />, text: 'Session notes & scheduling' },
                { icon: <TrendingUp size={18} />, text: 'Client progress tracking' },
            ],
        },
        client: {
            label: 'Client', emoji: '🎯',
            features: [
                { icon: <Dumbbell size={18} />, text: 'View assigned programs' },
                { icon: <TrendingUp size={18} />, text: 'Log physical progress' },
                { icon: <Zap size={18} />, text: 'Manage personal goals' },
                { icon: <CreditCard size={18} />, text: 'Secure installment payments' },
                { icon: <Timer size={18} />, text: 'Track session attendance' },
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
        <>
            <Head title="AI Gym — Intelligent Fitness Management" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

                /* ═══════════════════════════════════════════════════
                   DARK MODE — Deep charcoal with electric lime
                   ═══════════════════════════════════════════════════ */
                :root {
                    --brand:       #C8F04E;
                    --brand-dim:   #a8cc38;
                    --brand-muted: #8aaa25;
                    --brand-glow:  rgba(200,240,78,0.18);
                    --brand-tint:  rgba(200,240,78,0.07);
                    --brand-tint2: rgba(200,240,78,0.12);

                    /* Backgrounds — rich, warm-tinted darks */
                    --bg-base:     #0c0d0b;
                    --bg-raised:   #131410;
                    --bg-elevated: #191a16;
                    --bg-high:     #1f211b;
                    --bg-highest:  #262820;

                    /* Borders */
                    --border-subtle:  rgba(200,240,78,0.06);
                    --border-muted:   rgba(200,240,78,0.10);
                    --border-soft:    rgba(255,255,255,0.07);
                    --border-default: rgba(255,255,255,0.11);
                    --border-hover:   rgba(255,255,255,0.20);

                    /* Text */
                    --text-primary:   #eef0e8;
                    --text-secondary: #8e9182;
                    --text-tertiary:  #555848;
                    --text-brand:     var(--brand);

                    /* Feature accents — richer in dark */
                    --accent-purple-bg:   rgba(162,110,255,0.12);
                    --accent-purple-fg:   #c4a0ff;
                    --accent-emerald-bg:  rgba(52,211,153,0.12);
                    --accent-emerald-fg:  #6ee7b7;
                    --accent-sky-bg:      rgba(56,189,248,0.12);
                    --accent-sky-fg:      #7dd3fc;
                    --accent-amber-bg:    rgba(251,191,36,0.12);
                    --accent-amber-fg:    #fcd34d;
                    --accent-rose-bg:     rgba(251,113,133,0.12);
                    --accent-rose-fg:     #fda4af;
                    --accent-lime-bg:     rgba(200,240,78,0.12);
                    --accent-lime-fg:     var(--brand);

                    /* Testimonial avatars */
                    --av-purple-bg: rgba(162,110,255,0.18);
                    --av-purple-fg: #c4a0ff;
                    --av-sky-bg:    rgba(56,189,248,0.18);
                    --av-sky-fg:    #7dd3fc;
                    --av-mint-bg:   rgba(52,211,153,0.18);
                    --av-mint-fg:   #6ee7b7;

                    --radius:    16px;
                    --radius-sm: 10px;
                    --radius-lg: 24px;
                    --radius-xl: 32px;

                    --font-display: 'Syne', sans-serif;
                    --font-body:    'DM Sans', sans-serif;
                }

                /* ═══════════════════════════════════════════════════
                   LIGHT MODE — Warm cream with deep olive branding
                   ═══════════════════════════════════════════════════ */
                .light-mode {
                    --brand:       #5a7a00;
                    --brand-dim:   #4a6600;
                    --brand-muted: #3d5500;
                    --brand-glow:  rgba(90,122,0,0.12);
                    --brand-tint:  rgba(90,122,0,0.06);
                    --brand-tint2: rgba(90,122,0,0.10);

                    --bg-base:     #f7f5ef;
                    --bg-raised:   #f2f0e9;
                    --bg-elevated: #eae8e0;
                    --bg-high:     #e2e0d7;
                    --bg-highest:  #d8d6cd;

                    --border-subtle:  rgba(90,122,0,0.08);
                    --border-muted:   rgba(90,122,0,0.12);
                    --border-soft:    rgba(0,0,0,0.07);
                    --border-default: rgba(0,0,0,0.11);
                    --border-hover:   rgba(0,0,0,0.22);

                    --text-primary:   #1a1c14;
                    --text-secondary: #5a5c50;
                    --text-tertiary:  #9a9b90;
                    --text-brand:     var(--brand);

                    --accent-purple-bg:   rgba(109,40,217,0.08);
                    --accent-purple-fg:   #6d28d9;
                    --accent-emerald-bg:  rgba(4,120,87,0.08);
                    --accent-emerald-fg:  #047857;
                    --accent-sky-bg:      rgba(2,132,199,0.08);
                    --accent-sky-fg:      #0284c7;
                    --accent-amber-bg:    rgba(180,83,9,0.08);
                    --accent-amber-fg:    #b45309;
                    --accent-rose-bg:     rgba(190,18,60,0.08);
                    --accent-rose-fg:     #be123c;
                    --accent-lime-bg:     rgba(90,122,0,0.10);
                    --accent-lime-fg:     var(--brand);

                    --av-purple-bg: rgba(109,40,217,0.10);
                    --av-purple-fg: #6d28d9;
                    --av-sky-bg:    rgba(2,132,199,0.10);
                    --av-sky-fg:    #0284c7;
                    --av-mint-bg:   rgba(4,120,87,0.10);
                    --av-mint-fg:   #047857;
                }

                * { box-sizing: border-box; margin: 0; padding: 0; }

                body {
                    background: var(--bg-base);
                    color: var(--text-primary);
                    font-family: var(--font-body);
                    font-size: 16px;
                    line-height: 1.65;
                    overflow-x: hidden;
                }

                /* ── NOISE TEXTURE OVERLAY ── */
                body::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0.4;
                }
                .light-mode body::before { opacity: 0.2; }

                /* ── NAV ── */
                .nav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
                }
                .nav--scrolled {
                    background: rgba(12,13,11,0.82);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    border-bottom: 1px solid var(--border-subtle);
                    box-shadow: 0 1px 40px rgba(0,0,0,0.3);
                }
                .light-mode .nav--scrolled {
                    background: rgba(247,245,239,0.88);
                    box-shadow: 0 1px 40px rgba(0,0,0,0.08);
                }
                .nav-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 0 2rem;
                    display: flex; align-items: center; justify-content: space-between;
                    height: 70px;
                }
                .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
                .nav-logo-mark {
                    width: 34px; height: 34px;
                    background: var(--brand);
                    border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 20px var(--brand-glow);
                }
                .light-mode .nav-logo-mark { box-shadow: none; }
                .nav-logo-mark svg { color: #0c0d0b; }
                .light-mode .nav-logo-mark svg { color: #fff; }
                .nav-logo-text {
                    font-family: var(--font-display);
                    font-weight: 800; font-size: 17px;
                    color: var(--text-primary);
                    letter-spacing: -0.3px;
                }
                .nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; }
                .nav-links a {
                    color: var(--text-secondary); text-decoration: none;
                    font-size: 14px; font-weight: 500;
                    transition: color 0.2s;
                    letter-spacing: 0.1px;
                }
                .nav-links a:hover { color: var(--text-primary); }
                .nav-actions { display: flex; align-items: center; gap: 10px; }
                .nav-theme-btn {
                    width: 34px; height: 34px; border-radius: 50%;
                    border: 1px solid var(--border-default);
                    background: var(--bg-elevated);
                    color: var(--text-secondary);
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                }
                .nav-theme-btn:hover { border-color: var(--border-hover); color: var(--text-primary); }
                .btn-ghost {
                    padding: 8px 18px;
                    border: 1px solid var(--border-default);
                    border-radius: 50px;
                    background: transparent;
                    color: var(--text-secondary);
                    font-size: 14px; font-weight: 500;
                    cursor: pointer; text-decoration: none;
                    transition: all 0.2s;
                    display: inline-flex; align-items: center;
                }
                .btn-ghost:hover { border-color: var(--border-hover); color: var(--text-primary); background: var(--bg-elevated); }
                .btn-primary {
                    padding: 9px 20px; border-radius: 50px;
                    background: var(--brand); color: #0c0d0b;
                    font-size: 14px; font-weight: 700;
                    cursor: pointer; text-decoration: none;
                    transition: all 0.2s;
                    display: inline-flex; align-items: center; gap: 6px;
                    border: none;
                    box-shadow: 0 0 0 0 var(--brand-glow);
                }
                .btn-primary:hover { background: var(--brand-dim); transform: translateY(-1px); box-shadow: 0 4px 20px var(--brand-glow); }
                .light-mode .btn-primary { color: #fff; }
                .light-mode .btn-primary:hover { box-shadow: 0 4px 20px rgba(90,122,0,0.25); }

                /* ── MOBILE MENU ── */
                .mobile-menu-btn {
                    display: none; width: 40px; height: 40px;
                    background: var(--bg-elevated); border: 1px solid var(--border-default);
                    border-radius: var(--radius-sm); cursor: pointer;
                    color: var(--text-primary);
                    align-items: center; justify-content: center;
                }
                .mobile-menu {
                    display: none;
                    position: fixed; top: 70px; left: 0; right: 0;
                    background: var(--bg-raised);
                    border-bottom: 1px solid var(--border-soft);
                    padding: 1rem 2rem 1.5rem; z-index: 99;
                    flex-direction: column; gap: 4px;
                }
                .mobile-menu.open { display: flex; }
                .mobile-menu a {
                    padding: 11px 14px; color: var(--text-primary);
                    text-decoration: none; font-weight: 500;
                    border-radius: var(--radius-sm); transition: background 0.2s;
                }
                .mobile-menu a:hover { background: var(--bg-elevated); }
                .mobile-menu-actions {
                    display: flex; flex-direction: column; gap: 8px;
                    padding-top: 12px; border-top: 1px solid var(--border-soft); margin-top: 4px;
                }
                @media (max-width: 768px) {
                    .nav-links, .nav-actions { display: none; }
                    .mobile-menu-btn { display: flex; }
                }

                /* ── AMBIENT BG ── */
                .ambient {
                    position: fixed; inset: 0; pointer-events: none; z-index: 0;
                    overflow: hidden;
                }
                .ambient-orb {
                    position: absolute; border-radius: 50%;
                    filter: blur(80px);
                    animation: float 12s ease-in-out infinite;
                }
                .ambient-orb-1 {
                    width: 600px; height: 500px;
                    left: -100px; top: 10%;
                    background: radial-gradient(circle, rgba(200,240,78,0.07) 0%, transparent 70%);
                    animation-delay: 0s;
                }
                .ambient-orb-2 {
                    width: 500px; height: 400px;
                    right: -80px; top: 20%;
                    background: radial-gradient(circle, rgba(162,110,255,0.05) 0%, transparent 70%);
                    animation-delay: -4s;
                }
                .ambient-orb-3 {
                    width: 400px; height: 400px;
                    left: 40%; top: 60%;
                    background: radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%);
                    animation-delay: -8s;
                }
                .light-mode .ambient-orb-1 { background: radial-gradient(circle, rgba(90,122,0,0.06) 0%, transparent 70%); }
                .light-mode .ambient-orb-2 { background: radial-gradient(circle, rgba(109,40,217,0.04) 0%, transparent 70%); }
                .light-mode .ambient-orb-3 { background: radial-gradient(circle, rgba(2,132,199,0.03) 0%, transparent 70%); }
                @keyframes float {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    33%       { transform: translate(30px,-20px) scale(1.05); }
                    66%       { transform: translate(-20px,15px) scale(0.97); }
                }

                /* ── HERO ── */
                .hero-wrap {
                    position: relative; z-index: 1;
                    max-width: 1280px; margin: 0 auto;
                    padding: 128px 2rem 80px;
                    display: flex; align-items: center; gap: 5rem;
                    min-height: 100vh;
                }
                @media (max-width: 1024px) {
                    .hero-wrap { flex-direction: column; padding: 110px 1.5rem 60px; min-height: auto; }
                }
                .hero-content { flex: 1; max-width: 590px; position: relative; }
                .hero-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 6px 14px;
                    border: 1px solid rgba(200,240,78,0.25);
                    border-radius: 50px;
                    background: rgba(200,240,78,0.07);
                    font-size: 11.5px; font-weight: 600;
                    color: var(--brand);
                    letter-spacing: 0.6px; text-transform: uppercase;
                    margin-bottom: 2rem;
                }
                .light-mode .hero-badge {
                    border-color: rgba(90,122,0,0.2);
                    background: rgba(90,122,0,0.06);
                }
                .badge-dot {
                    width: 6px; height: 6px; border-radius: 50%; background: var(--brand);
                    animation: pulse-dot 2s infinite;
                }
                @keyframes pulse-dot {
                    0%,100% { opacity:1; transform:scale(1); }
                    50% { opacity:0.4; transform:scale(0.75); }
                }
                .hero-title {
                    font-family: var(--font-display);
                    font-size: clamp(46px, 5.5vw, 78px);
                    font-weight: 800; line-height: 1.0;
                    letter-spacing: -2.5px;
                    color: var(--text-primary);
                    margin-bottom: 1.5rem;
                }
                .hero-title-accent {
                    color: var(--brand); display: block;
                    /* Subtle text-shadow in dark for depth */
                    text-shadow: 0 0 60px var(--brand-glow);
                }
                .light-mode .hero-title-accent { text-shadow: none; }
                .hero-subtitle {
                    font-size: 17px; color: var(--text-secondary);
                    line-height: 1.75; max-width: 460px; margin-bottom: 2.5rem;
                    font-weight: 300;
                }
                .hero-actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 3rem; }
                .btn-hero {
                    padding: 14px 28px; border-radius: 50px;
                    background: var(--brand); color: #0c0d0b;
                    font-size: 15px; font-weight: 700;
                    text-decoration: none;
                    display: inline-flex; align-items: center; gap: 8px;
                    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
                    font-family: var(--font-display);
                    box-shadow: 0 0 0 0 var(--brand-glow);
                    border: none;
                }
                .btn-hero:hover { background: var(--brand-dim); transform: translateY(-2px); box-shadow: 0 8px 40px var(--brand-glow); }
                .light-mode .btn-hero { color: #fff; }
                .btn-hero-outline {
                    padding: 14px 28px; border-radius: 50px;
                    border: 1px solid var(--border-default);
                    color: var(--text-primary);
                    font-size: 15px; font-weight: 500;
                    text-decoration: none;
                    display: inline-flex; align-items: center; gap: 8px;
                    transition: all 0.25s;
                    background: var(--bg-elevated);
                }
                .btn-hero-outline:hover { border-color: var(--border-hover); background: var(--bg-high); }
                .hero-trust {
                    display: flex; align-items: center; gap: 12px;
                    color: var(--text-tertiary); font-size: 13px;
                }
                .hero-trust-avatars { display: flex; }
                .hero-trust-avatar {
                    width: 28px; height: 28px; border-radius: 50%;
                    border: 2px solid var(--bg-base); overflow: hidden;
                    margin-left: -8px;
                }
                .hero-trust-avatar:first-child { margin-left: 0; }
                .hero-trust-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .hero-trust-text { color: var(--text-secondary); }
                .hero-trust-text strong { color: var(--brand); font-weight: 600; }

                /* ── HERO IMAGES ── */
                .hero-visual { flex: 1; max-width: 500px; position: relative; }
                @media (max-width: 1024px) { .hero-visual { width: 100%; max-width: 100%; } }
                .hero-image-grid {
                    display: grid; grid-template-columns: 1.4fr 1fr; gap: 12px; height: 520px;
                }
                @media (max-width: 1024px) { .hero-image-grid { height: 360px; } }
                .hero-img { border-radius: var(--radius-lg); overflow: hidden; position: relative; }
                .hero-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
                .hero-img:hover img { transform: scale(1.05); }
                .hero-img--main { grid-row: span 2; }
                .hero-img-stack { display: flex; flex-direction: column; gap: 12px; }
                .hero-img--sm { flex: 1; }
                .img-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%);
                }
                .img-badge {
                    position: absolute; bottom: 14px; left: 14px;
                    display: flex; align-items: center; gap: 6px;
                    background: rgba(12,13,11,0.75);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.10);
                    border-radius: 50px; padding: 6px 12px;
                    font-size: 12px; font-weight: 600; color: #fff;
                }
                .img-badge .badge-dot { background: #22c55e; }
                .img-stat-card {
                    position: absolute; bottom: 14px; left: 14px; right: 14px;
                    background: rgba(12,13,11,0.78);
                    backdrop-filter: blur(14px);
                    border: 1px solid rgba(200,240,78,0.18);
                    border-radius: var(--radius-sm); padding: 10px 14px;
                    display: flex; align-items: center; gap: 10px;
                }
                .img-stat-icon { color: var(--brand); }
                .img-stat-val { font-size: 16px; font-weight: 700; color: var(--brand); font-family: var(--font-display); line-height: 1; }
                .img-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }

                /* ── MARQUEE ── */
                .marquee-wrap {
                    border-top: 1px solid var(--border-soft);
                    border-bottom: 1px solid var(--border-soft);
                    padding: 18px 0; overflow: hidden;
                    background: var(--bg-raised);
                    position: relative; z-index: 1;
                }
                .marquee-track {
                    display: flex; gap: 3rem;
                    animation: marquee 32s linear infinite;
                    white-space: nowrap;
                }
                .marquee-track:hover { animation-play-state: paused; }
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-item {
                    display: inline-flex; align-items: center; gap: 10px;
                    color: var(--text-tertiary); font-size: 12.5px; font-weight: 500;
                    letter-spacing: 0.5px;
                }
                .marquee-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--brand); opacity: 0.6; }

                /* ── STATS ── */
                .stats-section {
                    padding: 80px 2rem;
                    max-width: 1280px; margin: 0 auto;
                    position: relative; z-index: 1;
                }
                .stats-grid {
                    display: grid; grid-template-columns: repeat(4, 1fr);
                    gap: 1px; background: var(--border-soft);
                    border: 1px solid var(--border-soft);
                    border-radius: var(--radius-lg); overflow: hidden;
                }
                @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                .stat-card {
                    background: var(--bg-raised);
                    padding: 2.5rem 2rem;
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                    text-align: center; transition: background 0.25s;
                }
                .stat-card:hover { background: var(--bg-elevated); }
                .stat-icon { color: var(--brand); margin-bottom: 4px; opacity: 0.85; }
                .stat-value {
                    font-family: var(--font-display);
                    font-size: 44px; font-weight: 800;
                    color: var(--text-primary);
                    letter-spacing: -1.5px; line-height: 1;
                }
                .stat-label { font-size: 13.5px; color: var(--text-secondary); }

                /* ── SECTIONS ── */
                .section {
                    padding: 100px 2rem;
                    max-width: 1280px; margin: 0 auto;
                    position: relative; z-index: 1;
                }
                .section-tag {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 11.5px; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 1.2px;
                    color: var(--brand); margin-bottom: 16px;
                }
                .section-title {
                    font-family: var(--font-display);
                    font-size: clamp(30px, 3.8vw, 50px);
                    font-weight: 800; letter-spacing: -1.5px; line-height: 1.08;
                    color: var(--text-primary); margin-bottom: 1rem;
                }
                .section-subtitle {
                    font-size: 16.5px; color: var(--text-secondary);
                    max-width: 500px; line-height: 1.75; font-weight: 300;
                }
                .section-header { margin-bottom: 4rem; }
                .section-header--center { text-align: center; }
                .section-header--center .section-subtitle { margin: 0 auto; }

                /* ── FEATURES ── */
                .features-grid {
                    display: grid; grid-template-columns: repeat(3, 1fr);
                    gap: 1px; background: var(--border-subtle);
                    border: 1px solid var(--border-soft);
                    border-radius: var(--radius-lg); overflow: hidden;
                }
                @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px)  { .features-grid { grid-template-columns: 1fr; } }
                .feature-card {
                    background: var(--bg-raised);
                    padding: 2rem; position: relative;
                    transition: background 0.25s; cursor: default; overflow: hidden;
                }
                .feature-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, var(--brand) 0%, transparent 100%);
                    transform: scaleX(0); transition: transform 0.35s ease; transform-origin: left;
                }
                .feature-card:hover { background: var(--bg-elevated); }
                .feature-card:hover::before { transform: scaleX(1); }
                .feature-icon-wrap {
                    width: 44px; height: 44px; border-radius: var(--radius-sm);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 1.25rem;
                }
                .accent-purple  { background: var(--accent-purple-bg);  color: var(--accent-purple-fg); }
                .accent-emerald { background: var(--accent-emerald-bg); color: var(--accent-emerald-fg); }
                .accent-sky     { background: var(--accent-sky-bg);     color: var(--accent-sky-fg); }
                .accent-amber   { background: var(--accent-amber-bg);   color: var(--accent-amber-fg); }
                .accent-rose    { background: var(--accent-rose-bg);    color: var(--accent-rose-fg); }
                .accent-lime    { background: var(--accent-lime-bg);    color: var(--accent-lime-fg); }
                .feature-title {
                    font-family: var(--font-display);
                    font-size: 16.5px; font-weight: 700;
                    color: var(--text-primary); margin-bottom: 8px;
                }
                .feature-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.65; }
                .feature-arrow {
                    position: absolute; bottom: 1.5rem; right: 1.5rem;
                    color: var(--text-tertiary); opacity: 0;
                    transform: translateX(-4px); transition: all 0.25s;
                }
                .feature-card:hover .feature-arrow { opacity: 1; transform: translateX(0); color: var(--brand); }

                /* ── ROLES ── */
                .roles-section {
                    padding: 100px 2rem;
                    background: var(--bg-raised);
                    border-top: 1px solid var(--border-soft);
                    border-bottom: 1px solid var(--border-soft);
                    position: relative; z-index: 1;
                }
                .roles-inner { max-width: 1280px; margin: 0 auto; }
                .roles-tabs { display: flex; gap: 8px; margin-bottom: 3rem; flex-wrap: wrap; }
                .role-tab {
                    padding: 10px 22px; border-radius: 50px;
                    border: 1px solid var(--border-default);
                    background: transparent; color: var(--text-secondary);
                    font-size: 14px; font-weight: 600; cursor: pointer;
                    transition: all 0.2s; font-family: var(--font-body);
                }
                .role-tab:hover { border-color: var(--border-hover); color: var(--text-primary); background: var(--bg-elevated); }
                .role-tab--active {
                    background: var(--brand); border-color: var(--brand);
                    color: #0c0d0b;
                    box-shadow: 0 0 20px var(--brand-glow);
                }
                .light-mode .role-tab--active { color: #fff; box-shadow: none; }
                .roles-content { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
                @media (max-width: 900px) { .roles-content { grid-template-columns: 1fr; } }
                .role-features { display: flex; flex-direction: column; gap: 10px; }
                .role-feature-item {
                    display: flex; align-items: center; gap: 16px;
                    padding: 15px 18px;
                    background: var(--bg-base);
                    border: 1px solid var(--border-soft);
                    border-radius: var(--radius); transition: all 0.2s;
                }
                .role-feature-item:hover {
                    border-color: var(--border-muted);
                    background: var(--brand-tint);
                }
                .role-feature-num {
                    width: 28px; height: 28px; min-width: 28px; border-radius: 50%;
                    background: var(--brand-tint2); color: var(--brand);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 700; font-family: var(--font-display);
                }
                .role-feature-icon { color: var(--text-secondary); }
                .role-feature-text { font-size: 14.5px; font-weight: 500; color: var(--text-primary); }

                /* ── ROLE MOCKUP ── */
                .role-mockup {
                    background: var(--bg-base);
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius-xl); overflow: hidden; padding: 2px;
                }
                .role-mockup-inner { background: #0a0b08; border-radius: calc(var(--radius-xl) - 2px); overflow: hidden; }
                .light-mode .role-mockup-inner { background: #e8e6df; }
                .mockup-topbar {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .light-mode .mockup-topbar { border-bottom-color: rgba(0,0,0,0.07); }
                .mockup-dots { display: flex; gap: 6px; }
                .mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
                .mockup-dot--r { background: #ff5f56; }
                .mockup-dot--y { background: #ffbd2e; }
                .mockup-dot--g { background: #27c93f; }
                .mockup-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
                .mockup-header { display: flex; align-items: center; justify-content: space-between; }
                .mockup-title-wrap { display: flex; flex-direction: column; gap: 4px; }
                .mockup-bar { height: 11px; border-radius: 4px; background: rgba(255,255,255,0.07); }
                .light-mode .mockup-bar { background: rgba(0,0,0,0.08); }
                .mockup-bar--wide { width: 140px; }
                .mockup-bar--sm { width: 80px; height: 9px; }
                .mockup-avatar { width: 34px; height: 34px; border-radius: 50%; background: rgba(200,240,78,0.18); display: flex; align-items: center; justify-content: center; font-size: 14px; }
                .mockup-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                .mockup-stat {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px; padding: 14px;
                }
                .light-mode .mockup-stat { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.07); }
                .mockup-stat-val { font-size: 20px; font-weight: 700; color: var(--brand); font-family: var(--font-display); }
                .mockup-stat-label { font-size: 11px; color: rgba(255,255,255,0.28); margin-top: 2px; }
                .light-mode .mockup-stat-label { color: rgba(0,0,0,0.3); }
                .mockup-chart {
                    height: 80px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px; padding: 12px 16px;
                    display: flex; align-items: flex-end; gap: 6px;
                }
                .light-mode .mockup-chart { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.07); }
                .mockup-bar-chart { flex: 1; border-radius: 3px 3px 0 0; background: rgba(200,240,78,0.18); transition: background 0.3s; }
                .mockup-bar-chart--active { background: var(--brand); }
                .mockup-ai-block {
                    background: rgba(200,240,78,0.05);
                    border: 1px solid rgba(200,240,78,0.12);
                    border-radius: 14px; padding: 16px;
                    display: flex; align-items: center; gap: 12px;
                }
                .mockup-ai-icon { color: var(--brand); }
                .mockup-ai-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; }
                .mockup-ai-line { height: 7px; border-radius: 4px; background: rgba(200,240,78,0.12); }
                .mockup-role-pill {
                    display: inline-flex; padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 11px; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.5px;
                }

                /* ── SHOWCASE ── */
                .showcase-section { padding: 0 2rem 100px; max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }
                .showcase-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
                @media (max-width: 768px) { .showcase-grid { grid-template-columns: 1fr; } }
                .showcase-img { position: relative; overflow: hidden; border-radius: var(--radius-lg); }
                .showcase-img img { width: 100%; height: 380px; object-fit: cover; transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
                .showcase-img:hover img { transform: scale(1.04); }
                .showcase-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 55%);
                    display: flex; align-items: flex-end; padding: 1.75rem;
                }
                .showcase-label {
                    background: rgba(12,13,11,0.65);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.10);
                    border-radius: 50px; padding: 7px 16px;
                    font-size: 13px; font-weight: 600; color: #fff;
                    display: flex; align-items: center; gap: 6px;
                }
                .showcase-label svg { color: var(--brand); }
                .showcase-side { display: flex; flex-direction: column; gap: 14px; }
                .showcase-side .showcase-img img { height: 183px; }

                /* ── PRICING ── */
                .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: stretch; }
                @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr; } }
                .pricing-card {
                    background: var(--bg-raised);
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg); padding: 2rem;
                    display: flex; flex-direction: column;
                    position: relative; transition: border-color 0.25s, transform 0.25s;
                }
                .pricing-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
                .pricing-card--featured {
                    background: var(--brand);
                    border-color: var(--brand);
                    box-shadow: 0 0 60px var(--brand-glow);
                    transform: scale(1.02);
                }
                .pricing-card--featured:hover { transform: scale(1.02) translateY(-2px); }
                .pricing-card--featured * { color: #0c0d0b !important; }
                .light-mode .pricing-card--featured * { color: #fff !important; }
                .pricing-badge {
                    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
                    background: #0c0d0b; color: var(--brand) !important;
                    font-size: 10.5px; font-weight: 700; padding: 4px 14px;
                    border-radius: 50px; white-space: nowrap;
                    letter-spacing: 0.8px; text-transform: uppercase;
                }
                .light-mode .pricing-badge { background: #1a1c14; }
                .pricing-plan { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: var(--brand); margin-bottom: 12px; }
                .pricing-card--featured .pricing-plan { color: rgba(12,13,11,0.55) !important; }
                .pricing-price-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 8px; }
                .pricing-price { font-family: var(--font-display); font-size: 46px; font-weight: 800; color: var(--text-primary); letter-spacing: -2px; }
                .pricing-period { font-size: 14px; color: var(--text-secondary); }
                .pricing-desc { font-size: 14px; color: var(--text-secondary); margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-soft); }
                .pricing-card--featured .pricing-desc { border-color: rgba(12,13,11,0.15); }
                .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 11px; flex: 1; margin-bottom: 1.5rem; }
                .pricing-features li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary); }
                .pricing-check { color: var(--brand); flex-shrink: 0; }
                .pricing-card--featured .pricing-check { color: rgba(12,13,11,0.55) !important; }
                .pricing-cta {
                    display: flex; align-items: center; justify-content: center; gap: 6px;
                    padding: 12px 20px; border-radius: 50px;
                    border: 1px solid var(--border-hover);
                    background: transparent; color: var(--text-primary);
                    font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s;
                }
                .pricing-cta:hover { background: var(--bg-elevated); }
                .pricing-cta--featured { background: #0c0d0b !important; color: var(--brand) !important; border-color: #0c0d0b !important; }
                .pricing-cta--featured:hover { opacity: 0.88; }
                .light-mode .pricing-cta--featured { background: #1a1c14 !important; }

                /* ── TESTIMONIALS ── */
                .testimonials-section {
                    padding: 100px 2rem;
                    background: var(--bg-raised);
                    border-top: 1px solid var(--border-soft);
                    border-bottom: 1px solid var(--border-soft);
                    position: relative; z-index: 1;
                }
                .testimonials-inner { max-width: 1280px; margin: 0 auto; }
                .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
                @media (max-width: 900px) { .testimonials-grid { grid-template-columns: 1fr; } }
                .testimonial-card {
                    background: var(--bg-base);
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg); padding: 2rem;
                    display: flex; flex-direction: column; gap: 1rem;
                    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
                }
                .testimonial-card:hover {
                    border-color: var(--brand-muted);
                    transform: translateY(-3px);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.2);
                }
                .light-mode .testimonial-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
                .stars { display: flex; gap: 4px; }
                .star { width: 14px; height: 14px; fill: #f59e0b; }
                .testimonial-quote { font-size: 14.5px; color: var(--text-secondary); line-height: 1.75; flex: 1; font-style: italic; }
                .testimonial-author { display: flex; align-items: center; gap: 12px; margin-top: auto; }
                .author-avatar {
                    width: 40px; height: 40px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 13px; font-weight: 700; flex-shrink: 0;
                }
                .av-purple { background: var(--av-purple-bg); color: var(--av-purple-fg); }
                .av-blue   { background: var(--av-sky-bg);    color: var(--av-sky-fg); }
                .av-green  { background: var(--av-mint-bg);   color: var(--av-mint-fg); }
                .author-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
                .author-role { font-size: 12px; color: var(--text-tertiary); margin-top: 2px; }

                /* ── FAQ ── */
                .faq-item { border-bottom: 1px solid var(--border-soft); }
                .faq-question {
                    width: 100%; background: none; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 1.5rem 0; text-align: left; gap: 1rem;
                    color: var(--text-primary); font-size: 15.5px; font-weight: 600;
                    font-family: var(--font-body); transition: color 0.2s;
                }
                .faq-question:hover { color: var(--brand); }
                .faq-chevron { color: var(--text-tertiary); transition: transform 0.3s; flex-shrink: 0; }
                .faq-chevron.rotate { transform: rotate(180deg); color: var(--brand); }
                .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; }
                .faq-answer--open { max-height: 300px; padding-bottom: 1.5rem; }
                .faq-answer p { font-size: 15px; color: var(--text-secondary); line-height: 1.75; padding-right: 3rem; font-weight: 300; }

                /* ── CONTACT ── */
                .contact-section { padding: 100px 2rem; max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }
                .contact-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 6rem; align-items: start; }
                @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; gap: 3rem; } }
                .contact-info { display: flex; flex-direction: column; gap: 1.5rem; }
                .contact-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: var(--brand); }
                .contact-title { font-family: var(--font-display); font-size: 40px; font-weight: 800; letter-spacing: -1.5px; color: var(--text-primary); line-height: 1.1; }
                .contact-body { font-size: 16px; color: var(--text-secondary); line-height: 1.75; font-weight: 300; }
                .contact-email { color: var(--brand); text-decoration: none; font-weight: 600; }
                .contact-email:hover { text-decoration: underline; }
                .contact-perks { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
                .contact-perk { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary); }
                .contact-perk-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--brand); flex-shrink: 0; }
                .contact-form { display: flex; flex-direction: column; gap: 16px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
                .form-group { display: flex; flex-direction: column; gap: 6px; }
                .form-label { font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-tertiary); }
                .form-input, .form-textarea {
                    background: var(--bg-raised);
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius); padding: 13px 17px;
                    font-size: 15px; color: var(--text-primary);
                    font-family: var(--font-body); outline: none;
                    transition: border-color 0.2s, background 0.2s; width: 100%;
                }
                .form-input:focus, .form-textarea:focus {
                    border-color: var(--brand-muted);
                    background: var(--bg-elevated);
                    box-shadow: 0 0 0 3px var(--brand-tint);
                }
                .form-input::placeholder, .form-textarea::placeholder { color: var(--text-tertiary); }
                .form-textarea { resize: none; }
                .form-submit {
                    padding: 14px 28px; background: var(--brand); color: #0c0d0b;
                    border: none; border-radius: 50px; font-size: 15px; font-weight: 700;
                    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
                    transition: all 0.2s; font-family: var(--font-display);
                    box-shadow: 0 0 0 0 var(--brand-glow);
                }
                .form-submit:hover { background: var(--brand-dim); transform: translateY(-1px); box-shadow: 0 6px 30px var(--brand-glow); }
                .form-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
                .light-mode .form-submit { color: #fff; }

                /* ── FOOTER ── */
                .footer {
                    border-top: 1px solid var(--border-soft);
                    background: var(--bg-raised); padding: 2.5rem 2rem;
                    position: relative; z-index: 1;
                }
                .footer-inner {
                    max-width: 1280px; margin: 0 auto;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 2rem; flex-wrap: wrap;
                }
                .footer-links { display: flex; gap: 2rem; flex-wrap: wrap; }
                .footer-links a { font-size: 14px; color: var(--text-tertiary); text-decoration: none; transition: color 0.2s; }
                .footer-links a:hover { color: var(--text-primary); }
                .footer-copy { font-size: 13px; color: var(--text-tertiary); }

                /* ── ANIMATIONS ── */
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .hero-content > * { animation: fadeInUp 0.65s ease both; }
                .hero-content > *:nth-child(1) { animation-delay: 0.08s; }
                .hero-content > *:nth-child(2) { animation-delay: 0.18s; }
                .hero-content > *:nth-child(3) { animation-delay: 0.28s; }
                .hero-content > *:nth-child(4) { animation-delay: 0.38s; }
                .hero-content > *:nth-child(5) { animation-delay: 0.48s; }
                .hero-visual { animation: fadeInUp 0.75s 0.25s ease both; }

                /* ── DIVIDER ── */
                .divider-line {
                    width: 100%; height: 1px;
                    background: linear-gradient(90deg, transparent 0%, var(--border-default) 30%, var(--border-default) 70%, transparent 100%);
                    position: relative; z-index: 1;
                }
            `}</style>

            <div className={isDark ? '' : 'light-mode'}>
                {/* Ambient background orbs */}
                <div className="ambient">
                    <div className="ambient-orb ambient-orb-1" />
                    <div className="ambient-orb ambient-orb-2" />
                    <div className="ambient-orb ambient-orb-3" />
                </div>

                {/* ── NAV ── */}
                <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
                    <div className="nav-inner">
                        <a href="/" className="nav-logo">
                            <div className="nav-logo-mark"><Dumbbell size={18} /></div>
                            <span className="nav-logo-text">AI GYM</span>
                        </a>
                        <ul className="nav-links">
                            {navLinks.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
                        </ul>
                        <div className="nav-actions">
                            <button onClick={toggleTheme} className="nav-theme-btn">
                                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                            </button>
                            {auth.user ? (
                                <Link href="/dashboard" className="btn-primary">Dashboard <ArrowRight size={14} /></Link>
                            ) : (
                                <>
                                    <Link href="/login" className="btn-ghost">Log in</Link>
                                    {canRegister && <Link href="/register" className="btn-primary">Get started <ArrowRight size={14} /></Link>}
                                </>
                            )}
                        </div>
                        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setIsMobileMenuOpen(false)}>{l.label}</a>)}
                    <div className="mobile-menu-actions">
                        {auth.user ? (
                            <Link href="/dashboard" className="btn-primary" style={{ justifyContent: 'center' }}>Dashboard</Link>
                        ) : (
                            <>
                                <Link href="/login" className="btn-ghost" style={{ justifyContent: 'center' }}>Log in</Link>
                                {canRegister && <Link href="/register" className="btn-primary" style={{ justifyContent: 'center' }}>Get started</Link>}
                            </>
                        )}
                    </div>
                </div>

                {/* ── HERO ── */}
                <div className="hero-wrap">
                    <div className="hero-content">
                        {content?.announcement ? (
                            <div className="hero-badge"><span className="badge-dot" /><BellRing size={12} />{content.announcement}</div>
                        ) : (
                            <div className="hero-badge"><span className="badge-dot" /><Sparkles size={12} />Powered by Gemini 2.5 Flash</div>
                        )}
                        <h1 className="hero-title">
                            The Future<br />of Fitness is
                            <span className="hero-title-accent">Intelligent.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Generate custom workouts, analyze biometrics instantly, and track every client's progress — all powered by AI, all in one enterprise platform.
                        </p>
                        <div className="hero-actions">
                            {auth.user ? (
                                <Link href="/dashboard" className="btn-hero">Access Portal <ArrowRight size={16} /></Link>
                            ) : (
                                <>
                                    {canRegister && <Link href="/register" className="btn-hero">Start free trial <ArrowRight size={16} /></Link>}
                                    <a href="#features" className="btn-hero-outline"><Play size={14} /> Watch demo</a>
                                </>
                            )}
                        </div>
                        <div className="hero-trust">
                            <div className="hero-trust-avatars">
                                {['photo-1534528741775-53994a69daeb','photo-1494790108377-be9c29b29330','photo-1472099645785-5658abf4ff4e','photo-1506794778202-cad84cf45f1d'].map(id => (
                                    <div key={id} className="hero-trust-avatar">
                                        <img src={`https://images.unsplash.com/${id}?w=56&h=56&q=80&auto=format&fit=crop&crop=face`} alt="" />
                                    </div>
                                ))}
                            </div>
                            <span className="hero-trust-text">Trusted by <strong>1,200+</strong> athletes & coaches</span>
                        </div>
                    </div>
                    <div className="hero-visual"><HeroImageGrid /></div>
                </div>

                {/* ── MARQUEE ── */}
                <div className="marquee-wrap">
                    <div className="marquee-track">
                        {['AI Workout Generation','Smart Biometrics','Stripe Payments','Role-Based Access','Progress Tracking','Redis Caching','Session Scheduling','Client Analytics','AI Workout Generation','Smart Biometrics','Stripe Payments','Role-Based Access','Progress Tracking','Redis Caching','Session Scheduling','Client Analytics'].map((item, i) => (
                            <span key={i} className="marquee-item">
                                <span className="marquee-dot" />{item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── STATS ── */}
                <div className="stats-section">
                    <div className="stats-grid">
                        <StatCard value={1200} suffix="+" label="Active members"      icon={<Users size={20} />} />
                        <StatCard value={48}   suffix="k" label="Programs generated" icon={<Brain size={20} />} />
                        <StatCard value={98}   suffix="%" label="Client satisfaction" icon={<Activity size={20} />} />
                        <StatCard value={10}   suffix="x" label="Faster workflow"    icon={<Zap size={20} />} />
                    </div>
                </div>

                {/* ── SHOWCASE ── */}
                <div className="showcase-section">
                    <div className="showcase-grid">
                        <div className="showcase-img">
                            <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=80&auto=format&fit=crop" alt="Gym floor" />
                            <div className="showcase-overlay">
                                <div className="showcase-label"><Brain size={14} /> AI-Powered Training</div>
                            </div>
                        </div>
                        <div className="showcase-side">
                            <div className="showcase-img">
                                <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80&auto=format&fit=crop" alt="Barbell training" />
                                <div className="showcase-overlay">
                                    <div className="showcase-label"><TrendingUp size={14} /> Performance Tracking</div>
                                </div>
                            </div>
                            <div className="showcase-img">
                                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80&auto=format&fit=crop" alt="Coach and client" />
                                <div className="showcase-overlay">
                                    <div className="showcase-label"><Users size={14} /> Coach & Client Portals</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FEATURES ── */}
                <section id="features" className="section">
                    <div className="section-header">
                        <div className="section-tag"><Sparkles size={12} /> Enterprise Features</div>
                        <h2 className="section-title">Built for coaches.<br />Designed for athletes.</h2>
                        <p className="section-subtitle">Everything you need to manage gym operations, improve client outcomes, and process payments with confidence.</p>
                    </div>
                    <div className="features-grid">
                        <FeatureCard icon={<Brain size={22} />}      accent="accent-purple"  title="AI Workout Generation" description="Instantly generate tailored 4-week programs based on client goals, fitness level, and medical constraints — powered by Gemini." />
                        <FeatureCard icon={<Activity size={22} />}   accent="accent-emerald" title="Smart Biometrics"       description="Enter physical stats and get ideal weight targets, BMI insights, and personalised medical strategies from Gemini AI." />
                        <FeatureCard icon={<CreditCard size={22} />} accent="accent-sky"     title="Automated Billing"      description="Stripe integration. Clients pay in full or split memberships over 3 months. Delinquent accounts are automatically flagged." />
                        <FeatureCard icon={<TrendingUp size={22} />} accent="accent-amber"   title="Visual Progression"    description="Interactive dashboards for coaches and clients. Track weight, attendance, and goals over time with React Recharts." />
                        <FeatureCard icon={<Users size={22} />}      accent="accent-rose"    title="Role-Based Security"   description="Granular RBAC ensures admins, coaches, and clients only see what they need. Secure by design, backed by Spatie." />
                        <FeatureCard icon={<Zap size={22} />}        accent="accent-lime"    title="Redis Cached CMS"      description="Lightning-fast performance. Analytics, dashboard stats, and this landing page load in 0ms using Predis caching." />
                    </div>
                </section>

                <div className="divider-line" />

                {/* ── ROLES ── */}
                <div id="how-it-works" className="roles-section">
                    <div className="roles-inner">
                        <div className="section-header">
                            <div className="section-tag"><Users size={12} /> Unified Ecosystem</div>
                            <h2 className="section-title">A dedicated portal<br />for every role</h2>
                            <p className="section-subtitle">Switch between roles to see exactly what each user experiences on the platform.</p>
                        </div>
                        <div className="roles-tabs">
                            {(Object.keys(roles) as Array<keyof typeof roles>).map(role => (
                                <button key={role} onClick={() => setActiveRole(role)} className={`role-tab ${activeRole === role ? 'role-tab--active' : ''}`}>
                                    {roles[role].emoji} {roles[role].label}
                                </button>
                            ))}
                        </div>
                        <div className="roles-content">
                            <div className="role-features">
                                {roles[activeRole].features.map((f, i) => (
                                    <div key={i} className="role-feature-item">
                                        <div className="role-feature-num">{i + 1}</div>
                                        <div className="role-feature-icon">{f.icon}</div>
                                        <span className="role-feature-text">{f.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="role-mockup">
                                <div className="role-mockup-inner">
                                    <div className="mockup-topbar">
                                        <div className="mockup-dots">
                                            <div className="mockup-dot mockup-dot--r" />
                                            <div className="mockup-dot mockup-dot--y" />
                                            <div className="mockup-dot mockup-dot--g" />
                                        </div>
                                        <div className="mockup-bar mockup-bar--sm" style={{ width: 100 }} />
                                        <div style={{ width: 60 }} />
                                    </div>
                                    <div className="mockup-body">
                                        <div className="mockup-header">
                                            <div className="mockup-title-wrap">
                                                <div className="mockup-bar mockup-bar--wide" />
                                                <div className="mockup-bar mockup-bar--sm" />
                                            </div>
                                            <div className="mockup-avatar">
                                                {activeRole === 'admin' ? '⚙️' : activeRole === 'coach' ? '🏋️' : '🎯'}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="mockup-role-pill" style={{
                                                background: activeRole === 'admin' ? 'rgba(239,68,68,0.12)' : activeRole === 'coach' ? 'rgba(162,110,255,0.12)' : 'rgba(56,189,248,0.12)',
                                                color: activeRole === 'admin' ? '#fca5a5' : activeRole === 'coach' ? '#c4a0ff' : '#7dd3fc',
                                            }}>
                                                {roles[activeRole].label} Portal
                                            </span>
                                        </div>
                                        <div className="mockup-stats">
                                            {['48k','98%','10x'].map((v, i) => (
                                                <div key={i} className="mockup-stat">
                                                    <div className="mockup-stat-val">{v}</div>
                                                    <div className="mockup-stat-label">{['Programs','Satisfaction','Faster'][i]}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mockup-chart">
                                            {[40,60,45,80,65,90,75].map((h, i) => (
                                                <div key={i} className={`mockup-bar-chart ${i === 5 ? 'mockup-bar-chart--active' : ''}`} style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                        <div className="mockup-ai-block">
                                            <Brain size={18} className="mockup-ai-icon" />
                                            <div className="mockup-ai-lines">
                                                <div className="mockup-ai-line" style={{ width: '80%' }} />
                                                <div className="mockup-ai-line" style={{ width: '58%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PRICING ── */}
                <section id="pricing" className="section">
                    <div className="section-header section-header--center">
                        <div className="section-tag"><CreditCard size={12} /> Pricing</div>
                        <h2 className="section-title">Simple, transparent plans</h2>
                        <p className="section-subtitle">Start free. Upgrade when your facility scales.</p>
                    </div>
                    <div className="pricing-grid">
                        <PricingCard plan="Starter" price="Free"  period="forever"  description="For solo coaches just getting started." features={['Up to 5 clients','AI program generator (10/mo)','Basic biometrics','Community support']} cta="Get started free" canRegister={canRegister} />
                        <PricingCard plan="Pro"     price="$49"   period="/ month"  description="For growing gyms and serious coaches." features={['Unlimited clients','Unlimited AI generation','Stripe split payments','FullCalendar integration','Priority support']} cta="Start Pro trial" highlighted canRegister={canRegister} />
                        <PricingCard plan="Enterprise" price="$199" period="/ month" description="For multi-location gym chains." features={['Multi-location support','Custom branding','Redis CMS Access','Dedicated account manager','SLA guarantee']} cta="Contact sales" canRegister={canRegister} />
                    </div>
                </section>

                {/* ── TESTIMONIALS ── */}
                <div className="testimonials-section">
                    <div className="testimonials-inner">
                        <div className="section-header section-header--center">
                            <div className="section-tag"><Users size={12} /> Testimonials</div>
                            <h2 className="section-title">Loved by industry leaders</h2>
                        </div>
                        <div className="testimonials-grid">
                            <TestimonialCard quote="The AI program generator saved me hours every week. My clients are getting better results than ever and the programs feel genuinely personalised." name="Sarah M." role="Head Coach, Casablanca Fitness" initials="SM" accent="av-purple" />
                            <TestimonialCard quote="The Stripe split payment feature and automated delinquent tracking was a game-changer. Revenue recovery increased by 40% in the first month." name="Karim B." role="Gym Owner, Marrakech Central" initials="KB" accent="av-blue" />
                            <TestimonialCard quote="I can finally see my workout history, goals, and progress all in one place. The biometric advice helped me adapt my training to my health conditions." name="Ines T." role="Pro Athlete" initials="IT" accent="av-green" />
                        </div>
                    </div>
                </div>

                {/* ── FAQ ── */}
                <section id="faq" className="section" style={{ maxWidth: '820px' }}>
                    <div className="section-header section-header--center">
                        <div className="section-tag">FAQ</div>
                        <h2 className="section-title">Common questions</h2>
                    </div>
                    <div>
                        <FAQItem q="How does the AI workout generator work?" a="Coaches fill in a client profile — goal, fitness level, available equipment, and any injuries. We send this to Google Gemini 2.5 Flash via our backend Service. It returns a structured JSON program instantly." />
                        <FAQItem q="Is my data secure?" a="Yes. All data is protected by strict Spatie Role-Based Access Control (RBAC). Payment data never touches our servers — it's handled entirely by Stripe. We also maintain strict System Audit Logs." />
                        <FAQItem q="How does split payment work for clients?" a="Clients can choose to pay their membership fee in monthly instalments via Stripe. If a payment fails, the backend automatically flags their account as 'Overdue', and the Admin can trigger automated email reminders." />
                        <FAQItem q="How is the platform so fast?" a="We aggressively use Redis (Predis) caching. Our Analytics Dashboard, User Directories, and this CMS Landing page are all cached in RAM, eliminating heavy MySQL queries." />
                        <FAQItem q="Can I try it before committing?" a="Absolutely. The Starter plan is completely free and lets you onboard up to 5 clients with 10 AI program generations per month. No credit card required." />
                    </div>
                </section>

                {/* ── CONTACT ── */}
                <section id="contact" className="contact-section">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <div className="contact-label">Get in touch</div>
                            <h2 className="contact-title">Let's talk about your gym</h2>
                            <p className="contact-body">
                                Have questions? Send us a message or email us directly at{' '}
                                <a href={`mailto:${content?.contact_email || 'hello@aigym.io'}`} className="contact-email">
                                    {content?.contact_email || 'hello@aigym.io'}
                                </a>.
                            </p>
                            <div className="contact-perks">
                                {['Response within 24 hours', 'Free onboarding consultation', 'No commitment required'].map(p => (
                                    <div key={p} className="contact-perk">
                                        <div className="contact-perk-dot" />{p}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <form onSubmit={handleContactSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Full name</label>
                                    <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} placeholder="John Doe" className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" required value={data.email} onChange={e => setData('email', e.target.value)} placeholder="john@example.com" className="form-input" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea required rows={5} value={data.message} onChange={e => setData('message', e.target.value)} placeholder="Tell us about your gym and what you're looking for…" className="form-textarea form-input" />
                            </div>
                            <button type="submit" disabled={processing} className="form-submit">
                                <Mail size={16} /> Send Message
                            </button>
                        </form>
                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer className="footer">
                    <div className="footer-inner">
                        <a href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
                            <div className="nav-logo-mark"><Dumbbell size={16} /></div>
                            <span className="nav-logo-text">AI GYM</span>
                        </a>
                        <div className="footer-links">
                            {navLinks.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
                        </div>
                        <p className="footer-copy">© {new Date().getFullYear()} AI Gym. PFE Project.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
